"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  X,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Quick Stock Editing Modal
  const [stockEditingProduct, setStockEditingProduct] = useState<any | null>(null);

  // Delete Confirmation Modal
  const [deletingProduct, setDeletingProduct] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
    // Optimistic update
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, isActive: !current } : p))
    );

    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !current }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status");

      setSuccessMsg(
        !current
          ? "Product published to live storefront."
          : "Product un-published (set to draft)."
      );
      router.refresh();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      // Revert optimistic update on failure
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, isActive: current } : p))
      );
      setErrorMsg(err.message || "Failed to update product status.");
      setTimeout(() => setErrorMsg(null), 4000);
    }
  };

  const handleToggleStockStatus = async (productId: string, hasStock: boolean) => {
    const newStock = hasStock ? 0 : 25;
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: newStock }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId
              ? {
                  ...p,
                  totalStock: newStock,
                  variants: p.variants?.map((v: any) => ({ ...v, stock: newStock })),
                }
              : p
          )
        );
        setSuccessMsg(newStock === 0 ? "Product marked as Out of Stock." : "Product marked as In Stock (25 units).");
        router.refresh();
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch (err) {
      setErrorMsg("Failed to update stock status.");
    }
  };

  const confirmDeleteProduct = async () => {
    if (!deletingProduct) return;
    const targetProduct = deletingProduct;
    setIsDeleting(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/admin/products/${targetProduct.id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete product.");
      }

      // Instantly close modal
      setDeletingProduct(null);

      // Remove from local React state
      setProducts((prev) => prev.filter((p) => p.id !== targetProduct.id));

      // Trigger router refresh
      router.refresh();

      setSuccessMsg(data.message || `Product "${targetProduct.name}" deleted successfully.`);
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error("Delete product error in frontend:", err);
      setErrorMsg(err.message || "Failed to delete product.");
    } finally {
      setIsDeleting(false);
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
            className="border border-canvas-border p-2 bg-white text-xs text-charcoal focus:outline-none focus:border-gold"
          >
            <option value="ALL">All Collections</option>
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
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-cream-100/70 border-b border-canvas-border text-[10px] font-semibold uppercase tracking-wider text-charcoal/70">
                <th className="py-3.5 px-4">Item & Silhouette</th>
                <th className="py-3.5 px-4">SKU / Code</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Pricing (MRP)</th>
                <th className="py-3.5 px-4">Stock Matrix</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-canvas-border/60 font-sans">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-charcoal/50">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-gold" />
                    Fetching boutique catalog...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-charcoal/50">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    No products found matching the criteria.
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const primaryImg =
                    p.image ||
                    (p.images && p.images[0]?.url) ||
                    (Array.isArray(p.images) && p.images[0]) ||
                    "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=200";

                  const totalInventory =
                    p.totalStock ??
                    p.variants?.reduce((sum: number, v: any) => sum + (v.stock || 0), 0) ??
                    0;

                  return (
                    <tr key={p.id} className="hover:bg-cream-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-14 relative bg-cream-100 shrink-0 border border-canvas-border/80 overflow-hidden">
                            <img
                              src={primaryImg}
                              alt={p.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                              }}
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-charcoal leading-tight line-clamp-1">
                              {p.name}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1">
                              {p.isFeatured && (
                                <span className="bg-gold/15 text-gold-dark text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.2 rounded-xs">
                                  Featured
                                </span>
                              )}
                              {p.isBestSeller && (
                                <span className="bg-charcoal text-white text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.2 rounded-xs">
                                  Bestseller
                                </span>
                              )}
                              {p.isNew && (
                                <span className="bg-emerald-100 text-emerald-800 text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.2 rounded-xs">
                                  New
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-charcoal/70 text-[11px]">
                        {p.sku || "N/A"}
                      </td>

                      <td className="py-3 px-4 text-charcoal/80">
                        {p.category?.name || p.category || "Uncategorized"}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-charcoal">
                          {formatPrice(p.price)}
                        </div>
                        {p.mrp && p.mrp > p.price && (
                          <div className="text-[10px] text-charcoal/40 line-through font-mono">
                            {formatPrice(p.mrp)}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setStockEditingProduct(p)}
                            className="flex items-center gap-1.5 hover:text-terracotta font-medium transition-colors"
                            title="Click to edit variant stock levels"
                          >
                            <span
                              className={`inline-block w-2 h-2 rounded-full ${
                                totalInventory === 0
                                  ? "bg-rose-500"
                                  : totalInventory < 10
                                  ? "bg-amber-500"
                                  : "bg-emerald-500"
                              }`}
                            />
                            <span className="font-mono font-bold text-xs">
                              {totalInventory}
                            </span>
                            <span className="text-[10px] text-charcoal/40">
                              ({p.variants?.length || 0} var)
                            </span>
                          </button>

                          <button
                            onClick={() => handleToggleStockStatus(p.id, totalInventory > 0)}
                            className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider transition-colors ${
                              totalInventory > 0
                                ? "bg-emerald-50 text-emerald-700 hover:bg-rose-50 hover:text-rose-700"
                                : "bg-rose-50 text-rose-700 hover:bg-emerald-50 hover:text-emerald-700"
                            }`}
                            title="Toggle in-stock / out-of-stock"
                          >
                            {totalInventory > 0 ? "In Stock" : "Out of Stock"}
                          </button>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleStatus(p.id, p.isActive)}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider transition-all border flex items-center gap-1.5 ${
                            p.isActive
                              ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100 shadow-xs"
                              : "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100"
                          }`}
                          title="Click to toggle publish status"
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              p.isActive ? "bg-emerald-500" : "bg-amber-500"
                            }`}
                          />
                          {p.isActive ? "Published" : "Draft"}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right space-x-1">
                        <Link href={`/admin/products/${p.id}`}>
                          <button
                            title="Edit Product Details & Gallery"
                            className="p-1.5 bg-white border border-canvas-border hover:border-gold hover:text-gold transition-colors text-charcoal/70 inline-block"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        </Link>

                        <button
                          onClick={() => setDeletingProduct(p)}
                          title="Delete Product Permanently"
                          className="p-1.5 bg-white border border-canvas-border hover:border-rose-500 hover:text-rose-600 transition-colors text-charcoal/70"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white max-w-md w-full p-6 shadow-2xl space-y-4 border border-canvas-border max-h-[90vh] overflow-y-auto my-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-canvas-border pb-3">
              <div className="flex items-center gap-2 text-rose-600 font-semibold">
                <AlertTriangle className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-wider">
                  Confirm Deletion
                </span>
              </div>
              <button
                onClick={() => setDeletingProduct(null)}
                disabled={isDeleting}
                className="text-charcoal/50 hover:text-charcoal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-charcoal/80 leading-relaxed">
                Are you sure you want to permanently delete{" "}
                <strong className="text-charcoal font-bold">
                  "{deletingProduct.name}"
                </strong>
                ?
              </p>
              <div className="p-3 bg-rose-50/70 border border-rose-100 text-[11px] text-rose-800 space-y-1">
                <p>
                  • Related images, reviews, and stock variants will be cleanly unlinked via transaction.
                </p>
                <p>• Historical order records will preserve their purchase snapshots safely.</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeletingProduct(null)}
                disabled={isDeleting}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={confirmDeleteProduct}
                isLoading={isDeleting}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs border-rose-600 font-bold uppercase tracking-wider"
              >
                DELETE PERMANENTLY
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Variant Quick Stock Modal */}
      {stockEditingProduct && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white max-w-lg w-full p-6 shadow-2xl space-y-4 border border-canvas-border max-h-[90vh] overflow-y-auto my-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-canvas-border pb-3">
              <div>
                <span className="text-[10px] text-gold uppercase font-bold tracking-wider">
                  QUICK INVENTORY MANAGER
                </span>
                <h3 className="font-editorial-heading text-lg text-charcoal">
                  {stockEditingProduct.name}
                </h3>
              </div>
              <button
                onClick={() => setStockEditingProduct(null)}
                className="text-charcoal/50 hover:text-charcoal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {stockEditingProduct.variants?.map((v: any) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between p-3 border border-canvas-border bg-cream-50/50 text-xs"
                >
                  <div>
                    <p className="font-semibold text-charcoal">
                      Size: {v.size} • {v.color}
                    </p>
                    <p className="text-[10px] font-mono text-charcoal/50">
                      SKU: {v.sku}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      defaultValue={v.stock}
                      id={`stock-input-${v.id}`}
                      className="w-20 border border-canvas-border p-1.5 text-center font-mono font-bold text-charcoal bg-white focus:outline-none focus:border-gold"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const inputEl = document.getElementById(
                          `stock-input-${v.id}`
                        ) as HTMLInputElement;
                        if (inputEl) {
                          handleSaveVariantStock(v.id, Number(inputEl.value));
                        }
                      }}
                      className="text-[10px] px-2.5 py-1 uppercase tracking-wider"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-canvas-border">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setStockEditingProduct(null)}
                className="text-xs"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
