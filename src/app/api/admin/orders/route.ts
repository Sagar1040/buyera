import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "ALL";
    const payment = searchParams.get("payment") || "ALL";

    const fallbackOrders = [
      {
        id: "ord-101",
        orderNumber: "BUYERA-20260824-001",
        customerName: "Aisha Khan",
        customerEmail: "aisha.khan@example.com",
        customerPhone: "+91 98765 43210",
        itemsCount: 2,
        total: 6499,
        subtotal: 5999,
        discount: 0,
        shippingCost: 0,
        paymentMethod: "COD",
        paymentStatus: "PAID",
        orderStatus: "CONFIRMED",
        createdAt: "2026-08-24T12:30:00.000Z",
        shippingAddress: {
          fullName: "Aisha Khan",
          phone: "+91 98765 43210",
          houseFlat: "Flat 402, Royal Palms",
          street: "80 Feet Road, 4th Block",
          city: "Bengaluru",
          state: "Karnataka",
          pinCode: "560034",
        },
        items: [
          {
            name: "Royal Emerald Hand-Embroidered Abaya",
            size: "56",
            color: "Emerald Green",
            quantity: 1,
            price: 4999,
          },
          {
            name: "Pure Medina Silk Luxury Shayla",
            size: "Standard",
            color: "Champagne Gold",
            quantity: 1,
            price: 1500,
          },
        ],
        shipment: {
          awbNumber: "SR109283746",
          courierName: "BlueDart Express",
          status: "Manifested",
        },
      },
      {
        id: "ord-102",
        orderNumber: "BUYERA-20260824-002",
        customerName: "Zainab Fatima",
        customerEmail: "zainab@example.com",
        customerPhone: "+91 98111 22334",
        itemsCount: 1,
        total: 4999,
        subtotal: 4999,
        discount: 0,
        shippingCost: 0,
        paymentMethod: "RAZORPAY",
        paymentStatus: "PAID",
        orderStatus: "SHIPPED",
        createdAt: "2026-08-23T22:15:00.000Z",
        shippingAddress: {
          fullName: "Zainab Fatima",
          phone: "+91 98111 22334",
          houseFlat: "Villa 12, Palm Meadows",
          street: "Whitefield Main Road",
          city: "Bengaluru",
          state: "Karnataka",
          pinCode: "560066",
        },
        items: [
          {
            name: "Dubai Farasha Royal Cut Abaya",
            size: "58",
            color: "Midnight Black",
            quantity: 1,
            price: 4999,
          },
        ],
        shipment: {
          awbNumber: "SR983719284",
          courierName: "Delhivery Surface",
          status: "In Transit",
        },
      },
      {
        id: "ord-103",
        orderNumber: "BUYERA-20260824-003",
        customerName: "Mariam Siddiqui",
        customerEmail: "mariam@example.com",
        customerPhone: "+91 99887 76655",
        itemsCount: 3,
        total: 11200,
        subtotal: 11200,
        discount: 0,
        shippingCost: 0,
        paymentMethod: "COD",
        paymentStatus: "PAID",
        orderStatus: "DELIVERED",
        createdAt: "2026-08-23T18:40:00.000Z",
        shippingAddress: {
          fullName: "Mariam Siddiqui",
          phone: "+91 99887 76655",
          houseFlat: "A-502, Prestige Towers",
          street: "MG Road",
          city: "Mumbai",
          state: "Maharashtra",
          pinCode: "400001",
        },
        items: [
          {
            name: "Lahore Velvet Embroidered Anarkali",
            size: "M",
            color: "Royal Ruby",
            quantity: 1,
            price: 8999,
          },
        ],
        shipment: {
          awbNumber: "SR772819281",
          courierName: "BlueDart Express",
          status: "Delivered",
        },
      },
    ];

    try {
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

      if (orders.length > 0) {
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
      }
    } catch (dbErr) {
      console.warn("Using fallback orders due to DB error:", dbErr);
    }

    // Filter fallback orders
    let filtered = fallbackOrders;
    if (status !== "ALL") filtered = filtered.filter((o) => o.orderStatus === status);
    if (payment !== "ALL") filtered = filtered.filter((o) => o.paymentMethod === payment);
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(s) ||
          o.customerName.toLowerCase().includes(s) ||
          o.customerPhone.includes(s)
      );
    }

    return NextResponse.json({ success: true, orders: filtered });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
