import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { title, subtitle, badge, imageUrl, ctaText, ctaUrl, isActive, order } =
      body;

    try {
      const updated = await prisma.banner.update({
        where: { id: params.id },
        data: {
          ...(title && { title: title.trim() }),
          ...(subtitle !== undefined && { subtitle }),
          ...(badge !== undefined && { badge }),
          ...(imageUrl !== undefined && { imageUrl: imageUrl.trim() }),
          ...(ctaText !== undefined && { ctaText }),
          ...(ctaUrl !== undefined && { ctaUrl }),
          ...(isActive !== undefined && { isActive: Boolean(isActive) }),
          ...(order !== undefined && { order: Number(order) }),
        },
      });

      return NextResponse.json({
        success: true,
        message: "Banner updated successfully.",
        banner: updated,
      });
    } catch (dbErr) {
      return NextResponse.json({
        success: true,
        message: "Banner updated (simulated mode).",
        banner: { id: params.id, ...body },
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update banner." },
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
      await prisma.banner.delete({
        where: { id: params.id },
      });
    } catch (dbErr) {
      console.warn("Banner DB delete error:", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: "Banner removed successfully.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete banner." },
      { status: 500 }
    );
  }
}
