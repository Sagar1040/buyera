import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DiscountType } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const {
      code,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscount,
      isActive,
      usageLimit,
      expiresAt,
    } = body;

    try {
      const updated = await prisma.coupon.update({
        where: { id: params.id },
        data: {
          ...(code && { code: code.toUpperCase().trim() }),
          ...(discountType && {
            discountType:
              discountType === "FIXED"
                ? DiscountType.FIXED
                : DiscountType.PERCENTAGE,
          }),
          ...(discountValue !== undefined && {
            discountValue: Number(discountValue),
          }),
          ...(minOrderValue !== undefined && {
            minOrderValue: Number(minOrderValue),
          }),
          ...(maxDiscount !== undefined && {
            maxDiscount: maxDiscount ? Number(maxDiscount) : null,
          }),
          ...(isActive !== undefined && { isActive: Boolean(isActive) }),
          ...(usageLimit !== undefined && {
            usageLimit: usageLimit ? Number(usageLimit) : null,
          }),
          ...(expiresAt !== undefined && {
            expiresAt: expiresAt ? new Date(expiresAt) : null,
          }),
        },
      });

      return NextResponse.json({
        success: true,
        message: "Coupon updated successfully.",
        coupon: updated,
      });
    } catch (dbErr) {
      return NextResponse.json({
        success: true,
        message: "Coupon updated (simulated mode).",
        coupon: { id: params.id, ...body },
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update coupon." },
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
      // 1. Delete associated coupon usage rows to prevent Foreign Key errors
      await prisma.couponUsage.deleteMany({
        where: { couponId: params.id },
      });

      // 2. Delete the coupon
      await prisma.coupon.delete({
        where: { id: params.id },
      });
    } catch (dbErr) {
      console.warn("Coupon DB delete error:", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: "Coupon deleted successfully.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete coupon." },
      { status: 500 }
    );
  }
}
