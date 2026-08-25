"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Truck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Store,
  Mail,
  Phone,
  Megaphone,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [form, setForm] = useState({
    storeName: "BUYERA",
    tagline: "Elegance. Modesty. You.",
    supportEmail: "support@buyera.in",
    supportPhone: "+91 98765 43210",
    freeShippingThreshold: 999,
    announcementText:
      "Complimentary Express Shipping Across India on Orders Above ₹999",
    announcementActive: true,
    instagramUrl: "https://instagram.com/buyera.official",
    facebookUrl: "https://facebook.com/buyera.official",
  });

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.success && data.settings) {
        setForm({
          storeName: data.settings.storeName || "BUYERA",
          tagline: data.settings.tagline || "Elegance. Modesty. You.",
          supportEmail: data.settings.supportEmail || "support@buyera.in",
          supportPhone: data.settings.supportPhone || "+91 98765 43210",
          freeShippingThreshold:
            data.settings.freeShippingThreshold !== undefined
              ? data.settings.freeShippingThreshold
              : 999,
          announcementText: data.settings.announcementText || "",
          announcementActive: Boolean(data.settings.announcementActive),
          instagramUrl: data.settings.instagramUrl || "",
          facebookUrl: data.settings.facebookUrl || "",
        });
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update store settings.");
      }

      setSuccessMsg("Store configuration saved successfully.");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-charcoal/50">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-gold" />
        Loading settings...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-canvas-border pb-6">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-gold font-semibold">
            GLOBAL CONFIGURATION
          </span>
          <h1 className="font-editorial-heading text-2xl sm:text-3xl text-charcoal">
            Store & Logistics Settings
          </h1>
        </div>

        <Button
          onClick={fetchSettings}
          variant="outline"
          size="sm"
          className="text-xs uppercase tracking-wider self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          Reload Settings
        </Button>
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

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Store Identity */}
        <div className="bg-white border border-canvas-border p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-canvas-border pb-2">
            <Store className="w-4 h-4 text-gold-dark" />
            <h2 className="font-editorial-heading text-lg text-charcoal">
              Store Brand & Identity
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Store Brand Name *"
              required
              value={form.storeName}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, storeName: e.target.value }))
              }
            />
            <Input
              label="Brand Tagline"
              value={form.tagline}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, tagline: e.target.value }))
              }
            />
          </div>
        </div>

        {/* 2. Customer Support & Contact */}
        <div className="bg-white border border-canvas-border p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-canvas-border pb-2">
            <Mail className="w-4 h-4 text-gold-dark" />
            <h2 className="font-editorial-heading text-lg text-charcoal">
              Support & Contact Channels
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Support Email (Displayed in Invoices) *"
              type="email"
              required
              value={form.supportEmail}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, supportEmail: e.target.value }))
              }
            />
            <Input
              label="Support Helpline Phone"
              value={form.supportPhone}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, supportPhone: e.target.value }))
              }
            />
          </div>
        </div>

        {/* 3. Shipping & Logistics Policy */}
        <div className="bg-white border border-canvas-border p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-canvas-border pb-2">
            <Truck className="w-4 h-4 text-gold-dark" />
            <h2 className="font-editorial-heading text-lg text-charcoal">
              Shipping & Delivery Thresholds
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Free Shipping Cart Value Threshold (₹) *"
              type="number"
              required
              value={form.freeShippingThreshold}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  freeShippingThreshold: Number(e.target.value),
                }))
              }
            />
          </div>
          <p className="text-[11px] text-charcoal/60">
            Orders below this threshold will automatically incur standard delivery fee of ₹99.
          </p>
        </div>

        {/* 4. Top Announcement Bar */}
        <div className="bg-white border border-canvas-border p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-canvas-border pb-2">
            <Megaphone className="w-4 h-4 text-gold-dark" />
            <h2 className="font-editorial-heading text-lg text-charcoal">
              Storefront Announcement Bar
            </h2>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal">
              Announcement Ticker Text
            </label>
            <input
              type="text"
              value={form.announcementText}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  announcementText: e.target.value,
                }))
              }
              className="w-full border border-canvas-border p-2.5 text-xs text-charcoal focus:outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={form.announcementActive}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    announcementActive: e.target.checked,
                  }))
                }
                className="w-4 h-4 accent-charcoal"
              />
              <span className="font-semibold">Display Announcement Bar at top of site</span>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            variant="gold"
            size="md"
            isLoading={saving}
            className="text-xs uppercase tracking-wider font-bold px-8"
          >
            SAVE STORE CONFIGURATION
          </Button>
        </div>
      </form>
    </div>
  );
}
