import React from "react";
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
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";

export default function AdminDashboardPage() {
  const kpis = [
    {
      title: "Total Revenue",
      value: formatPrice(485290),
      trend: "+18.4% vs last month",
      icon: DollarSign,
      positive: true,
    },
    {
      title: "Active Orders",
      value: "42",
      trend: "8 pending fulfillment",
      icon: ShoppingBag,
      positive: true,
    },
    {
      title: "Average Order Value",
      value: formatPrice(5840),
      trend: "+4.2% this quarter",
      icon: TrendingUp,
      positive: true,
    },
    {
      title: "Total Customers",
      value: "1,248",
      trend: "+124 new this week",
      icon: Users,
      positive: true,
    },
  ];

  const recentOrders = [
    {
      id: "BUYERA-20260823-9K2L1",
      customer: "Aisha Khan",
      items: "Royal Emerald Abaya (56)",
      amount: 4999,
      status: "Processing",
      payment: "PAID",
    },
    {
      id: "BUYERA-20260823-7F4X2",
      customer: "Fatima Noor",
      items: "Pure Medina Silk Hijab x 2",
      amount: 1998,
      status: "Shipped",
      payment: "PAID",
    },
    {
      id: "BUYERA-20260822-3M9Q0",
      customer: "Zainab Sheikh",
      items: "Embellished Pakistani Suit",
      amount: 8999,
      status: "Delivered",
      payment: "PAID",
    },
  ];

  return (
    <div className="container mx-auto px-4 lg:px-8 py-10 space-y-8">
      {/* Header with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-canvas-border pb-6">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Logo size="sm" />
          </Link>
          <div className="border-l border-canvas-border pl-4">
            <span className="text-[10px] font-brand-badge tracking-[0.25em] uppercase text-gold font-semibold">
              BUYERA BACK-OFFICE
            </span>
            <h1 className="font-editorial-heading text-2xl sm:text-3xl text-charcoal">
              Operations & Analytics
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-charcoal text-white text-xs uppercase tracking-widest hover:bg-black transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-gold" />
            Add Product
          </Link>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-canvas-border text-charcoal text-xs uppercase tracking-widest hover:border-charcoal transition-colors"
          >
            <Truck className="w-4 h-4 text-charcoal" />
            Shiprocket Center
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-canvas-border p-6 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-charcoal/60 font-medium">
                  {kpi.title}
                </span>
                <div className="p-2 bg-cream-100 border border-canvas-border">
                  <Icon className="w-4 h-4 text-gold-dark" />
                </div>
              </div>
              <div className="text-2xl font-bold text-charcoal font-sans">
                {kpi.value}
              </div>
              <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                {kpi.trend}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white border border-canvas-border p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-canvas-border pb-4">
          <h2 className="font-editorial-heading text-lg text-charcoal">
            Recent Orders & Logistics Pipeline
          </h2>
          <Link
            href="/admin/orders"
            className="text-xs uppercase tracking-widest text-gold-dark hover:underline font-medium"
          >
            View All Orders
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-canvas-border text-charcoal/50 uppercase tracking-widest">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Fulfillment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-border">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-cream-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium text-charcoal">
                    {order.id}
                  </td>
                  <td className="py-3 px-4 font-medium text-charcoal">
                    {order.customer}
                  </td>
                  <td className="py-3 px-4 text-charcoal/70">{order.items}</td>
                  <td className="py-3 px-4 font-semibold text-charcoal">
                    {formatPrice(order.amount)}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] uppercase tracking-wider font-semibold">
                      {order.payment}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 bg-cream-200 text-charcoal border border-canvas-border text-[10px] uppercase tracking-wider font-medium">
                      {order.status}
                    </span>
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
