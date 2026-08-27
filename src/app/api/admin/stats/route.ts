import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [
      orders,
      productsCount,
      usersCount,
      couponsCount,
      variants,
      recentDbOrders,
    ] = await Promise.all([
      prisma.order.findMany({
        select: { total: true, orderStatus: true, paymentStatus: true, createdAt: true },
      }),
      prisma.product.count(),
      prisma.user.count(),
      prisma.coupon.count({ where: { isActive: true } }),
      prisma.productVariant.findMany({
        where: { stock: { lte: 5 } },
        include: { product: true },
        take: 10,
      }),
      prisma.order.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        include: {
          user: true,
          shippingAddress: true,
          items: true,
        },
      }),
    ]);

    const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);
    const pendingOrders = orders.filter(
      (o) =>
        o.orderStatus === "PLACED" ||
        o.orderStatus === "CONFIRMED" ||
        o.orderStatus === "PROCESSING" ||
        o.orderStatus === "PACKED"
    ).length;

    // Monthly chart aggregation from real orders
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const monthlyMap: Record<string, number> = {};
    for (let i = 7; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = monthNames[d.getMonth()];
      monthlyMap[key] = 0;
    }

    orders.forEach((o) => {
      const d = new Date(o.createdAt);
      const key = monthNames[d.getMonth()];
      if (monthlyMap[key] !== undefined) {
        monthlyMap[key] += o.total || 0;
      }
    });

    const maxMonthlyRev = Math.max(...Object.values(monthlyMap), 1);
    const monthlyData = Object.entries(monthlyMap).map(([label, revenue]) => ({
      label,
      revenue,
      height: revenue > 0 ? Math.round((revenue / maxMonthlyRev) * 100) : 0,
    }));

    // Weekly chart aggregation (last 7 days)
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeklyMap: Record<string, number> = {
      Mon: 0,
      Tue: 0,
      Wed: 0,
      Thu: 0,
      Fri: 0,
      Sat: 0,
      Sun: 0,
    };

    orders.forEach((o) => {
      const d = new Date(o.createdAt);
      const diffDays = (now.getTime() - d.getTime()) / (1000 * 3600 * 24);
      if (diffDays <= 7) {
        const day = dayNames[d.getDay()];
        if (weeklyMap[day] !== undefined) {
          weeklyMap[day] += o.total || 0;
        }
      }
    });

    const maxWeeklyRev = Math.max(...Object.values(weeklyMap), 1);
    const weeklyData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label) => ({
      label,
      revenue: weeklyMap[label] || 0,
      height: weeklyMap[label] > 0 ? Math.round(((weeklyMap[label] || 0) / maxWeeklyRev) * 100) : 0,
    }));

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders: orders.length,
        pendingOrders,
        totalProducts: productsCount,
        totalCustomers: usersCount,
        activeCoupons: couponsCount,
        lowStockCount: variants.length,
        monthlyData,
        weeklyData,
        recentOrders: recentDbOrders.map((ord) => ({
          id: ord.id,
          orderNumber: ord.orderNumber,
          customerName:
            ord.shippingAddress?.fullName ||
            ord.user?.name ||
            "Patron",
          customerEmail: ord.user?.email || "customer@buyera.in",
          itemsCount: ord.items?.length || 1,
          total: ord.total,
          paymentMethod: ord.paymentMethod,
          paymentStatus: ord.paymentStatus,
          orderStatus: ord.orderStatus,
          createdAt: ord.createdAt,
        })),
        lowStockProducts: variants.map((v) => ({
          id: v.id,
          name: v.product?.name || "Boutique Silhouette",
          sku: v.sku,
          size: v.size,
          color: v.color,
          stock: v.stock,
        })),
      },
    });
  } catch (error: any) {
    console.error("Error loading stats:", error);
    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue: 0,
        totalOrders: 0,
        pendingOrders: 0,
        totalProducts: 0,
        totalCustomers: 0,
        activeCoupons: 0,
        lowStockCount: 0,
        monthlyData: [],
        weeklyData: [],
        recentOrders: [],
        lowStockProducts: [],
      },
    });
  }
}

