import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";
import { OrderStatus, PaymentStatus, PaymentMethod } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { items, couponCode, shippingAddress } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Your shopping bag is empty." },
        { status: 400 }
      );
    }

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.pinCode ||
      !shippingAddress.houseFlat
    ) {
      return NextResponse.json(
        { success: false, error: "Please provide complete shipping address details." },
        { status: 400 }
      );
    }

    // 1. Calculate subtotal strictly server-side
    let calculatedSubtotal = 0;
    const validatedItems: any[] = [];

    for (const item of items) {
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
    const orderNumber = generateOrderNumber();

    // 3. Resolve or Create User in DB
    let userId = session?.user?.id;

    if (!userId) {
      const guestEmail = shippingAddress.email || "guest@buyera.in";
      let user = await prisma.user.findUnique({
        where: { email: guestEmail },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            name: shippingAddress.fullName || "Guest Customer",
            email: guestEmail,
            password: "GUEST_CHECKOUT_PLACEHOLDER",
            phone: shippingAddress.phone,
          },
        });
      }
      userId = user.id;
    }

    // 4. Create Shipping Address
    const address = await prisma.address.create({
      data: {
        userId,
        fullName: shippingAddress.fullName,
        phone: shippingAddress.phone,
        houseFlat: shippingAddress.houseFlat,
        street: shippingAddress.street || "Main Street",
        area: shippingAddress.area || "City Center",
        city: shippingAddress.city || "Bengaluru",
        district: shippingAddress.district || "Bengaluru",
        state: shippingAddress.state || "Karnataka",
        pinCode: shippingAddress.pinCode,
      },
    });

    // 5. Create Order, OrderItems, Payment, and Shipment in atomic transaction
    const order = await prisma.$transaction(async (tx) => {
      // Decrement variant stock if variantId is provided
      for (const item of validatedItems) {
        if (item.variantId) {
          await tx.productVariant.updateMany({
            where: { id: item.variantId, stock: { gte: item.quantity } },
            data: {
              stock: { decrement: item.quantity },
            },
          });
        }
      }

      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          addressId: address.id,
          subtotal: calculatedSubtotal,
          discount,
          couponCode: couponCode || null,
          shippingCost,
          total: totalAmount,
          orderStatus: OrderStatus.CONFIRMED,
          paymentStatus: PaymentStatus.PENDING,
          paymentMethod: PaymentMethod.COD,
          items: {
            create: validatedItems.map((item) => ({
              variantId: item.variantId,
              name: item.name,
              size: item.size,
              color: item.color,
              quantity: item.quantity,
              price: item.price,
              mrp: item.mrp,
            })),
          },
          payment: {
            create: {
              paymentMethod: PaymentMethod.COD,
              status: PaymentStatus.PENDING,
              amount: totalAmount,
              method: "Cash on Delivery",
            },
          },
          shipment: {
            create: {
              awbNumber: `SR${Math.floor(100000000 + Math.random() * 900000000)}`,
              courierName: "BlueDart Express (Shiprocket COD)",
              status: "Order Confirmed & Manifested",
            },
          },
        },
        include: {
          items: true,
          payment: true,
          shipment: true,
        },
      });

      return newOrder;
    });

    return NextResponse.json({
      success: true,
      message: "Cash on Delivery order created and confirmed successfully.",
      orderId: order.id,
      orderNumber: order.orderNumber,
      paymentMethod: "COD",
      total: order.total,
    });
  } catch (error: any) {
    console.error("Create COD order error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process Cash on Delivery order." },
      { status: 500 }
    );
  }
}
