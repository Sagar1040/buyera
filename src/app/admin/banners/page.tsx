"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Image as ImageIcon,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  X,
  ExternalLink,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    badge: "AUTUMN/WINTER 2026",
    imageUrl: "",
    ctaText: "EXPLORE COLLECTION",
    ctaUrl: "/shop",
    order: 1,
    isActive: true,
  });

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/banners");
      const data = await res.json();
      if (data.success) {
        setBanners(data.banners);
      }
    } catch (err) {
      console.error("Error fetching banners:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleOpenCreate = () => {
    setEditingBanner(null);
    setForm({
      title: "",
      subtitle: "",
      badge: "COUTURE ATELIER",
      imageUrl:
        "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1600&auto=format&fit=crop",
      ctaText: "EXPLORE COLLECTION",
      ctaUrl: "/shop",
      order: banners.length + 1,
      isActive: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (bnr: any) => {
    setEditingBanner(bnr);
    setForm({
      title: bnr.title,
      subtitle: bnr.subtitle || "",
      badge: bnr.badge || "",
      imageUrl: bnr.imageUrl,
      ctaText: bnr.ctaText || "SHOP NOW",
      ctaUrl: bnr.ctaUrl || "/shop",
      order: bnr.order || 0,
      isActive: Boolean(bnr.isActive),
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.imageUrl) {
      setErrorMsg("Banner title and image URL are required.");
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    try {
      const isEdit = !!editingBanner;
      const url = isEdit
        ? `/api/admin/banners/${editingBanner.id}`
        : "/api/admin/banners";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save banner.");
      }

      setSuccessMsg(
        isEdit
          ? "Hero banner updated successfully."
          : "New hero banner published to storefront."
      );
      setTimeout(() => setSuccessMsg(null), 3000);
      setModalOpen(false);
      fetchBanners();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save banner.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this hero slider banner?"))
      return;
    try {
      await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
      setBanners((prev) => prev.filter((b) => b.id !== id));
      setSuccessMsg("Banner removed.");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg("Failed to delete banner.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-canvas-border pb-5">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-gold font-semibold font-mono">
            STOREFRONT VISUAL ASSETS
          </span>
          <h1 className="font-editorial-heading text-2xl sm:text-3xl text-charcoal">
            Homepage Hero Carousel & Banners
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={fetchBanners}
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
            Add Hero Slider
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

      {/* Hero Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-16 text-center text-charcoal/50">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-gold" />
            Loading hero sliders...
          </div>
        ) : banners.length === 0 ? (
          <div className="col-span-full py-16 text-center text-charcoal/50 bg-white border border-canvas-border p-8">
            No hero banners configured. Click "Add Hero Slider" to publish your first homepage slide.
          </div>
        ) : (
          banners.map((bnr) => (
            <div
              key={bnr.id}
              className="bg-white border border-canvas-border rounded-xs shadow-xs overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Banner Thumbnail */}
                <div className="relative w-full h-44 bg-cream-200 overflow-hidden">
                  <Image
                    src={bnr.imageUrl}
                    alt={bnr.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    {bnr.badge && (
                      <span className="text-[9px] uppercase tracking-widest text-[#E5D7B7] font-bold font-mono block mb-1">
                        {bnr.badge}
                      </span>
                    )}
                    <h3 className="font-editorial-heading text-base font-semibold leading-tight line-clamp-1">
                      {bnr.title}
                    </h3>
                  </div>

                  <span
                    className={`absolute top-2.5 right-2.5 px-2 py-0.5 text-[9px] uppercase font-bold border ${
                      bnr.isActive
                        ? "bg-emerald-600 text-white border-emerald-700"
                        : "bg-black/80 text-white/70 border-white/20"
                    }`}
                  >
                    {bnr.isActive ? "LIVE" : "PAUSED"}
                  </span>
                </div>

                <div className="p-4 space-y-2 text-xs">
                  <p className="text-charcoal/70 line-clamp-2">
                    {bnr.subtitle || "No subtitle provided."}
                  </p>

                  <div className="flex items-center justify-between text-[11px] font-mono text-charcoal/60 pt-2 border-t border-canvas-border">
                    <span>Priority: #{bnr.order}</span>
                    <span className="text-gold-dark font-semibold">
                      CTA: {bnr.ctaText} ({bnr.ctaUrl})
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-3 bg-cream-50/70 border-t border-canvas-border flex justify-end gap-2 text-xs">
                <button
                  onClick={() => handleOpenEdit(bnr)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-canvas-border text-charcoal hover:border-charcoal transition-colors text-[11px] font-semibold"
                >
                  <Edit className="w-3.5 h-3.5 text-gold-dark" />
                  Edit Slide
                </button>

                <button
                  onClick={() => handleDelete(bnr.id)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 transition-colors text-[11px]"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Banner Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border border-canvas-border p-6 max-w-lg w-full space-y-4 shadow-luxury rounded-xs">
            <div className="flex items-center justify-between border-b border-canvas-border pb-3">
              <h3 className="font-editorial-heading text-xl text-charcoal">
                {editingBanner ? "Edit Hero Slide" : "Create Hero Slide"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-xs text-charcoal/50 hover:text-charcoal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <Input
                label="Headline Title *"
                required
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="e.g. The Royal Farasha Collection"
              />

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal">
                  Subtitle / Editorial Caption
                </label>
                <textarea
                  rows={2}
                  value={form.subtitle}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, subtitle: e.target.value }))
                  }
                  placeholder="e.g. Handcrafted in Grade-A Korean Nida with bespoke Zardozi threadwork."
                  className="w-full border border-canvas-border p-2.5 text-xs text-charcoal focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Category Badge"
                  value={form.badge}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, badge: e.target.value }))
                  }
                  placeholder="e.g. AUTUMN/WINTER 2026"
                />
                <Input
                  label="Display Order / Priority"
                  type="number"
                  value={form.order}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      order: Number(e.target.value),
                    }))
                  }
                />
              </div>

              <Input
                label="Hero Image URL *"
                type="url"
                required
                value={form.imageUrl}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, imageUrl: e.target.value }))
                }
                placeholder="https://images.unsplash.com/photo-..."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Call to Action Button Text"
                  value={form.ctaText}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, ctaText: e.target.value }))
                  }
                  placeholder="e.g. EXPLORE ATELIER"
                />
                <Input
                  label="Target Link (URL)"
                  value={form.ctaUrl}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, ctaUrl: e.target.value }))
                  }
                  placeholder="/shop?category=abayas"
                />
              </div>

              <div className="pt-1">
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
                  <span className="font-semibold">
                    Set Live in Homepage Carousel
                  </span>
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
                  {editingBanner ? "Save Slide" : "Publish Slide"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
