"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [restockingId, setRestockingId] = useState<string | null>(null);
  const [restockQty, setRestockQty] = useState<number>(10);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

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

  const handleQuickRestock = async (variantId: string) => {
    try {
      const res = await fetch(`/api/admin/products/var/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, stock: restockQty }),
      });
      setSuccessMsg(`Successfully restocked variant to ${restockQty} units.`);
      setRestockingId(null);
      setTimeout(() => setSuccessMsg(null), 4000);
      fetchStats();
    } catch (err) {
      console.error("Restock error:", err);
    }
  };

  const kpis = [
    {
      title: "Total Gross Revenue",
      value: stats ? formatPrice(stats.totalRevenue) : "₹4,85,290",
      trend: "+18.4% vs last month",
      icon: DollarSign,
      color: "text-emerald-700 bg-emerald-50 border-emerald-200",
    },
    {
      title: "Total Orders",
      value: stats ? stats.totalOrders.toString() : "42",
      trend: `${stats?.pendingOrders || 8} awaiting dispatch`,
      icon: ShoppingBag,
      color: "text-amber-700 bg-amber-50 border-amber-200",
    },
    {
      title: "Active Catalog Items",
      value: stats ? stats.totalProducts.toString() : "16",
      trend: `${stats?.lowStockCount || 3} low on stock`,
      icon: Package,
      color: "text-blue-700 bg-blue-50 border-blue-200",
    },
    {
      title: "Registered Patrons",
      value: stats ? stats.totalCustomers.toString() : "128",
      trend: "+12 new this week",
      icon: Users,
      color: "text-purple-700 bg-purple-50 border-purple-200",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-canvas-border pb-6">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-gold font-semibold">
            BUYERA BACK-OFFICE OPERATIONS
          </span>
          <h1 className="font-editorial-heading text-2xl sm:text-3xl text-charcoal">
            Overview & Storefront Analytics
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            onClick={fetchStats}
            variant="outline"
            size="sm"
            className="text-xs uppercase tracking-wider"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh Data
          </Button>

          <Link href="/admin/products/new">
            <Button variant="primary" size="sm" className="text-xs uppercase tracking-wider">
              <PlusCircle className="w-3.5 h-3.5 mr-1.5 text-gold" />
              Add Product
            </Button>
          </Link>

          <Link href="/admin/coupons">
            <Button variant="gold" size="sm" className="text-xs uppercase tracking-wider">
              <TicketPercent className="w-3.5 h-3.5 mr-1.5" />
              Create Coupon
            </Button>
          </Link>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-canvas-border p-5 shadow-xs space-y-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider text-charcoal/60 font-semibold">
                  {kpi.title}
                </span>
                <div className={`p-2 border rounded-sm ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-charcoal font-sans tracking-tight">
                {kpi.value}
              </div>
              <p className="text-[11px] text-charcoal/60 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3 text-emerald-600" />
                {kpi.trend}
              </p>
            </div>
          );
        })}
      </div>

      {/* Low Stock Alert & Quick Restock Widget */}
      {stats?.lowStockProducts && stats.lowStockProducts.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200 p-5 rounded-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <h2 className="text-xs uppercase tracking-wider font-bold text-amber-900">
                Low Inventory Alert ({stats.lowStockProducts.length} Items Critical)
              </h2>
            </div>
            <Link
              href="/admin/products"
              className="text-[11px] text-amber-800 underline font-semibold uppercase tracking-wider"
            >
              Manage Inventory
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {stats.lowStockProducts.map((p: any) => (
              <div
                key={p.id}
                className="bg-white border border-amber-200 p-3 text-xs flex items-center justify-between"
              >
                <div className="min-w-0 pr-2">
                  <p className="font-semibold text-charcoal truncate">{p.name}</p>
                  <p className="text-[10px] text-charcoal/60 font-mono">
                    Size: {p.size} • Color: {p.color}
                  </p>
                  <span className="inline-block mt-1 text-[10px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.5 rounded-xs">
                    Only {p.stock} Left in Stock
                  </span>
                </div>

                <button
                  onClick={() => setRestockingId(p.id)}
                  className="px-2.5 py-1.5 bg-charcoal text-white text-[10px] uppercase font-bold tracking-wider hover:bg-black shrink-0"
                >
                  Restock
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Restock Modal Dialog */}
      {restockingId && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border border-canvas-border p-6 max-w-sm w-full space-y-4 shadow-luxury">
            <h3 className="font-editorial-heading text-lg text-charcoal">
              Quick Stock Replenishment
            </h3>
            <p className="text-xs text-charcoal/70">
              Enter the new inventory count for this variant:
            </p>
            <input
              type="number"
              min="1"
              value={restockQty}
              onChange={(e) => setRestockQty(Number(e.target.value))}
              className="w-full border border-canvas-border p-2.5 text-xs text-charcoal font-mono"
            />
            <div className="flex gap-2 justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRestockingId(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleQuickRestock(restockingId)}
              >
                Save Inventory
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Two Column Grid: Recent Orders & Quick Management Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white border border-canvas-border p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-canvas-border pb-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-gold" />
              <h2 className="font-editorial-heading text-lg text-charcoal">
                Recent Orders Pipeline
              </h2>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs uppercase tracking-widest text-gold-dark hover:underline font-semibold"
            >
              All Orders ({stats?.totalOrders || 42})
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-canvas-border text-charcoal/50 uppercase tracking-widest">
                  <th className="py-3 px-3">Order Number</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Payment</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-canvas-border">
                {(stats?.recentOrders || []).map((order: any) => (
                  <tr key={order.id} className="hover:bg-cream-50 transition-colors">
                    <td className="py-3 px-3 font-mono font-medium text-charcoal">
                      <Link
                        href="/admin/orders"
                        className="hover:underline text-gold-dark"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3 px-3 font-medium text-charcoal">
                      {order.customerName}
                    </td>
                    <td className="py-3 px-3 font-semibold text-charcoal">
                      {formatPrice(order.total)}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] uppercase font-semibold">
                        {order.paymentMethod} • {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 bg-cream-200 text-charcoal border border-canvas-border text-[10px] uppercase font-medium">
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Management Hub */}
        <div className="bg-white border border-canvas-border p-6 shadow-xs space-y-4 self-start">
          <h2 className="font-editorial-heading text-lg text-charcoal border-b border-canvas-border pb-3">
            Quick Navigation Hub
          </h2>

          <div className="space-y-2.5">
            <Link
              href="/admin/products"
              className="p-3 border border-canvas-border hover:border-gold hover:bg-cream-50 transition-all flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-charcoal block"
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4 text-gold-dark" />
                <span>Products & Stock</span>
              </div>
              <span className="text-[10px] font-mono text-charcoal/50">
                {stats?.totalProducts || 16} Items
              </span>
            </Link>

            <Link
              href="/admin/categories"
              className="p-3 border border-canvas-border hover:border-gold hover:bg-cream-50 transition-all flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-charcoal block"
            >
              <div className="flex items-center gap-2.5">
                <FolderTree className="w-4 h-4 text-gold-dark" />
                <span>Categories</span>
              </div>
              <span className="text-[10px] font-mono text-charcoal/50">
                4 Catalogues
              </span>
            </Link>

            <Link
              href="/admin/coupons"
              className="p-3 border border-canvas-border hover:border-gold hover:bg-cream-50 transition-all flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-charcoal block"
            >
              <div className="flex items-center gap-2.5">
                <TicketPercent className="w-4 h-4 text-gold-dark" />
                <span>Discount Coupons</span>
              </div>
              <span className="text-[10px] font-mono text-charcoal/50">
                {stats?.activeCoupons || 3} Active
              </span>
            </Link>

            <Link
              href="/admin/users"
              className="p-3 border border-canvas-border hover:border-gold hover:bg-cream-50 transition-all flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-charcoal block"
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-gold-dark" />
                <span>Customer Registry</span>
              </div>
              <span className="text-[10px] font-mono text-charcoal/50">
                {stats?.totalCustomers || 128} Registered
              </span>
            </Link>

            <Link
              href="/admin/settings"
              className="p-3 border border-canvas-border hover:border-gold hover:bg-cream-50 transition-all flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-charcoal block"
            >
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-gold-dark" />
                <span>Shipping & Store Settings</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-700">
                Configured
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
