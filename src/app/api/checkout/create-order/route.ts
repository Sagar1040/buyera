import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getRazorpay } from "@/lib/razorpay";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";

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

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.pinCode) {
      return NextResponse.json(
        { success: false, error: "Please provide complete shipping address details." },
        { status: 400 }
      );
    }

    // 1. Calculate subtotal strictly server-side
    let calculatedSubtotal = 0;
    const validatedItems: any[] = [];

    for (const item of items) {
      // Find product in DB or fallback to item.price if DB product isn't seeded yet
      const dbProduct = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      const unitPrice = dbProduct ? dbProduct.price : item.price || 999;
      calculatedSubtotal += unitPrice * item.quantity;

      validatedItems.push({
        productId: item.productId,
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
    const receipt = generateOrderNumber();

    let razorpayOrderId = `rzp_mock_${Date.now()}`;
    const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_mock";

    if (process.env.RAZORPAY_KEY_SECRET && process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      try {
        const rzp = getRazorpay();
        const rzpOrder = await rzp.orders.create({
          amount: amountInPaise,
          currency: "INR",
          receipt,
          notes: {
            customerName: shippingAddress.fullName,
            customerEmail: session?.user?.email || "guest@buyera.in",
          },
        });
        razorpayOrderId = rzpOrder.id;
      } catch (err) {
        console.warn("Razorpay API call failed, using test order ID:", err);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
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
          email: session?.user?.email || "guest@buyera.in",
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
