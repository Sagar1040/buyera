import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function triggerRevalidation() {
  try {
    revalidatePath("/", "layout");
    revalidatePath("/shop", "page");
    revalidatePath("/admin/categories", "page");
  } catch (err) {
    console.warn("Revalidation warning:", err);
  }
}

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    const mapped = categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      imageUrl: c.imageUrl,
      bannerUrl: c.bannerUrl,
      badge: c.badge || "",
      isActive: c.isActive,
      order: c.order,
      productsCount: c._count.products || 0,
      createdAt: c.createdAt,
    }));

    return NextResponse.json({ success: true, categories: mapped });
  } catch (error: any) {
    console.warn("Categories fetch error:", error);
    return NextResponse.json(
      { success: false, categories: [], error: error.message || "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, slug, description, imageUrl, bannerUrl, badge, isActive = true, order = 0 } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Category name is required." },
        { status: 400 }
      );
    }

    const finalSlug =
      slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const newCategory = await prisma.category.create({
      data: {
        name: name.trim(),
        slug: finalSlug,
        description: description || "",
        imageUrl: imageUrl || "",
        bannerUrl: bannerUrl || "",
        badge: badge !== undefined ? badge.trim() : "COLLECTION",
        isActive: Boolean(isActive),
        order: Number(order) || 0,
      },
    });

    triggerRevalidation();

    return NextResponse.json({
      success: true,
      message: "Category created successfully.",
      category: newCategory,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create category." },
      { status: 500 }
    );
  }
}
