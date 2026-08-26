"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Sparkles,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ImageUpload } from "@/components/admin/ImageUpload";

const COMMON_SIZES = ["52", "54", "56", "58", "60", "XS", "S", "M", "L", "XL", "Standard"];
const COMMON_COLORS = [
  { name: "Midnight Black", hex: "#121212" },
  { name: "Emerald Green", hex: "#0F5257" },
  { name: "Royal Ruby", hex: "#800020" },
  { name: "Champagne Gold", hex: "#D4AF37" },
  { name: "Dusty Rose", hex: "#DCAE96" },
  { name: "Navy Blue", hex: "#0B1D3A" },
  { name: "Pearl White", hex: "#FDFDFD" },
];

export default function AdminNewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    sku: "",
    categoryId: "",
    price: "",
    mrp: "",
    shortDesc: "",
    description: "",
    fabricCare: "Dry clean only. Steam iron inside out on low heat.",
    tags: "Luxury, Modest, Festive",
    isActive: true,
    isFeatured: true,
    isNew: true,
    isBestSeller: false,
  });

  const [images, setImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
  ]);

  const [variants, setVariants] = useState<any[]>([
    { size: "54", color: "Midnight Black", colorHex: "#121212", stock: 10, sku: "" },
    { size: "56", color: "Midnight Black", colorHex: "#121212", stock: 15, sku: "" },
  ]);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data?.categories?.length > 0) {
          setCategories(data.categories);
          setFormData((prev) => ({
            ...prev,
            categoryId: prev.categoryId || data.categories[0].id,
          }));
        }
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const handleAddImage = () => {
    setImages((prev) => [...prev, ""]);
  };

  const handleUpdateImage = (index: number, url: string) => {
    setImages((prev) => {
      const next = [...prev];
      next[index] = url;
      return next;
    });
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddVariant = () => {
    setVariants((prev) => [
      ...prev,
      { size: "54", color: "Midnight Black", colorHex: "#121212", stock: 10, sku: "" },
    ]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.categoryId) {
      setError("Please fill in the Product Name, Price, and Category.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        mrp: formData.mrp ? Number(formData.mrp) : Number(formData.price) * 1.3,
        tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
        images: images.filter((img) => img.trim().length > 0),
        variants: variants.map((v, idx) => ({
          ...v,
          stock: Number(v.stock) || 0,
          sku: v.sku || `${formData.sku || "BUY"}-${v.size}-${idx + 1}`,
        })),
      };

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create product.");
      }

      router.push("/admin/products");
    } catch (err: any) {
      setError(err.message || "Failed to create product.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-canvas-border pb-4">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs text-charcoal/60 hover:text-charcoal transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Product List
        </Link>
        <span className="text-xs uppercase tracking-wider font-semibold text-gold-dark">
          Product Creator
        </span>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Basic Details */}
        <div className="bg-white border border-canvas-border p-6 shadow-xs space-y-4">
          <h2 className="font-editorial-heading text-lg text-charcoal border-b border-canvas-border pb-2">
            1. Basic Product Attributes
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Product Name *"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="e.g. Royal Emerald Hand-Embroidered Abaya"
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1.5">
                Category *
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, categoryId: e.target.value }))
                }
                className="w-full border border-canvas-border p-2.5 text-xs bg-white focus:outline-none focus:border-gold"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Base Price (₹) *"
              type="number"
              required
              value={formData.price}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, price: e.target.value }))
              }
              placeholder="4999"
            />
            <Input
              label="Original MRP (₹)"
              type="number"
              value={formData.mrp}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, mrp: e.target.value }))
              }
              placeholder="6999"
            />
            <Input
              label="Base SKU"
              value={formData.sku}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, sku: e.target.value }))
              }
              placeholder="e.g. BUY-ABY-001"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal">
              Short Description / Summary
            </label>
            <input
              type="text"
              value={formData.shortDesc}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, shortDesc: e.target.value }))
              }
              placeholder="e.g. Grade-A Korean Nida silhouette with gold metallic threadwork."
              className="w-full border border-canvas-border p-2.5 text-xs text-charcoal focus:outline-none focus:border-gold"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal">
              Detailed Description
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Full details regarding weave, embroidery, drape, and occasion..."
              className="w-full border border-canvas-border p-2.5 text-xs text-charcoal focus:outline-none focus:border-gold"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal">
              Fabric & Garment Care Guide
            </label>
            <input
              type="text"
              value={formData.fabricCare}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, fabricCare: e.target.value }))
              }
              className="w-full border border-canvas-border p-2.5 text-xs text-charcoal focus:outline-none focus:border-gold"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal">
              Search Tags (Comma separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, tags: e.target.value }))
              }
              className="w-full border border-canvas-border p-2.5 text-xs text-charcoal focus:outline-none focus:border-gold"
            />
          </div>
        </div>

        {/* 2. Direct Image Upload & Gallery */}
        <div className="bg-white border border-canvas-border p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-canvas-border pb-2">
            <div>
              <h2 className="font-editorial-heading text-lg text-charcoal">
                2. Product Image Gallery & Direct Upload
              </h2>
              <p className="text-[11px] text-charcoal/50">
                Drag & drop files or enter direct image URLs. Image #1 will serve as the primary storefront thumbnail.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddImage}
              className="text-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Image Slot
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="p-3 border border-canvas-border/80 bg-cream-50/30 rounded-xs space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gold-dark">
                    {idx === 0 ? "★ Primary Image" : `Gallery Photo #${idx + 1}`}
                  </span>
                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="p-1 text-rose-600 hover:text-rose-800"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <ImageUpload
                  type="product"
                  value={img}
                  onChange={(newUrl) => handleUpdateImage(idx, newUrl)}
                  onDelete={() => handleRemoveImage(idx)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 3. Variants Matrix (Sizes & Inventory Stock) */}
        <div className="bg-white border border-canvas-border p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-canvas-border pb-2">
            <h2 className="font-editorial-heading text-lg text-charcoal">
              3. Size & Color Inventory Matrix
            </h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddVariant}
              className="text-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Variant
            </Button>
          </div>

          <div className="space-y-3">
            {variants.map((v, idx) => (
              <div
                key={idx}
                className="p-3 border border-canvas-border bg-cream-50/60 grid grid-cols-1 sm:grid-cols-4 gap-3 items-center"
              >
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-charcoal/60 mb-1">
                    Size
                  </label>
                  <select
                    value={v.size}
                    onChange={(e) => {
                      const newVars = [...variants];
                      newVars[idx].size = e.target.value;
                      setVariants(newVars);
                    }}
                    className="w-full border border-canvas-border p-1.5 text-xs bg-white"
                  >
                    {COMMON_SIZES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-semibold text-charcoal/60 mb-1">
                    Color Name
                  </label>
                  <input
                    type="text"
                    value={v.color}
                    onChange={(e) => {
                      const newVars = [...variants];
                      newVars[idx].color = e.target.value;
                      setVariants(newVars);
                    }}
                    className="w-full border border-canvas-border p-1.5 text-xs bg-white"
                    placeholder="Emerald Green"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-semibold text-charcoal/60 mb-1">
                    Initial Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={v.stock}
                    onChange={(e) => {
                      const newVars = [...variants];
                      newVars[idx].stock = Number(e.target.value);
                      setVariants(newVars);
                    }}
                    className="w-full border border-canvas-border p-1.5 text-xs bg-white font-mono"
                    placeholder="10"
                  />
                </div>

                <div className="flex items-end justify-between gap-2 pt-4 sm:pt-0">
                  <div className="flex-1">
                    <label className="block text-[10px] uppercase font-semibold text-charcoal/60 mb-1">
                      Variant SKU
                    </label>
                    <input
                      type="text"
                      value={v.sku}
                      onChange={(e) => {
                        const newVars = [...variants];
                        newVars[idx].sku = e.target.value;
                        setVariants(newVars);
                      }}
                      className="w-full border border-canvas-border p-1.5 text-xs bg-white font-mono"
                      placeholder="Auto"
                    />
                  </div>
                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(idx)}
                      className="p-1.5 text-rose-600 hover:text-rose-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Display Badges & Visibility */}
        <div className="bg-white border border-canvas-border p-6 shadow-xs space-y-4">
          <h2 className="font-editorial-heading text-lg text-charcoal border-b border-canvas-border pb-2">
            4. Flags & Visibility
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
                }
                className="w-4 h-4 accent-charcoal"
              />
              <span className="font-semibold">Active in Store</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isFeatured: e.target.checked,
                  }))
                }
                className="w-4 h-4 accent-charcoal"
              />
              <span className="font-semibold">Featured on Home</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isNew}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, isNew: e.target.checked }))
                }
                className="w-4 h-4 accent-charcoal"
              />
              <span className="font-semibold">"New Arrival" Tag</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isBestSeller}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isBestSeller: e.target.checked,
                  }))
                }
                className="w-4 h-4 accent-charcoal"
              />
              <span className="font-semibold">"Bestseller" Tag</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Link href="/admin/products">
            <Button variant="outline" size="md">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            variant="gold"
            size="md"
            isLoading={loading}
            className="text-xs uppercase tracking-wider font-bold"
          >
            PUBLISH PRODUCT TO STORE
          </Button>
        </div>
      </form>
    </div>
  );
}
