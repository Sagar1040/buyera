import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function triggerRevalidation() {
  try {
    revalidatePath("/", "layout");
    revalidatePath("/admin/banners", "page");
  } catch (err) {
    console.warn("Revalidation warning:", err);
  }
}

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ success: true, banners });
  } catch (error: any) {
    console.warn("Banners fetch error:", error);
    return NextResponse.json(
      { success: false, banners: [], error: error.message || "Failed to fetch banners" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      subtitle,
      badge,
      imageUrl,
      ctaText = "SHOP NOW",
      ctaUrl,
      ctaLink,
      isActive = true,
      order = 0,
    } = body;

    const finalCta = (ctaUrl || ctaLink || "/shop").trim();

    if (!title || !imageUrl) {
      return NextResponse.json(
        { success: false, error: "Banner title and image URL are required." },
        { status: 400 }
      );
    }

    const newBanner = await prisma.banner.create({
      data: {
        title: title.trim(),
        subtitle: subtitle || "",
        badge: badge || "",
        imageUrl: imageUrl.trim(),
        ctaText: ctaText || "SHOP NOW",
        ctaUrl: finalCta,
        isActive: Boolean(isActive),
        order: Number(order) || 0,
      },
    });

    triggerRevalidation();

    return NextResponse.json({
      success: true,
      message: "Banner published successfully.",
      banner: newBanner,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create banner." },
      { status: 500 }
    );
  }
}
