import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    let session = null;
    try {
      session = await getServerSession(authOptions);
    } catch (authErr) {
      console.warn("Session lookup skipped during guest checkout:", authErr);
    }

    const body = await req.json();
    const { items, couponCode, shippingAddress } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Shopping bag is empty" },
        { status: 400 }
      );
    }

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.pinCode
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Please provide complete shipping address details.",
        },
        { status: 400 }
      );
    }

    const key_id =
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
      process.env.RAZORPAY_KEY_ID ||
      "rzp_live_TTYXQgDrOD0xtU";
    const key_secret =
      process.env.RAZORPAY_KEY_SECRET || "6eFjihpE3G22DZ3q9lzCpVCH";

    const razorpay = new Razorpay({
      key_id,
      key_secret,
    });

    // 1. Calculate subtotal
    let calculatedSubtotal = 0;
    const validatedItems: any[] = [];

    for (const item of items) {
      let unitPrice = item.price || 999;
      try {
        if (item.productId) {
          const dbProduct = await prisma.product.findUnique({
            where: { id: item.productId },
          });
          if (dbProduct) {
            unitPrice = dbProduct.price;
          }
        }
      } catch (err) {
        unitPrice = item.price || 999;
      }

      calculatedSubtotal += unitPrice * item.quantity;
      validatedItems.push({
        productId: item.productId || item.id,
        variantId: item.variantId || null,
        name: item.name,
        size: item.size || null,
        color: item.color || null,
        quantity: item.quantity,
        price: unitPrice,
        mrp: item.mrp || unitPrice,
      });
    }

    // 2. Coupon discount
    let discount = 0;
    if (couponCode) {
      const formattedCoupon = couponCode.toUpperCase().trim();
      if (formattedCoupon === "BUYERA10" && calculatedSubtotal >= 1999) {
        discount = Math.min(1000, Math.round((calculatedSubtotal * 10) / 100));
      } else if (formattedCoupon === "ROYAL500" && calculatedSubtotal >= 3999) {
        discount = 500;
      }
    }

    const freeShippingThreshold = 999;
    const shippingCost = calculatedSubtotal >= freeShippingThreshold ? 0 : 99;
    const totalAmount = Math.max(0, calculatedSubtotal - discount + shippingCost);

    // 3. Amount in integer paise
    const amountInPaise = Math.round(totalAmount * 100);
    const receipt = generateOrderNumber().slice(0, 38);

    const rzpOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt,
      notes: {
        customerName: shippingAddress.fullName,
        customerEmail:
          session?.user?.email || shippingAddress.email || "guest@buyera.in",
        customerPhone: shippingAddress.phone,
      },
    });

    return NextResponse.json({
      success: true,
      orderId: rzpOrder.id,
      amount: amountInPaise,
      currency: "INR",
      key: key_id,
      orderNumber: receipt,
      subtotal: calculatedSubtotal,
      discount,
      shippingCost,
      total: totalAmount,
      items: validatedItems,
      shippingAddress,
    });
  } catch (error: any) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to initialize Razorpay order.",
      },
      { status: 500 }
    );
  }
}
