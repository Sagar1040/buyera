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
      subtext: "Net margins: 64.2%",
      icon: DollarSign,
      color: "text-emerald-700 bg-emerald-50 border-emerald-200",
    },
    {
      title: "Total Orders",
      value: stats ? stats.totalOrders.toString() : "74",
      trend: `${stats?.pendingOrders || 8} awaiting dispatch`,
      subtext: "Fulfillment rate: 94%",
      icon: ShoppingBag,
      color: "text-amber-700 bg-amber-50 border-amber-200",
    },
    {
      title: "Registered Patrons",
      value: stats ? stats.totalCustomers.toString() : "128",
      trend: "+12 new this week",
      subtext: "Retention rate: 42%",
      icon: Users,
      color: "text-purple-700 bg-purple-50 border-purple-200",
    },
    {
      title: "Pending Deliveries",
      value: `${stats?.pendingOrders || 8}`,
      trend: "Shiprocket BlueDart Manifested",
      subtext: "Avg delivery: 2.8 days",
      icon: Truck,
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

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-canvas-border p-5 rounded-xs shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider text-charcoal/60 font-semibold">
                  {kpi.title}
                </span>
                <div className={`p-2 border rounded-xs ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="text-2xl font-bold text-charcoal tracking-tight">
                  {kpi.value}
                </div>
                <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
                  <ArrowUpRight className="w-3 h-3 shrink-0" />
                  {kpi.trend}
                </p>
              </div>

              <div className="pt-2 border-t border-canvas-border/60 text-[10px] text-charcoal/50 font-mono">
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
        <div className="bg-white border border-canvas-border p-6 rounded-xs shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-canvas-border pb-3">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-gold-dark font-semibold">
                TOP SILHOUETTES
              </span>
              <h2 className="font-editorial-heading text-lg text-charcoal">
                Bestselling Catalog
              </h2>
            </div>
            <Link
              href="/admin/products"
              className="text-[11px] text-gold-dark underline uppercase tracking-wider font-semibold"
            >
              All Items
            </Link>
          </div>

          <div className="space-y-3.5">
            {bestselling.map((prod, i) => (
              <div key={i} className="flex items-center gap-3 text-xs">
                <div className="relative w-12 h-14 bg-cream-100 border border-canvas-border shrink-0 overflow-hidden">
                  <Image
                    src={prod.image}
                    alt={prod.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-charcoal truncate">
                    {prod.name}
                  </p>
                  <p className="text-[10px] text-charcoal/50">{prod.category}</p>
                  <p className="text-[11px] font-mono font-bold text-charcoal mt-0.5">
                    {formatPrice(prod.revenue)}{" "}
                    <span className="text-[10px] font-normal text-emerald-700">
                      ({prod.sales})
                    </span>
                  </p>
                </div>

                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 border border-emerald-200">
                  {prod.growth}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Pipeline Table */}
      <div className="bg-white border border-canvas-border p-6 rounded-xs shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-canvas-border pb-3">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-gold-dark" />
            <h2 className="font-editorial-heading text-lg text-charcoal">
              Live Order Pipeline & Dispatches
            </h2>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs uppercase tracking-widest text-gold-dark hover:underline font-semibold flex items-center gap-1"
          >
            Manage All Orders <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-canvas-border text-charcoal/50 uppercase tracking-widest text-[11px]">
                <th className="py-3 px-3">Order Number</th>
                <th className="py-3 px-3">Patron Name</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Payment</th>
                <th className="py-3 px-3">Logistics Status</th>
                <th className="py-3 px-3 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-border">
              {(stats?.recentOrders || []).map((order: any) => (
                <tr key={order.id} className="hover:bg-cream-50 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-charcoal">
                    <Link
                      href="/admin/orders"
                      className="hover:underline text-gold-dark"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="py-3 px-3 font-semibold text-charcoal">
                    {order.customerName}
                  </td>
                  <td className="py-3 px-3 font-bold text-charcoal">
                    {formatPrice(order.total)}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] uppercase font-bold">
                      {order.paymentMethod} • {order.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 bg-cream-200 text-charcoal border border-canvas-border text-[10px] uppercase font-semibold">
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      href="/admin/orders"
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-charcoal text-white text-[11px] uppercase tracking-wider hover:bg-black rounded-xs"
                    >
                      Inspect Order
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
