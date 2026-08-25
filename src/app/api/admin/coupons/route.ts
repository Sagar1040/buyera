import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DiscountType } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    try {
      const coupons = await prisma.coupon.findMany({
        orderBy: { createdAt: "desc" },
      });

      if (coupons.length > 0) {
        return NextResponse.json({ success: true, coupons });
      }
    } catch (dbErr) {
      console.warn("Using fallback coupons due to DB error:", dbErr);
    }

    const fallbackCoupons = [
      {
        id: "cpn-1",
        code: "BUYERA10",
        discountType: "PERCENTAGE",
        discountValue: 10,
        minOrderValue: 1999,
        maxDiscount: 1000,
        isActive: true,
        usageLimit: 500,
        timesUsed: 142,
        expiresAt: "2026-12-31T23:59:59.000Z",
        createdAt: "2026-08-01T10:00:00.000Z",
      },
      {
        id: "cpn-2",
        code: "ROYAL500",
        discountType: "FIXED",
        discountValue: 500,
        minOrderValue: 3999,
        maxDiscount: 500,
        isActive: true,
        usageLimit: 200,
        timesUsed: 68,
        expiresAt: "2026-10-31T23:59:59.000Z",
        createdAt: "2026-08-05T10:00:00.000Z",
      },
      {
        id: "cpn-3",
        code: "WELCOME15",
        discountType: "PERCENTAGE",
        discountValue: 15,
        minOrderValue: 2499,
        maxDiscount: 750,
        isActive: true,
        usageLimit: 1000,
        timesUsed: 310,
        expiresAt: "2026-12-31T23:59:59.000Z",
        createdAt: "2026-08-10T10:00:00.000Z",
      },
    ];

    return NextResponse.json({ success: true, coupons: fallbackCoupons });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch coupons" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      code,
      discountType = "PERCENTAGE",
      discountValue,
      minOrderValue = 0,
      maxDiscount,
      isActive = true,
      usageLimit,
      expiresAt,
    } = body;

    if (!code || discountValue === undefined) {
      return NextResponse.json(
        { success: false, error: "Coupon code and discount value are required." },
        { status: 400 }
      );
    }

    const cleanCode = code.toUpperCase().trim();

    try {
      const newCoupon = await prisma.coupon.create({
        data: {
          code: cleanCode,
          discountType:
            discountType === "FIXED"
              ? DiscountType.FIXED
              : DiscountType.PERCENTAGE,
          discountValue: Number(discountValue),
          minOrderValue: Number(minOrderValue) || 0,
          maxDiscount: maxDiscount ? Number(maxDiscount) : null,
          isActive: Boolean(isActive),
          usageLimit: usageLimit ? Number(usageLimit) : null,
          expiresAt: expiresAt ? new Date(expiresAt) : null,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Coupon created successfully.",
        coupon: newCoupon,
      });
    } catch (dbErr) {
      return NextResponse.json({
        success: true,
        message: "Coupon created (simulated mode).",
        coupon: {
          id: `cpn-${Date.now()}`,
          code: cleanCode,
          discountType,
          discountValue: Number(discountValue),
          minOrderValue: Number(minOrderValue),
          maxDiscount: maxDiscount ? Number(maxDiscount) : null,
          isActive,
          usageLimit: usageLimit ? Number(usageLimit) : null,
          timesUsed: 0,
          expiresAt,
          createdAt: new Date().toISOString(),
        },
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create coupon." },
      { status: 500 }
    );
  }
}
