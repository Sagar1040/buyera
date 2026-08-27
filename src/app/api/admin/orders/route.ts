import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "ALL";
    const payment = searchParams.get("payment") || "ALL";

    const where: any = {};
    if (status !== "ALL") where.orderStatus = status;
    if (payment !== "ALL") where.paymentMethod = payment;
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
        { shippingAddress: { fullName: { contains: search, mode: "insensitive" } } },
        { shippingAddress: { phone: { contains: search, mode: "insensitive" } } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        shippingAddress: true,
        items: true,
        payment: true,
        shipment: true,
      },
    });

    return NextResponse.json({
      success: true,
      orders: orders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        customerName: o.shippingAddress?.fullName || o.user?.name || "Guest Patron",
        customerEmail: o.user?.email || "guest@buyera.in",
        customerPhone: o.shippingAddress?.phone || o.user?.phone || "+91 9876543210",
        itemsCount: o.items.length,
        total: o.total,
        subtotal: o.subtotal,
        discount: o.discount,
        shippingCost: o.shippingCost,
        paymentMethod: o.paymentMethod,
        paymentStatus: o.paymentStatus,
        orderStatus: o.orderStatus,
        createdAt: o.createdAt,
        shippingAddress: o.shippingAddress,
        items: o.items,
        shipment: o.shipment,
      })),
    });
  } catch (error: any) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json({
      success: true,
      orders: [],
    });
  }
}

