import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "ALL";

    const where: any = {};
    if (role !== "ALL") where.role = role;
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
        _count: {
          select: { orders: true },
        },
        addresses: true,
      },
    });

    const mapped = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone || "Not Provided",
      role: u.role,
      ordersCount: u._count.orders,
      addresses: u.addresses,
      createdAt: u.createdAt,
    }));

    return NextResponse.json({ success: true, users: mapped });
  } catch (error: any) {
    console.error("Failed to load users:", error);
    return NextResponse.json({ success: true, users: [] });
  }
}
