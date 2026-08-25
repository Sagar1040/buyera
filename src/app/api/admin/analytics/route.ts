import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const monthlyRevenue = [
      { month: "Jan", revenue: 284000, orders: 34, aov: 8350 },
      { month: "Feb", revenue: 312000, orders: 39, aov: 8000 },
      { month: "Mar", revenue: 389000, orders: 48, aov: 8104 },
      { month: "Apr", revenue: 420000, orders: 54, aov: 7777 },
      { month: "May", revenue: 478000, orders: 61, aov: 7836 },
      { month: "Jun", revenue: 445000, orders: 58, aov: 7672 },
      { month: "Jul", revenue: 512000, orders: 66, aov: 7757 },
      { month: "Aug", revenue: 584000, orders: 74, aov: 7891 },
    ];

    const weeklyRevenue = [
      { day: "Mon", revenue: 42500, orders: 6 },
      { day: "Tue", revenue: 58900, orders: 8 },
      { day: "Wed", revenue: 64200, orders: 9 },
      { day: "Thu", revenue: 51000, orders: 7 },
      { day: "Fri", revenue: 78400, orders: 11 },
      { day: "Sat", revenue: 94200, orders: 14 },
      { day: "Sun", revenue: 88500, orders: 13 },
    ];

    const paymentSplit = [
      { method: "Prepaid Razorpay (UPI/Cards)", percentage: 68, amount: 397120 },
      { method: "Cash on Delivery (COD)", percentage: 32, amount: 186880 },
    ];

    const categoryPerformance = [
      { category: "Luxury Abayas", revenue: 298400, share: 51, units: 62 },
      { category: "Pakistani Churidars", revenue: 164500, share: 28, units: 21 },
      { category: "Premium Hijabs", revenue: 82400, share: 14, units: 58 },
      { category: "Islamic Maxi Dresses", revenue: 38700, share: 7, units: 9 },
    ];

    const bestsellingProducts = [
      {
        id: "p1",
        name: "Royal Emerald Hand-Embroidered Abaya",
        category: "Luxury Abayas",
        unitsSold: 38,
        revenue: 189962,
        stock: 38,
      },
      {
        id: "p2",
        name: "Lahore Velvet Embroidered Anarkali",
        category: "Pakistani Churidars",
        unitsSold: 16,
        revenue: 143984,
        stock: 16,
      },
      {
        id: "p3",
        name: "Pure Medina Silk Luxury Shayla",
        category: "Premium Hijabs",
        unitsSold: 45,
        revenue: 67500,
        stock: 45,
      },
      {
        id: "p4",
        name: "Dubai Farasha Royal Cut Black Abaya",
        category: "Luxury Abayas",
        unitsSold: 18,
        revenue: 89982,
        stock: 24,
      },
    ];

    return NextResponse.json({
      success: true,
      analytics: {
        totalRevenue: 584000,
        growthPercentage: "+18.4%",
        monthlyRevenue,
        weeklyRevenue,
        paymentSplit,
        categoryPerformance,
        bestsellingProducts,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load analytics" },
      { status: 500 }
    );
  }
}
