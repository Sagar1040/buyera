"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  PlusCircle,
  Search,
  Filter,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
  Sliders,
  Layers,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Quick Stock Editing Modal
  const [stockEditingProduct, setStockEditingProduct] = useState<any | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const url = new URL("/api/admin/products", window.location.origin);
      if (search) url.searchParams.set("search", search);
      if (selectedCategory !== "ALL")
        url.searchParams.set("category", selectedCategory);

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleToggleStatus = async (productId: string, current: boolean) => {
    try {
      const res = await fetch(`/api/admin/products/${productId}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !current }),
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, isActive: !current } : p))
      );
      setSuccessMsg("Product visibility status updated.");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg("Failed to update status.");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setSuccessMsg("Product deleted successfully.");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg("Failed to delete product.");
    }
  };

  const handleSaveVariantStock = async (
    variantId: string,
    newStock: number
  ) => {
    try {
      await fetch(`/api/admin/products/${stockEditingProduct.id}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, stock: newStock }),
      });
      setStockEditingProduct((prev: any) => ({
        ...prev,
        variants: prev.variants.map((v: any) =>
          v.id === variantId ? { ...v, stock: newStock } : v
        ),
      }));
      setSuccessMsg("Variant inventory stock updated.");
      setTimeout(() => setSuccessMsg(null), 3000);
      fetchProducts();
    } catch (err) {
      setErrorMsg("Failed to save stock.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-canvas-border pb-6">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-gold font-semibold">
            CATALOG & INVENTORY CONTROL
          </span>
          <h1 className="font-editorial-heading text-2xl sm:text-3xl text-charcoal">
            Products & Stock Manager
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={fetchProducts}
            variant="outline"
            size="sm"
            className="text-xs uppercase tracking-wider"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Link href="/admin/products/new">
            <Button variant="primary" size="sm" className="text-xs uppercase tracking-wider">
              <PlusCircle className="w-3.5 h-3.5 mr-1.5 text-gold" />
              Add New Product
            </Button>
          </Link>
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

      {/* Filter and Search Bar */}
      <div className="bg-white border border-canvas-border p-4 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Product Name, SKU, or Category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-canvas-border focus:outline-none focus:border-gold"
            />
          </div>
          <Button type="submit" variant="primary" size="sm" className="text-xs">
            Search
          </Button>
        </form>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-charcoal/60 uppercase text-[10px] font-semibold">
            Category:
          </span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-canvas-border px-3 py-1.5 text-xs bg-white focus:outline-none focus:border-gold"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-canvas-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-cream-100/70 border-b border-canvas-border text-charcoal/60 uppercase tracking-widest text-[11px]">
                <th className="py-3.5 px-4">Product Info</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price & MRP</th>
                <th className="py-3.5 px-4">Total Inventory</th>
                <th className="py-3.5 px-4">Active Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-charcoal/50">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-gold" />
                    Loading product catalog...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-charcoal/50">
                    No products found in this category.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-cream-50 transition-colors">
                    {/* Thumbnail & Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-14 bg-cream-100 border border-canvas-border shrink-0 overflow-hidden">
                          {p.image ? (
                            <Image
                              src={p.image}
                              alt={p.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[9px] text-charcoal/40">
                              No Img
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <p className="font-semibold text-charcoal truncate">
                            {p.name}
                          </p>
                          <p className="text-[10px] text-charcoal/50 font-mono">
                            SKU: {p.sku}
                          </p>
                          <div className="flex gap-1 mt-1">
                            {p.isFeatured && (
                              <span className="text-[9px] bg-gold/15 text-gold-dark font-bold px-1 py-0.2">
                                FEATURED
                              </span>
                            )}
                            {p.isBestSeller && (
                              <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1 py-0.2">
                                BESTSELLER
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 font-medium text-charcoal">
                      <span className="px-2 py-1 bg-cream-100 border border-canvas-border text-[11px]">
                        {p.category}
                      </span>
                    </td>

                    {/* Price & MRP */}
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-charcoal">
                        {formatPrice(p.price)}
                      </p>
                      {p.mrp && p.mrp > p.price && (
                        <p className="text-[10px] text-charcoal/40 line-through">
                          {formatPrice(p.mrp)}
                        </p>
                      )}
                    </td>

                    {/* Total Stock & Variant Manager Button */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => setStockEditingProduct(p)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs border border-canvas-border hover:border-gold hover:bg-cream-100 transition-colors font-mono"
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            p.totalStock > 5
                              ? "bg-emerald-500"
                              : p.totalStock > 0
                              ? "bg-amber-500"
                              : "bg-rose-500"
                          }`}
                        />
                        <span className="font-bold text-charcoal">
                          {p.totalStock}
                        </span>{" "}
                        Units ({p.variants?.length || 0} vars)
                      </button>
                    </td>

                    {/* Active Status Toggle */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleStatus(p.id, p.isActive)}
                        className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider border transition-colors ${
                          p.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                        }`}
                      >
                        {p.isActive ? "ACTIVE" : "HIDDEN"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-canvas-border text-charcoal hover:border-charcoal transition-colors text-xs"
                      >
                        <Edit className="w-3.5 h-3.5 text-gold-dark" />
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDeleteProduct(p.id)}
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

      {/* Variant Inventory Stock Modal */}
      {stockEditingProduct && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border border-canvas-border p-6 max-w-lg w-full space-y-4 shadow-luxury">
            <div className="flex items-center justify-between border-b border-canvas-border pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-gold font-semibold">
                  STOCK MATRIX
                </span>
                <h3 className="font-editorial-heading text-lg text-charcoal">
                  {stockEditingProduct.name}
                </h3>
              </div>
              <button
                onClick={() => setStockEditingProduct(null)}
                className="text-xs text-charcoal/50 hover:text-charcoal"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-charcoal/70">
              Update inventory count per size & color variant:
            </p>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {(stockEditingProduct.variants || []).map((v: any) => (
                <div
                  key={v.id}
                  className="p-3 border border-canvas-border flex items-center justify-between text-xs bg-cream-50/50"
                >
                  <div>
                    <p className="font-semibold text-charcoal font-mono">
                      Size: {v.size} • Color: {v.color}
                    </p>
                    <p className="text-[10px] text-charcoal/50 font-mono">
                      SKU: {v.sku}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      defaultValue={v.stock}
                      onBlur={(e) =>
                        handleSaveVariantStock(v.id, Number(e.target.value))
                      }
                      className="w-20 border border-canvas-border p-1.5 text-center font-mono font-bold text-charcoal bg-white"
                    />
                    <span className="text-[10px] text-charcoal/50">Units</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3 border-t border-canvas-border">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setStockEditingProduct(null)}
              >
                Done Editing Stock
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
