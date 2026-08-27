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
  Sparkles,
  Settings,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [chartView, setChartView] = useState<"MONTHLY" | "WEEKLY">("MONTHLY");
  const [chartType, setChartType] = useState<"AREA" | "BAR">("BAR");

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

  const monthlyData = stats?.monthlyData || [];
  const weeklyData = stats?.weeklyData || [];
  const activeChartData = chartView === "MONTHLY" ? monthlyData : weeklyData;

  const kpis = [
    {
      title: "Gross Sales Revenue",
      value: formatPrice(stats?.totalRevenue ?? 0),
      trend: stats?.totalRevenue > 0 ? "Live verified sales" : "No sales recorded yet",
      subtext: "Live revenue snapshot",
      icon: DollarSign,
      color: "text-emerald-700 bg-emerald-50 border-emerald-200",
    },
    {
      title: "Total Orders",
      value: stats ? stats.totalOrders.toString() : "0",
      trend: `${stats?.pendingOrders || 0} awaiting dispatch`,
      subtext: "Fulfillment pipeline",
      icon: ShoppingBag,
      color: "text-amber-700 bg-amber-50 border-amber-200",
    },
    {
      title: "Catalog Products",
      value: stats ? stats.totalProducts.toString() : "0",
      trend: `${stats?.lowStockCount || 0} low stock items`,
      subtext: "Live active silhouettes",
      icon: Package,
      color: "text-gold-dark bg-gold/10 border-gold/30",
    },
    {
      title: "Registered Patrons",
      value: stats ? stats.totalCustomers.toString() : "0",
      trend: "Active customer registry",
      subtext: "Customer accounts",
      icon: Users,
      color: "text-purple-700 bg-purple-50 border-purple-200",
    },
    {
      title: "Active Promotions",
      value: stats ? `${stats.activeCoupons || 0} Coupons` : "0 Coupons",
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

          <Link href="/admin/settings?tab=story">
            <Button
              variant="outline"
              size="sm"
              className="text-xs uppercase tracking-wider border-gold/40 text-gold-dark hover:bg-gold/10"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-gold-dark" />
              Brand Story
            </Button>
          </Link>

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
            {activeChartData.map((item: any, i: number) => (
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
            <span>
              {stats?.totalRevenue > 0
                ? `Total Net Revenue: ${formatPrice(stats.totalRevenue)}`
                : "No sales revenue generated yet"}
            </span>
            <span className="font-semibold text-emerald-700">
              {stats?.totalOrders > 0
                ? `${stats.totalOrders} total verified orders`
                : "Waiting for first storefront order"}
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
              {(stats?.bestsellingProducts || []).length === 0 ? (
                <div className="py-10 text-center text-xs text-charcoal/50 space-y-1">
                  <Package className="w-6 h-6 mx-auto text-charcoal/30 mb-2" />
                  <p className="font-medium text-charcoal/70">No sales recorded yet</p>
                  <p className="text-[10px]">Top-performing garments will automatically appear here once customer orders arrive.</p>
                </div>
              ) : (
                stats.bestsellingProducts.map((item: any, idx: number) => (
                  <div key={idx} className="py-3 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-charcoal truncate">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-charcoal/50">
                        {item.category} • {item.unitsSold} units sold
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold font-mono text-charcoal">
                        {formatPrice(item.revenue)}
                      </p>
                    </div>
                  </div>
                ))
              )}
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
              All Orders ({stats?.totalOrders || 0}) →
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
                {(stats?.recentOrders || []).length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-charcoal/50 text-xs">
                      <ShoppingBag className="w-6 h-6 mx-auto text-charcoal/30 mb-2" />
                      <p className="font-medium text-charcoal/70">No live orders placed yet</p>
                      <p className="text-[10px] text-charcoal/40">Incoming orders from customers will appear here in real time.</p>
                    </td>
                  </tr>
                ) : (
                  stats.recentOrders.map((ord: any) => (
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
                  ))
                )}
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
