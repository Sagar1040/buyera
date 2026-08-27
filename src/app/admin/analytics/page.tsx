"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  CreditCard,
  Banknote,
  ShoppingBag,
  ArrowUpRight,
  RefreshCw,
  PieChart,
  Calendar,
  Layers,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"YEAR" | "MONTH">("YEAR");

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/analytics");
      const resData = await res.json();
      if (resData.success) {
        setData(resData.analytics);
      }
    } catch (err) {
      console.error("Error fetching analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-charcoal/50">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-gold" />
        Generating financial reports...
      </div>
    );
  }

  const monthly = data?.monthlyRevenue || [];
  const weekly = data?.weeklyRevenue || [];
  const paymentSplit = data?.paymentSplit || [];
  const categories = data?.categoryPerformance || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-canvas-border pb-5">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-gold font-semibold font-mono">
            FINANCIAL INTELLIGENCE
          </span>
          <h1 className="font-editorial-heading text-2xl sm:text-3xl text-charcoal">
            Income, Sales & Performance Metrics
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={fetchAnalytics}
            variant="outline"
            size="sm"
            className="text-xs uppercase tracking-wider"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Refresh
          </Button>
        </div>
      </div>

      {/* 3 Top Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white border border-canvas-border p-5 rounded-xs shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-charcoal/60 font-semibold">
              Gross Annual Sales
            </span>
            <DollarSign className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold text-charcoal font-sans">
            {formatPrice(data?.totalRevenue || 0)}
          </div>
          <p className="text-[11px] text-charcoal/60 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3 text-emerald-700" />
            {data?.totalRevenue > 0 ? "Real verified sales" : "No sales revenue generated yet"}
          </p>
        </div>

        <div className="bg-white border border-canvas-border p-5 rounded-xs shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-charcoal/60 font-semibold">
              Average Order Value (AOV)
            </span>
            <TrendingUp className="w-4 h-4 text-gold-dark" />
          </div>
          <div className="text-2xl font-bold text-charcoal font-sans">
            {formatPrice(
              data?.monthlyRevenue?.reduce((acc: number, m: any) => acc + m.revenue, 0) > 0 &&
              data?.monthlyRevenue?.reduce((acc: number, m: any) => acc + m.orders, 0) > 0
                ? Math.round(
                    data.monthlyRevenue.reduce((acc: number, m: any) => acc + m.revenue, 0) /
                    data.monthlyRevenue.reduce((acc: number, m: any) => acc + m.orders, 0)
                  )
                : 0
            )}
          </div>
          <p className="text-[11px] text-charcoal/60">
            Based on completed customer checkouts
          </p>
        </div>

        <div className="bg-white border border-canvas-border p-5 rounded-xs shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-charcoal/60 font-semibold">
              Prepaid Conversion Ratio
            </span>
            <CreditCard className="w-4 h-4 text-blue-700" />
          </div>
          <div className="text-2xl font-bold text-charcoal font-sans">
            {data?.paymentSplit?.[0]?.percentage || 0}%
          </div>
          <p className="text-[11px] text-charcoal/60">
            Razorpay UPI & Cards share
          </p>
        </div>
      </div>

      {/* Main Revenue Trajectory Chart */}
      <div className="bg-white border border-canvas-border p-6 rounded-xs shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-canvas-border pb-3">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-gold-dark font-semibold">
              ANNUAL RUN RATE
            </span>
            <h2 className="font-editorial-heading text-lg text-charcoal">
              Monthly Revenue Performance Breakdown
            </h2>
          </div>
        </div>

        <div className="h-64 flex items-end justify-between gap-3 pt-6 px-2">
          {monthly.map((m: any, idx: number) => {
            const maxRev = Math.max(...monthly.map((item: any) => item.revenue || 0), 1);
            const heightPercent = m.revenue > 0 ? Math.round((m.revenue / maxRev) * 100) : 0;
            return (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer"
              >
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-charcoal text-white text-[10px] font-mono px-2 py-1 rounded-xs pointer-events-none shadow-md whitespace-nowrap">
                  {formatPrice(m.revenue)} ({m.orders} orders)
                </div>

                <div
                  style={{ height: `${heightPercent}%` }}
                  className="w-full max-w-[48px] bg-cream-200 group-hover:bg-[#C5A880] transition-all rounded-t-xs relative"
                />

                <span className="text-[11px] font-mono uppercase text-charcoal/70 group-hover:text-charcoal font-bold">
                  {m.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Grid: Payment Split & Category Sales Share */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Methods Breakdown */}
        <div className="bg-white border border-canvas-border p-6 rounded-xs shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-canvas-border pb-3">
            <CreditCard className="w-4 h-4 text-gold-dark" />
            <h2 className="font-editorial-heading text-lg text-charcoal">
              Payment Gateway Distribution
            </h2>
          </div>

          <div className="space-y-4">
            {paymentSplit.length === 0 || data?.totalRevenue === 0 ? (
              <p className="text-xs text-charcoal/50 py-4 text-center">
                No transactions recorded yet. Payment distribution will appear with incoming orders.
              </p>
            ) : (
              paymentSplit.map((p: any, i: number) => (
                <div key={i} className="space-y-1.5 text-xs">
                  <div className="flex justify-between font-semibold text-charcoal">
                    <span>{p.method}</span>
                    <span className="font-mono">{p.percentage}% ({formatPrice(p.amount)})</span>
                  </div>
                  <div className="w-full bg-cream-100 h-3 rounded-xs overflow-hidden">
                    <div
                      style={{ width: `${p.percentage}%` }}
                      className={`h-full ${
                        i === 0 ? "bg-[#C5A880]" : "bg-charcoal"
                      }`}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Category Contribution Share */}
        <div className="bg-white border border-canvas-border p-6 rounded-xs shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-canvas-border pb-3">
            <Layers className="w-4 h-4 text-gold-dark" />
            <h2 className="font-editorial-heading text-lg text-charcoal">
              Category Sales Contribution
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            {categories.length === 0 || data?.totalRevenue === 0 ? (
              <p className="text-xs text-charcoal/50 py-4 text-center">
                No category sales recorded yet. Category shares will rank here as products sell.
              </p>
            ) : (
              categories.map((c: any, i: number) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 border border-canvas-border bg-cream-50/50"
                >
                  <div>
                    <p className="font-semibold text-charcoal">{c.category}</p>
                    <p className="text-[10px] text-charcoal/50">
                      {c.units} units shipped
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-charcoal font-mono">
                      {formatPrice(c.revenue)}
                    </p>
                    <span className="text-[10px] font-bold text-gold-dark">
                      {c.share}% of total
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
