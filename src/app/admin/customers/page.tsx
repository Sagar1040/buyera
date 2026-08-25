"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ShoppingBag,
  Mail,
  Phone,
  MapPin,
  Eye,
  X,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const url = new URL("/api/admin/customers", window.location.origin);
      if (search) url.searchParams.set("search", search);

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success) {
        setCustomers(data.customers);
      }
    } catch (err) {
      console.error("Failed to load customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustomers();
  };

  const handleToggleStatus = (id: string, current: string) => {
    const nextStatus = current === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: nextStatus } : c))
    );
    setSuccessMsg(`Customer account marked as ${nextStatus}.`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-canvas-border pb-5">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-gold font-semibold font-mono">
            PATRON DIRECTORY
          </span>
          <h1 className="font-editorial-heading text-2xl sm:text-3xl text-charcoal">
            Customer Directory & Lifetime Value
          </h1>
        </div>

        <Button
          onClick={fetchCustomers}
          variant="outline"
          size="sm"
          className="text-xs uppercase tracking-wider self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
          Refresh List
        </Button>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Search Toolbar */}
      <div className="bg-white border border-canvas-border p-4 shadow-xs flex gap-2">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Patron Name, Email, or Mobile Number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-canvas-border focus:outline-none focus:border-gold"
            />
          </div>
          <Button type="submit" variant="primary" size="sm" className="text-xs">
            Search
          </Button>
        </form>
      </div>

      {/* Customers Table */}
      <div className="bg-white border border-canvas-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-cream-100/70 border-b border-canvas-border text-charcoal/60 uppercase tracking-widest text-[11px]">
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">Total Spent (LTV)</th>
                <th className="py-3.5 px-4">Total Orders</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-charcoal/50">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-gold" />
                    Loading customer directory...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-charcoal/50">
                    No customers found matching search term.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="hover:bg-cream-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-charcoal text-[#E5D7B7] font-bold flex items-center justify-center text-xs shrink-0">
                          {c.name ? c.name[0].toUpperCase() : "U"}
                        </div>
                        <div>
                          <p className="font-semibold text-charcoal">{c.name}</p>
                          <p className="text-[10px] text-charcoal/50">
                            Joined {new Date(c.joinedDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 space-y-0.5">
                      <p className="text-charcoal flex items-center gap-1 font-mono">
                        <Mail className="w-3 h-3 text-gold-dark" />
                        {c.email}
                      </p>
                      <p className="text-charcoal/60 text-[11px] flex items-center gap-1">
                        <Phone className="w-3 h-3 text-charcoal/40" />
                        {c.phone}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-charcoal font-mono">
                      {formatPrice(c.totalSpent || 0)}
                    </td>

                    <td className="py-3.5 px-4 font-medium text-charcoal">
                      <span className="px-2 py-0.5 bg-cream-100 border border-canvas-border text-[10px] font-semibold">
                        {c.ordersCount || 0} Orders
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleStatus(c.id, c.status || "ACTIVE")}
                        className={`px-2 py-0.5 text-[9px] uppercase font-bold border transition-colors ${
                          c.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        {c.status || "ACTIVE"}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedCustomer(c)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-charcoal text-white text-[11px] uppercase tracking-wider hover:bg-black rounded-xs"
                      >
                        <Eye className="w-3 h-3" />
                        Profile
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Profile Modal Drawer */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-end backdrop-blur-xs">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-canvas-border pb-3">
                <h3 className="font-editorial-heading text-xl text-charcoal">
                  Customer Profile
                </h3>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="text-xs text-charcoal/50 hover:text-charcoal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Basic Info */}
              <div className="bg-cream-50 p-4 border border-canvas-border space-y-2 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-charcoal text-[#E5D7B7] font-bold flex items-center justify-center text-sm">
                    {selectedCustomer.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-charcoal text-sm">
                      {selectedCustomer.name}
                    </h4>
                    <p className="text-charcoal/60 font-mono">
                      {selectedCustomer.email}
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t border-canvas-border/70 flex justify-between font-mono">
                  <span>Lifetime Spend:</span>
                  <span className="font-bold text-charcoal">
                    {formatPrice(selectedCustomer.totalSpent)}
                  </span>
                </div>
              </div>

              {/* Shipping Addresses */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gold-dark" />
                  Saved Shipping Addresses
                </h4>
                {(selectedCustomer.addresses || []).length === 0 ? (
                  <p className="text-xs text-charcoal/50 italic">
                    No saved addresses on file.
                  </p>
                ) : (
                  (selectedCustomer.addresses || []).map((a: any, i: number) => (
                    <div
                      key={i}
                      className="p-3 border border-canvas-border text-xs text-charcoal/80 space-y-0.5"
                    >
                      <p className="font-semibold text-charcoal">
                        {a.houseFlat}, {a.street}
                      </p>
                      <p>
                        {a.city}, {a.state} - {a.pinCode}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={() => setSelectedCustomer(null)}
              className="w-full text-xs uppercase tracking-widest mt-4"
            >
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
