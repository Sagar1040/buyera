"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  ArrowUpRight,
  PlusCircle,
  Truck,
  DollarSign,
  AlertTriangle,
  RefreshCw,
  TicketPercent,
  CheckCircle2,
  FolderTree,
  ExternalLink,
  BarChart3,
  Calendar,
  Layers,
  ArrowRight,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [chartView, setChartView] = useState<"MONTHLY" | "WEEKLY">("MONTHLY");
  const [chartType, setChartType] = useState<"AREA" | "BAR">("BAR");

  const monthlyData = [
    { label: "Jan", revenue: 284000, height: 48 },
    { label: "Feb", revenue: 312000, height: 53 },
    { label: "Mar", revenue: 389000, height: 66 },
    { label: "Apr", revenue: 420000, height: 71 },
    { label: "May", revenue: 478000, height: 81 },
    { label: "Jun", revenue: 445000, height: 76 },
    { label: "Jul", revenue: 512000, height: 87 },
    { label: "Aug", revenue: 584000, height: 100 },
  ];

  const weeklyData = [
    { label: "Mon", revenue: 42500, height: 45 },
    { label: "Tue", revenue: 58900, height: 62 },
    { label: "Wed", revenue: 64200, height: 68 },
    { label: "Thu", revenue: 51000, height: 54 },
    { label: "Fri", revenue: 78400, height: 83 },
    { label: "Sat", revenue: 94200, height: 100 },
    { label: "Sun", revenue: 88500, height: 94 },
  ];

  const bestselling = [
    {
      name: "Royal Emerald Hand-Embroidered Abaya",
      category: "Luxury Abayas",
      sales: "38 units",
      revenue: 189962,
      growth: "+24%",
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=200",
    },
    {
      name: "Lahore Velvet Embroidered Anarkali",
      category: "Pakistani Churidars",
      sales: "16 units",
      revenue: 143984,
      growth: "+18%",
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=200",
    },
    {
      name: "Pure Medina Silk Luxury Shayla",
      category: "Premium Hijabs",
      sales: "45 units",
      revenue: 67500,
      growth: "+35%",
      image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=200",
    },
    {
      name: "Dubai Farasha Royal Cut Black Abaya",
      category: "Luxury Abayas",
      sales: "18 units",
      revenue: 89982,
      growth: "+12%",
      image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=200",
    },
  ];

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to load admin stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const activeChartData = chartView === "MONTHLY" ? monthlyData : weeklyData;

  const kpis = [
    {
      title: "Gross Sales Revenue",
      value: stats ? formatPrice(stats.totalRevenue) : "₹5,84,000",
      trend: "+18.4% vs last period",
      subtext: "Live revenue snapshot",
      icon: DollarSign,
      color: "text-emerald-700 bg-emerald-50 border-emerald-200",
    },
    {
      title: "Total Orders",
      value: stats ? stats.totalOrders.toString() : "42",
      trend: `${stats?.pendingOrders || 8} awaiting dispatch`,
      subtext: "Fulfillment rate: 94%",
      icon: ShoppingBag,
      color: "text-amber-700 bg-amber-50 border-amber-200",
    },
    {
      title: "Catalog Products",
      value: stats ? stats.totalProducts.toString() : "16",
      trend: `${stats?.lowStockCount || 3} low stock items`,
      subtext: "Live active silhouettes",
      icon: Package,
      color: "text-gold-dark bg-gold/10 border-gold/30",
    },
    {
      title: "Registered Patrons",
      value: stats ? stats.totalCustomers.toString() : "128",
      trend: "+12 new patrons",
      subtext: "VIP loyalty members",
      icon: Users,
      color: "text-purple-700 bg-purple-50 border-purple-200",
    },
    {
      title: "Active Promotions",
      value: stats ? `${stats.activeCoupons || 4} Coupons` : "4 Coupons",
      trend: "Discounts live",
      subtext: "Cart incentives active",
      icon: TicketPercent,
      color: "text-blue-700 bg-blue-50 border-blue-200",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-canvas-border pb-5">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-gold font-semibold font-mono">
            BUYERA ATELIER OPERATIONS
          </span>
          <h1 className="font-editorial-heading text-2xl sm:text-3xl text-charcoal">
            Executive Overview & Sales Performance
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={fetchStats}
            variant="outline"
            size="sm"
            className="text-xs uppercase tracking-wider"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Link href="/admin/products/new">
            <Button variant="primary" size="sm" className="text-xs uppercase tracking-wider">
              <PlusCircle className="w-3.5 h-3.5 mr-1.5 text-gold" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* 5 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-canvas-border p-4 rounded-xs shadow-xs space-y-2.5 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-charcoal/60 font-semibold">
                  {kpi.title}
                </span>
                <div className={`p-1.5 border rounded-xs ${kpi.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <div className="text-xl font-bold text-charcoal tracking-tight">
                  {kpi.value}
                </div>
                <p className="text-[10px] text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
                  <ArrowUpRight className="w-3 h-3 shrink-0" />
                  {kpi.trend}
                </p>
              </div>

              <div className="pt-2 border-t border-canvas-border/60 text-[9px] text-charcoal/50 font-mono">
                {kpi.subtext}
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Grid: Interactive Revenue Chart & Bestselling Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart Widget */}
        <div className="lg:col-span-2 bg-white border border-canvas-border p-6 rounded-xs shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-canvas-border pb-4">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-gold-dark font-semibold">
                FINANCIAL TRENDLINE
              </span>
              <h2 className="font-editorial-heading text-lg text-charcoal">
                Revenue & Sales Trajectory
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-cream-100 p-0.5 border border-canvas-border flex rounded-xs text-[10px] uppercase font-semibold">
                <button
                  onClick={() => setChartView("MONTHLY")}
                  className={`px-2.5 py-1 transition-all ${
                    chartView === "MONTHLY"
                      ? "bg-charcoal text-white shadow-xs"
                      : "text-charcoal/60 hover:text-charcoal"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setChartView("WEEKLY")}
                  className={`px-2.5 py-1 transition-all ${
                    chartView === "WEEKLY"
                      ? "bg-charcoal text-white shadow-xs"
                      : "text-charcoal/60 hover:text-charcoal"
                  }`}
                >
                  Weekly
                </button>
              </div>

              <Link
                href="/admin/analytics"
                className="p-1.5 border border-canvas-border hover:bg-cream-50 text-charcoal/70 rounded-xs"
                title="Full Analytics"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Interactive Bar Chart Visualization */}
          <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 pt-8 px-2">
            {activeChartData.map((item, i) => (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer"
              >
                {/* Tooltip on Hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-charcoal text-white text-[10px] font-mono px-2 py-1 rounded-xs pointer-events-none shadow-md">
                  {formatPrice(item.revenue)}
                </div>

                {/* Bar */}
                <div
                  style={{ height: `${item.height}%` }}
                  className="w-full max-w-[42px] bg-cream-200 group-hover:bg-[#C5A880] transition-all rounded-t-xs relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 to-transparent" />
                </div>

                {/* Label */}
                <span className="text-[10px] font-mono uppercase text-charcoal/60 group-hover:text-charcoal font-semibold">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-canvas-border pt-3 text-xs text-charcoal/60">
            <span>Peak Period: August (₹5,84,000)</span>
            <span className="font-semibold text-emerald-700">
              Avg Growth Rate: +18.4% MoM
            </span>
          </div>
        </div>

        {/* Bestselling Silhouettes Widget */}
        <div className="bg-white border border-canvas-border p-6 rounded-xs shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-canvas-border pb-3">
              <h2 className="font-editorial-heading text-lg text-charcoal">
                Bestselling Silhouettes
              </h2>
              <span className="text-[10px] font-mono uppercase text-gold-dark font-semibold">
                Top Performers
              </span>
            </div>

            <div className="divide-y divide-canvas-border/60 mt-3">
              {bestselling.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center gap-3">
                  <div className="w-10 h-12 bg-cream-100 shrink-0 border border-canvas-border relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-charcoal truncate">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-charcoal/50">
                      {item.category} • {item.sales}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold font-mono text-charcoal">
                      {formatPrice(item.revenue)}
                    </p>
                    <span className="text-[9px] font-bold text-emerald-700 font-mono">
                      {item.growth}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/admin/products"
            className="text-xs text-center uppercase tracking-wider font-semibold text-charcoal hover:text-gold-dark transition-colors pt-3 border-t border-canvas-border block"
          >
            View Complete Catalog →
          </Link>
        </div>
      </div>

      {/* Two Column Grid: Recent Orders & Inventory Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Pipeline */}
        <div className="lg:col-span-2 bg-white border border-canvas-border p-6 rounded-xs shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-canvas-border pb-3">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-gold-dark font-semibold">
                DISPATCH PIPELINE
              </span>
              <h2 className="font-editorial-heading text-lg text-charcoal">
                Recent Orders Awaiting Dispatch
              </h2>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs text-gold-dark hover:text-charcoal font-semibold uppercase tracking-wider flex items-center gap-1"
            >
              All Orders ({stats?.totalOrders || 42}) →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-canvas-border text-[10px] text-charcoal/50 uppercase tracking-wider">
                  <th className="pb-2">Order #</th>
                  <th className="pb-2">Patron</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Payment</th>
                  <th className="pb-2">Fulfillment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-canvas-border/50">
                {(stats?.recentOrders || []).map((ord: any) => (
                  <tr key={ord.id} className="hover:bg-cream-50 transition-colors">
                    <td className="py-3 font-mono font-semibold text-charcoal">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3">
                      <p className="font-medium text-charcoal">{ord.customerName}</p>
                      <p className="text-[10px] text-charcoal/50">{ord.customerEmail}</p>
                    </td>
                    <td className="py-3 font-mono font-bold text-charcoal">
                      {formatPrice(ord.total)}
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 bg-cream-100 border border-canvas-border text-[9px] uppercase font-bold">
                        {ord.paymentMethod} • {ord.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 text-[9px] uppercase font-bold border ${
                          ord.orderStatus === "DELIVERED"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : ord.orderStatus === "SHIPPED"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {ord.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white border border-canvas-border p-6 rounded-xs shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-canvas-border pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h2 className="font-editorial-heading text-lg text-charcoal">
                  Low Stock Alerts
                </h2>
              </div>
              <span className="text-[10px] font-mono uppercase bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 font-bold">
                Action Required
              </span>
            </div>

            <div className="divide-y divide-canvas-border/60 mt-3 space-y-1">
              {(stats?.lowStockProducts || []).map((item: any) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-charcoal truncate max-w-[170px]">
                      {item.name}
                    </p>
                    <p className="text-[10px] font-mono text-charcoal/50">
                      Size {item.size} • {item.color}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 font-mono font-bold text-[10px]">
                      Only {item.stock} left
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/admin/products"
            className="text-xs text-center uppercase tracking-wider font-semibold text-charcoal hover:text-gold-dark transition-colors pt-3 border-t border-canvas-border block"
          >
            Manage Stock Inventory →
          </Link>
        </div>
      </div>
    </div>
  );
}
