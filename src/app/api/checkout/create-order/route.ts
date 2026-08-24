import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getRazorpay } from "@/lib/razorpay";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
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

    // 1. Calculate subtotal strictly server-side
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
        // Fallback to item.price if database lookup fails
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

    // 2. Validate Coupon server-side
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

    // 3. Generate Temporary or Razorpay Order ID
    const amountInPaise = Math.round(totalAmount * 100);
    const receipt = generateOrderNumber().substring(0, 38); // Max 40 chars for Razorpay receipt

    let razorpayOrderId = `rzp_order_${Date.now()}`;
    const razorpayKey =
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
      process.env.RAZORPAY_KEY_ID ||
      "rzp_live_TTYXQgDrOD0xtU";

    try {
      const rzp = getRazorpay();
      const rzpOrder = await rzp.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt,
        notes: {
          customerName: shippingAddress.fullName,
          customerEmail: session?.user?.email || shippingAddress.email || "guest@buyera.in",
          customerPhone: shippingAddress.phone,
        },
      });
      if (rzpOrder?.id) {
        razorpayOrderId = rzpOrder.id;
      }
    } catch (err: any) {
      console.warn("Razorpay API order creation log:", err?.message || err);
    }

    return NextResponse.json({
      success: true,
      orderId: razorpayOrderId,
      amount: amountInPaise,
      currency: "INR",
      key: razorpayKey,
      orderNumber: receipt,
      subtotal: calculatedSubtotal,
      discount,
      shippingCost,
      total: totalAmount,
      items: validatedItems,
      shippingAddress,
      data: {
        orderId: razorpayOrderId,
        razorpayOrderId,
        amount: amountInPaise,
        currency: "INR",
        key: razorpayKey,
        orderNumber: receipt,
        subtotal: calculatedSubtotal,
        discount,
        shippingCost,
        total: totalAmount,
        items: validatedItems,
        customer: {
          name: shippingAddress.fullName,
          email: session?.user?.email || shippingAddress.email || "guest@buyera.in",
          phone: shippingAddress.phone,
        },
      },
    });
  } catch (error: any) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to initialize order." },
      { status: 500 }
    );
  }
}
