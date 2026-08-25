"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Search,
  Filter,
  Truck,
  CreditCard,
  Banknote,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Eye,
  MapPin,
  X,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

const ORDER_STATUSES = [
  "PLACED",
  "CONFIRMED",
  "PROCESSING",
  "PACKED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterPayment, setFilterPayment] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = new URL("/api/admin/orders", window.location.origin);
      if (search) url.searchParams.set("search", search);
      if (filterStatus !== "ALL") url.searchParams.set("status", filterStatus);
      if (filterPayment !== "ALL") url.searchParams.set("payment", filterPayment);

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Error fetching admin orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filterStatus, filterPayment]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleUpdateStatus = async (
    orderId: string,
    orderStatus?: string,
    paymentStatus?: string
  ) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus, paymentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Order updated successfully!`);
        setTimeout(() => setSuccessMsg(null), 3000);
        // Update local state
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  ...(orderStatus && { orderStatus }),
                  ...(paymentStatus && { paymentStatus }),
                }
              : o
          )
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder((prev: any) => ({
            ...prev,
            ...(orderStatus && { orderStatus }),
            ...(paymentStatus && { paymentStatus }),
          }));
        }
      }
    } catch (err) {
      console.error("Failed to update order:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-canvas-border pb-6">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-gold font-semibold">
            LOGISTICS & ORDER FULFILLMENT
          </span>
          <h1 className="font-editorial-heading text-2xl sm:text-3xl text-charcoal">
            Customer Orders Management
          </h1>
        </div>

        <Button
          onClick={fetchOrders}
          variant="outline"
          size="sm"
          className="text-xs uppercase tracking-wider self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
          Refresh Orders
        </Button>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Filters & Search Toolbar */}
      <div className="bg-white border border-canvas-border p-4 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Order #, Customer Name, or Phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-canvas-border focus:outline-none focus:border-gold"
            />
          </div>
          <Button type="submit" variant="primary" size="sm" className="text-xs">
            Search
          </Button>
        </form>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-charcoal/60 uppercase text-[10px] font-semibold">
              Status:
            </span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-canvas-border px-2.5 py-1.5 text-xs bg-white focus:outline-none focus:border-gold"
            >
              <option value="ALL">All Statuses</option>
              {ORDER_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-charcoal/60 uppercase text-[10px] font-semibold">
              Payment:
            </span>
            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className="border border-canvas-border px-2.5 py-1.5 text-xs bg-white focus:outline-none focus:border-gold"
            >
              <option value="ALL">All Methods</option>
              <option value="RAZORPAY">Razorpay Prepaid</option>
              <option value="COD">Cash on Delivery</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-canvas-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-cream-100/70 border-b border-canvas-border text-charcoal/60 uppercase tracking-widest text-[11px]">
                <th className="py-3.5 px-4">Order ID & Date</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Fulfillment Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-border">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-charcoal/50">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-gold" />
                    Loading orders registry...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-charcoal/50">
                    No orders found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-cream-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-mono font-bold text-charcoal">
                        {ord.orderNumber}
                      </p>
                      <p className="text-[10px] text-charcoal/50">
                        {new Date(ord.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-charcoal">
                        {ord.customerName}
                      </p>
                      <p className="text-[11px] text-charcoal/60">
                        {ord.customerPhone}
                      </p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 bg-cream-100 border border-canvas-border text-[10px] font-semibold">
                        {ord.itemsCount} {ord.itemsCount === 1 ? "Item" : "Items"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-charcoal">
                      {formatPrice(ord.total)}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-canvas-border text-[10px] uppercase font-semibold">
                          {ord.paymentMethod === "RAZORPAY" ? (
                            <CreditCard className="w-3 h-3 text-gold-dark" />
                          ) : (
                            <Banknote className="w-3 h-3 text-emerald-700" />
                          )}
                          {ord.paymentMethod}
                        </span>
                        <div>
                          <span
                            className={`text-[9px] uppercase font-bold px-1.5 py-0.2 border ${
                              ord.paymentStatus === "PAID"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            {ord.paymentStatus}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) =>
                          handleUpdateStatus(ord.id, e.target.value)
                        }
                        disabled={updatingId === ord.id}
                        className="text-xs border border-canvas-border bg-white px-2 py-1 focus:outline-none focus:border-gold font-medium"
                      >
                        {ORDER_STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-charcoal text-white text-xs uppercase tracking-wider hover:bg-black transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-end backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg h-full overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl flex flex-col justify-between">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-canvas-border pb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-gold font-semibold">
                    ORDER MANIFEST
                  </span>
                  <h2 className="font-editorial-heading text-xl text-charcoal">
                    {selectedOrder.orderNumber}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 text-charcoal/50 hover:text-charcoal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Update Quick Bar */}
              <div className="bg-cream-50 p-4 border border-canvas-border space-y-3">
                <p className="text-xs uppercase tracking-wider font-semibold text-charcoal">
                  Fulfillment Status
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={selectedOrder.orderStatus}
                    onChange={(e) =>
                      handleUpdateStatus(selectedOrder.id, e.target.value)
                    }
                    className="text-xs border border-canvas-border bg-white p-2"
                  >
                    {ORDER_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        Order: {st}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedOrder.paymentStatus}
                    onChange={(e) =>
                      handleUpdateStatus(
                        selectedOrder.id,
                        undefined,
                        e.target.value
                      )
                    }
                    className="text-xs border border-canvas-border bg-white p-2"
                  >
                    <option value="PENDING">Payment: PENDING</option>
                    <option value="PAID">Payment: PAID</option>
                    <option value="FAILED">Payment: FAILED</option>
                  </select>
                </div>
              </div>

              {/* Customer & Address Details */}
              <div className="border border-canvas-border p-4 space-y-2 text-xs">
                <p className="font-semibold uppercase tracking-wider text-charcoal flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gold-dark" />
                  Delivery Destination
                </p>
                <p className="font-semibold text-charcoal">
                  {selectedOrder.customerName} ({selectedOrder.customerPhone})
                </p>
                <p className="text-charcoal/70">
                  {selectedOrder.shippingAddress?.houseFlat},{" "}
                  {selectedOrder.shippingAddress?.street}
                </p>
                <p className="text-charcoal/70">
                  {selectedOrder.shippingAddress?.city},{" "}
                  {selectedOrder.shippingAddress?.state} -{" "}
                  {selectedOrder.shippingAddress?.pinCode}
                </p>
              </div>

              {/* Items in Order */}
              <div className="border border-canvas-border p-4 space-y-3">
                <p className="text-xs uppercase tracking-wider font-semibold text-charcoal">
                  Purchased Items ({selectedOrder.items?.length || 1})
                </p>
                <div className="divide-y divide-canvas-border text-xs">
                  {(selectedOrder.items || []).map((it: any, idx: number) => (
                    <div key={idx} className="py-2 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-charcoal">{it.name}</p>
                        <p className="text-[10px] text-charcoal/50">
                          Size: {it.size || "Standard"} • Qty: {it.quantity}
                        </p>
                      </div>
                      <p className="font-bold text-charcoal">
                        {formatPrice(it.price * it.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-canvas-border pt-3 flex justify-between font-bold text-sm">
                  <span>Grand Total:</span>
                  <span>{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>

              {/* Shiprocket Tracking Information */}
              <div className="border border-canvas-border p-4 space-y-2 text-xs bg-cream-50/50">
                <p className="font-semibold uppercase tracking-wider text-charcoal flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-gold-dark" />
                  Shiprocket Logistics Manifest
                </p>
                <p className="text-charcoal/70">
                  Courier: {selectedOrder.shipment?.courierName || "BlueDart Express"}
                </p>
                <p className="text-charcoal/70 font-mono">
                  AWB Number: {selectedOrder.shipment?.awbNumber || "SR109283746"}
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={() => setSelectedOrder(null)}
              className="w-full text-xs uppercase tracking-widest mt-4"
            >
              Close Details
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
