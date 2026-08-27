"use client";

import React, { useState, useEffect } from "react";
import {
  TicketPercent,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  X,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatPrice } from "@/lib/utils";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({
    code: "",
    discountType: "PERCENTAGE",
    discountValue: 10,
    minOrderValue: 1999,
    maxDiscount: 1000,
    usageLimit: 500,
    expiresAt: "2026-12-31",
    isActive: true,
  });

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      if (data.success) {
        setCoupons(data.coupons);
      }
    } catch (err) {
      console.error("Error fetching coupons:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleOpenCreate = () => {
    setEditingCoupon(null);
    setForm({
      code: "",
      discountType: "PERCENTAGE",
      discountValue: 10,
      minOrderValue: 1999,
      maxDiscount: 1000,
      usageLimit: 500,
      expiresAt: "2026-12-31",
      isActive: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (cpn: any) => {
    setEditingCoupon(cpn);
    setForm({
      code: cpn.code,
      discountType: cpn.discountType,
      discountValue: cpn.discountValue,
      minOrderValue: cpn.minOrderValue || 0,
      maxDiscount: cpn.maxDiscount || 0,
      usageLimit: cpn.usageLimit || 0,
      expiresAt: cpn.expiresAt ? cpn.expiresAt.split("T")[0] : "",
      isActive: Boolean(cpn.isActive),
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code || form.discountValue === undefined) {
      setErrorMsg("Coupon code and discount value are required.");
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    try {
      const isEdit = !!editingCoupon;
      const url = isEdit
        ? `/api/admin/coupons/${editingCoupon.id}`
        : "/api/admin/coupons";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save coupon.");
      }

      setSuccessMsg(
        isEdit ? "Coupon updated successfully." : "Coupon generated & active."
      );
      setTimeout(() => setSuccessMsg(null), 3000);
      setModalOpen(false);
      fetchCoupons();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save coupon.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      setSuccessMsg("Coupon removed.");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg("Failed to delete coupon.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-canvas-border pb-6">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-gold font-semibold">
            PROMOTIONS & MARKETING
          </span>
          <h1 className="font-editorial-heading text-2xl sm:text-3xl text-charcoal">
            Discount Coupons & Vouchers
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={fetchCoupons}
            variant="outline"
            size="sm"
            className="text-xs uppercase tracking-wider"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button
            onClick={handleOpenCreate}
            variant="primary"
            size="sm"
            className="text-xs uppercase tracking-wider"
          >
            <PlusCircle className="w-3.5 h-3.5 mr-1.5 text-gold" />
            Create Promo Coupon
          </Button>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Coupons Table */}
      <div className="bg-white border border-canvas-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-cream-100/70 border-b border-canvas-border text-charcoal/60 uppercase tracking-widest text-[11px]">
                <th className="py-3.5 px-4">Coupon Code</th>
                <th className="py-3.5 px-4">Discount Benefit</th>
                <th className="py-3.5 px-4">Min Spend</th>
                <th className="py-3.5 px-4">Usage Stats</th>
                <th className="py-3.5 px-4">Expiry Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-border">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-charcoal/50">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-gold" />
                    Loading promo coupons...
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-charcoal/50">
                    No active discount coupons found. Click "Create Promo Coupon" to launch one.
                  </td>
                </tr>
              ) : (
                coupons.map((cpn) => (
                  <tr key={cpn.id} className="hover:bg-cream-50 transition-colors">
                    {/* Code & Quick Copy */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-charcoal px-2 py-1 bg-cream-100 border border-canvas-border text-xs">
                          {cpn.code}
                        </span>
                        <button
                          onClick={() => handleCopy(cpn.code)}
                          title="Copy Code"
                          className="text-charcoal/40 hover:text-charcoal"
                        >
                          {copiedCode === cpn.code ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Benefit */}
                    <td className="py-3.5 px-4 font-semibold text-charcoal">
                      {cpn.discountType === "PERCENTAGE" ? (
                        <span>
                          {cpn.discountValue}% OFF
                          {cpn.maxDiscount && (
                            <span className="text-[10px] text-charcoal/60 block font-normal">
                              (Capped at {formatPrice(cpn.maxDiscount)})
                            </span>
                          )}
                        </span>
                      ) : (
                        <span>FLAT {formatPrice(cpn.discountValue)} OFF</span>
                      )}
                    </td>

                    {/* Min Spend */}
                    <td className="py-3.5 px-4 font-mono text-charcoal">
                      {cpn.minOrderValue > 0
                        ? formatPrice(cpn.minOrderValue)
                        : "No Minimum"}
                    </td>

                    {/* Usage Stats */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-xs text-charcoal">
                        {cpn.timesUsed || 0}
                      </span>
                      <span className="text-[10px] text-charcoal/50">
                        {" "}
                        / {cpn.usageLimit || "∞"} used
                      </span>
                    </td>

                    {/* Expiry */}
                    <td className="py-3.5 px-4 text-charcoal/70">
                      {cpn.expiresAt ? (
                        new Date(cpn.expiresAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      ) : (
                        <span className="text-emerald-700 font-medium">Never Expires</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 text-[9px] uppercase font-bold border ${
                          cpn.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        {cpn.isActive ? "ACTIVE" : "PAUSED"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(cpn)}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-canvas-border text-charcoal hover:border-charcoal transition-colors text-xs"
                      >
                        <Edit className="w-3.5 h-3.5 text-gold-dark" />
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(cpn.id)}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 transition-colors text-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Coupon Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-canvas-border p-6 max-w-lg w-full space-y-5 shadow-luxury max-h-[90vh] overflow-y-auto my-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-canvas-border pb-3 sticky -top-6 bg-white pt-1 z-10">
              <h3 className="font-editorial-heading text-xl text-charcoal">
                {editingCoupon ? "Edit Coupon" : "Create New Promotion Coupon"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-xs text-charcoal/50 hover:text-charcoal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Coupon Code *"
                  required
                  value={form.code}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      code: e.target.value.toUpperCase(),
                    }))
                  }
                  placeholder="e.g. EID2026"
                />

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
                    Discount Type *
                  </label>
                  <select
                    value={form.discountType}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        discountType: e.target.value,
                      }))
                    }
                    className="w-full border border-canvas-border p-2.5 text-xs bg-white focus:outline-none focus:border-gold"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Flat Amount (₹)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label={
                    form.discountType === "PERCENTAGE"
                      ? "Percentage (%) *"
                      : "Discount Amount (₹) *"
                  }
                  type="number"
                  required
                  value={form.discountValue}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      discountValue: Number(e.target.value),
                    }))
                  }
                />

                <Input
                  label="Min Cart Value (₹)"
                  type="number"
                  value={form.minOrderValue}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      minOrderValue: Number(e.target.value),
                    }))
                  }
                />

                <Input
                  label="Max Discount Cap (₹)"
                  type="number"
                  value={form.maxDiscount}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      maxDiscount: Number(e.target.value),
                    }))
                  }
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Total Usage Limit (optional)"
                  type="number"
                  value={form.usageLimit}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      usageLimit: Number(e.target.value),
                    }))
                  }
                />

                <Input
                  label="Expiry Date"
                  type="date"
                  value={form.expiresAt}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      expiresAt: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        isActive: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 accent-charcoal"
                  />
                  <span className="font-semibold">Enable Coupon Immediately</span>
                </label>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-canvas-border">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="gold"
                  size="sm"
                  isLoading={saving}
                  className="text-xs uppercase tracking-wider font-bold"
                >
                  {editingCoupon ? "Save Coupon" : "Publish Coupon"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
