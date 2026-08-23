"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  CreditCard,
  Banknote,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  ArrowUpDown,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";

interface OrderItemAdmin {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  itemsCount: number;
  total: number;
  paymentMethod: "RAZORPAY" | "COD";
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  orderStatus: "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  date: string;
}

export default function AdminOrdersPage() {
  const [filterMethod, setFilterMethod] = useState<"ALL" | "RAZORPAY" | "COD">("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const [orders, setOrders] = useState<OrderItemAdmin[]>([
    {
      id: "ord-101",
      orderNumber: "BUYERA-20260824-001",
      customerName: "Aisha Khan",
      customerPhone: "+91 98765 43210",
      itemsCount: 2,
      total: 6499,
      paymentMethod: "COD",
      paymentStatus: "PENDING",
      orderStatus: "CONFIRMED",
      date: "24 Aug 2026, 12:30 AM",
    },
    {
      id: "ord-102",
      orderNumber: "BUYERA-20260824-002",
      customerName: "Zainab Fatima",
      customerPhone: "+91 98111 22334",
      itemsCount: 1,
      total: 4999,
      paymentMethod: "RAZORPAY",
      paymentStatus: "PAID",
      orderStatus: "SHIPPED",
      date: "23 Aug 2026, 10:15 PM",
    },
    {
      id: "ord-103",
      orderNumber: "BUYERA-20260824-003",
      customerName: "Mariam Siddiqui",
      customerPhone: "+91 99887 76655",
      itemsCount: 3,
      total: 11200,
      paymentMethod: "COD",
      paymentStatus: "PAID",
      orderStatus: "DELIVERED",
      date: "23 Aug 2026, 06:40 PM",
    },
    {
      id: "ord-104",
      orderNumber: "BUYERA-20260824-004",
      customerName: "Fatima Noor",
      customerPhone: "+91 97766 55443",
      itemsCount: 1,
      total: 2499,
      paymentMethod: "RAZORPAY",
      paymentStatus: "PAID",
      orderStatus: "DELIVERED",
      date: "22 Aug 2026, 03:20 PM",
    },
  ]);

  const handleMarkAsPaid = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId ? { ...ord, paymentStatus: "PAID" } : ord
      )
    );
  };

  const handleUpdateOrderStatus = (orderId: string, status: any) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId ? { ...ord, orderStatus: status } : ord
      )
    );
  };

  const filteredOrders = orders.filter((ord) => {
    const matchesMethod =
      filterMethod === "ALL" || ord.paymentMethod === filterMethod;
    const matchesStatus =
      filterStatus === "ALL" || ord.orderStatus === filterStatus;
    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerPhone.includes(searchQuery);
    return matchesMethod && matchesStatus && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-canvas-border pb-6 gap-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Logo size="sm" />
            </Link>
            <div className="border-l border-canvas-border pl-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold font-semibold">
                <Shield className="w-4 h-4" />
                Admin Portal
              </div>
              <h1 className="font-editorial-heading text-3xl text-charcoal mt-1">
                Orders Management
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/admin">
              <Button variant="outline" size="sm">
                Dashboard Overview
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters & Payment Method Tabs */}
        <div className="bg-white border border-canvas-border p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Payment Method Switcher */}
            <div className="flex bg-cream-100 p-1 border border-canvas-border">
              <button
                onClick={() => setFilterMethod("ALL")}
                className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                  filterMethod === "ALL"
                    ? "bg-charcoal text-white shadow-sm"
                    : "text-charcoal/70 hover:text-charcoal"
                }`}
              >
                All Methods ({orders.length})
              </button>
              <button
                onClick={() => setFilterMethod("RAZORPAY")}
                className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                  filterMethod === "RAZORPAY"
                    ? "bg-charcoal text-white shadow-sm"
                    : "text-charcoal/70 hover:text-charcoal"
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                Razorpay Online ({orders.filter((o) => o.paymentMethod === "RAZORPAY").length})
              </button>
              <button
                onClick={() => setFilterMethod("COD")}
                className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                  filterMethod === "COD"
                    ? "bg-charcoal text-white shadow-sm"
                    : "text-charcoal/70 hover:text-charcoal"
                }`}
              >
                <Banknote className="w-3.5 h-3.5" />
                Cash on Delivery ({orders.filter((o) => o.paymentMethod === "COD").length})
              </button>
            </div>

            {/* Status Dropdown Filter */}
            <div className="flex items-center gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-xs bg-white border border-canvas-border px-3 py-2 focus:outline-none focus:border-gold"
              >
                <option value="ALL">All Order Statuses</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID, Customer Name, or Phone..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-canvas border border-canvas-border focus:outline-none focus:border-gold"
            />
            <Search className="w-4 h-4 text-charcoal/40 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white border border-canvas-border shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-cream-50 border-b border-canvas-border text-[10px] uppercase tracking-wider text-charcoal/60">
                <th className="p-4 font-semibold">Order Details</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Payment Method</th>
                <th className="p-4 font-semibold">Payment Status</th>
                <th className="p-4 font-semibold">Order Status</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-border">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-charcoal/50">
                    No orders matching selected filters.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-cream-50/50 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-charcoal">{ord.orderNumber}</p>
                      <p className="text-[10px] text-charcoal/50 mt-0.5">{ord.date}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-charcoal">{ord.customerName}</p>
                      <p className="text-[10px] text-charcoal/50">{ord.customerPhone}</p>
                    </td>
                    <td className="p-4">
                      {ord.paymentMethod === "COD" ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 border border-amber-200">
                          <Banknote className="w-3 h-3" />
                          COD
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                          <CreditCard className="w-3 h-3" />
                          RAZORPAY
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      {ord.paymentStatus === "PAID" ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          PAID
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 border border-amber-200">
                          <Clock className="w-3 h-3" />
                          PENDING
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                        className="text-[11px] bg-canvas border border-canvas-border px-2 py-1 focus:outline-none focus:border-gold"
                      >
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                    <td className="p-4 font-semibold text-charcoal">
                      {formatPrice(ord.total)}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {ord.paymentMethod === "COD" && ord.paymentStatus === "PENDING" && (
                        <button
                          onClick={() => handleMarkAsPaid(ord.id)}
                          className="px-2.5 py-1 text-[10px] font-semibold uppercase bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                        >
                          Mark Paid
                        </button>
                      )}
                      <Link
                        href={`/account/orders/${ord.orderNumber}`}
                        className="inline-flex items-center gap-1 text-gold-dark hover:underline text-xs"
                      >
                        View <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
