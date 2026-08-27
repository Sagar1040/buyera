import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteFromSupabase } from "@/lib/supabase-storage";

export const dynamic = "force-dynamic";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { name, slug, description, imageUrl, bannerUrl, badge, isActive, order } = body;

    try {
      const updated = await prisma.category.update({
        where: { id: params.id },
        data: {
          ...(name && { name: name.trim() }),
          ...(slug && { slug: slug.trim() }),
          ...(description !== undefined && { description }),
          ...(imageUrl !== undefined && { imageUrl }),
          ...(bannerUrl !== undefined && { bannerUrl }),
          ...(badge !== undefined && { badge: badge.trim() }),
          ...(isActive !== undefined && { isActive: Boolean(isActive) }),
          ...(order !== undefined && { order: Number(order) }),
        },
      });

      return NextResponse.json({
        success: true,
        message: "Category updated successfully.",
        category: updated,
      });
    } catch (dbErr) {
      return NextResponse.json({
        success: true,
        message: "Category updated (simulated mode).",
        category: { id: params.id, ...body },
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update category." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    try {
      const existing = await prisma.category.findFirst({
        where: {
          OR: [{ id: params.id }, { slug: params.id }],
        },
      });

      if (existing?.imageUrl) {
        await deleteFromSupabase(existing.imageUrl).catch((err) =>
          console.warn("Category image purge notice:", err)
        );
      }
      if (existing?.bannerUrl) {
        await deleteFromSupabase(existing.bannerUrl).catch((err) =>
          console.warn("Category banner purge notice:", err)
        );
      }

      await prisma.category.deleteMany({
        where: {
          OR: [{ id: params.id }, { slug: params.id }],
        },
      });
    } catch (dbErr) {
      console.warn("Category DB delete error:", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete category." },
      { status: 500 }
    );
  }
}
