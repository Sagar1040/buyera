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
  Sliders,
  Sparkles,
  ArrowRight,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ImageUploadDropzone } from "@/components/admin/ImageUploadDropzone";

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
      badge: "COUTURE ATELIER 2026",
      imageUrl:
        "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1920&auto=format&fit=crop",
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
      ctaUrl: bnr.ctaUrl || bnr.ctaLink || "/shop",
      order: bnr.order || 0,
      isActive: Boolean(bnr.isActive),
    });
    setModalOpen(true);
  };

  const handleToggleActive = async (bannerId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/banners/${bannerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setBanners((prev) =>
          prev.map((b) =>
            b.id === bannerId ? { ...b, isActive: !currentStatus } : b
          )
        );
        setSuccessMsg("Hero banner visibility status updated.");
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err) {
      setErrorMsg("Failed to toggle banner status.");
    }
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
      setTimeout(() => setSuccessMsg(null), 3500);
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
      const res = await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setBanners((prev) => prev.filter((b) => b.id !== id));
        setSuccessMsg("Banner removed successfully.");
        setTimeout(() => setSuccessMsg(null), 3000);
      }
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
            Upload New Banner
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
            Loading storefront hero banners...
          </div>
        ) : banners.length === 0 ? (
          <div className="col-span-full py-16 text-center text-charcoal/50 bg-white border border-canvas-border p-8">
            <ImageIcon className="w-10 h-10 mx-auto mb-3 opacity-40 text-gold" />
            <p className="font-semibold text-charcoal">No Hero Banners Found</p>
            <p className="text-xs text-charcoal/50 mt-1 mb-4">
              Upload your first homepage hero slider to wow your patrons.
            </p>
            <Button variant="primary" size="sm" onClick={handleOpenCreate}>
              Upload First Banner
            </Button>
          </div>
        ) : (
          banners.map((bnr, idx) => (
            <div
              key={bnr.id}
              className={`bg-white border transition-all duration-300 shadow-xs flex flex-col justify-between overflow-hidden ${
                bnr.isActive
                  ? "border-canvas-border hover:border-gold/60"
                  : "border-canvas-border/50 opacity-70 bg-cream-50/40"
              }`}
            >
              <div>
                {/* Visual Banner Preview */}
                <div className="relative aspect-[16/9] w-full bg-charcoal overflow-hidden group">
                  <img
                    src={bnr.imageUrl}
                    alt={bnr.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent flex flex-col justify-end p-4 text-white">
                    {bnr.badge && (
                      <span className="text-[9px] uppercase tracking-widest font-mono text-gold font-bold mb-1">
                        {bnr.badge}
                      </span>
                    )}
                    <h3 className="font-editorial-heading text-lg font-bold leading-tight">
                      {bnr.title}
                    </h3>
                  </div>

                  <span className="absolute top-2.5 right-2.5 bg-black/60 text-white text-[10px] font-mono px-2 py-0.5 backdrop-blur-xs">
                    Slide #{bnr.order ?? idx + 1}
                  </span>
                </div>

                {/* Banner Metadata */}
                <div className="p-4 space-y-2 text-xs">
                  {bnr.subtitle && (
                    <p className="text-charcoal/70 line-clamp-2 text-[11px] italic">
                      "{bnr.subtitle}"
                    </p>
                  )}

                  <div className="pt-2 border-t border-canvas-border/60 flex items-center justify-between text-[11px]">
                    <span className="text-charcoal/60">CTA Button:</span>
                    <span className="font-semibold text-charcoal flex items-center gap-1 font-mono">
                      {bnr.ctaText || "SHOP NOW"} → {bnr.ctaUrl || bnr.ctaLink || "/shop"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-3 bg-cream-50/80 border-t border-canvas-border flex items-center justify-between text-xs">
                {/* Active Toggle Switch */}
                <button
                  type="button"
                  onClick={() => handleToggleActive(bnr.id, bnr.isActive)}
                  className={`text-[10px] font-bold px-2 py-1 uppercase tracking-wider transition-colors border rounded-xs ${
                    bnr.isActive
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                      : "bg-charcoal/10 text-charcoal/60 border-charcoal/20 hover:bg-charcoal/20"
                  }`}
                >
                  {bnr.isActive ? "● Live on Home" : "○ Draft / Hidden"}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(bnr)}
                    title="Edit Banner Attributes"
                    className="p-1.5 bg-white border border-canvas-border hover:border-gold hover:text-gold transition-colors text-charcoal/70 rounded-xs"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(bnr.id)}
                    title="Remove Slide"
                    className="p-1.5 bg-white border border-canvas-border hover:border-rose-500 hover:text-rose-600 transition-colors text-charcoal/70 rounded-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white max-w-xl w-full p-6 shadow-2xl space-y-4 border border-canvas-border my-8">
            <div className="flex items-center justify-between border-b border-canvas-border pb-3">
              <div>
                <span className="text-[10px] text-gold uppercase font-bold tracking-widest">
                  {editingBanner ? "HERO SLIDER EDITOR" : "BANNER STUDIO"}
                </span>
                <h3 className="font-editorial-heading text-xl text-charcoal">
                  {editingBanner ? "Edit Homepage Slide" : "Upload New Hero Banner"}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-charcoal/50 hover:text-charcoal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Direct Image Upload Dropzone */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                  Banner Artwork Image *
                </label>
                <ImageUploadDropzone
                  value={form.imageUrl}
                  onChange={(url) => setForm((prev) => ({ ...prev, imageUrl: url }))}
                  aspectRatio="banner"
                  label=""
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Headline Title *"
                  required
                  value={form.title}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="e.g. The Royal Festive Collection"
                />

                <Input
                  label="Category Badge / Tag"
                  value={form.badge}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, badge: e.target.value }))
                  }
                  placeholder="e.g. AUTUMN / WINTER 2026"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal">
                  Subheading Narrative
                </label>
                <textarea
                  rows={2}
                  value={form.subtitle}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, subtitle: e.target.value }))
                  }
                  placeholder="e.g. Handcrafted in Grade-A Korean Nida with bespoke Zardozi metallic threadwork."
                  className="w-full border border-canvas-border p-2 text-xs text-charcoal focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  label="CTA Button Text"
                  value={form.ctaText}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, ctaText: e.target.value }))
                  }
                  placeholder="EXPLORE COLLECTION"
                />

                <Input
                  label="CTA Target Link"
                  value={form.ctaUrl}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, ctaUrl: e.target.value }))
                  }
                  placeholder="/shop?category=abayas"
                />

                <Input
                  label="Display Order #"
                  type="number"
                  value={form.order.toString()}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      order: Number(e.target.value) || 0,
                    }))
                  }
                  placeholder="1"
                />
              </div>

              <div className="pt-2 border-t border-canvas-border flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, isActive: e.target.checked }))
                    }
                    className="w-4 h-4 accent-charcoal"
                  />
                  <span className="font-semibold text-charcoal">
                    Publish Live to Storefront Immediately
                  </span>
                </label>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setModalOpen(false)}
                    className="text-xs"
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
                    {editingBanner ? "Save Changes" : "Publish Banner"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
