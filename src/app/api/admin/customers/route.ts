import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        orders: {
          select: {
            id: true,
            orderNumber: true,
            total: true,
            orderStatus: true,
            createdAt: true,
          },
        },
        addresses: true,
      },
    });

    const mapped = users.map((u) => {
      const totalSpent = u.orders.reduce((acc, o) => acc + (o.total || 0), 0);
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone || "Not Provided",
        role: u.role,
        totalSpent,
        ordersCount: u.orders.length,
        recentOrders: u.orders.slice(0, 3),
        addresses: u.addresses,
        status: "ACTIVE",
        joinedDate: u.createdAt,
      };
    });

    return NextResponse.json({ success: true, customers: mapped });
  } catch (error: any) {
    console.error("Failed to load customers:", error);
    return NextResponse.json({ success: true, customers: [] });
  }
}
