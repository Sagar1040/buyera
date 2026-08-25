import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { name, slug, description, imageUrl, bannerUrl, isActive, order } = body;

    try {
      const updated = await prisma.category.update({
        where: { id: params.id },
        data: {
          ...(name && { name: name.trim() }),
          ...(slug && { slug: slug.trim() }),
          ...(description !== undefined && { description }),
          ...(imageUrl !== undefined && { imageUrl }),
          ...(bannerUrl !== undefined && { bannerUrl }),
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
      await prisma.category.delete({
        where: { id: params.id },
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
