"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  FolderTree,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  X,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    imageUrl: "",
    bannerUrl: "",
    order: 0,
    isActive: true,
  });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setForm({
      name: "",
      slug: "",
      description: "",
      imageUrl:
        "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
      bannerUrl:
        "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop",
      order: categories.length + 1,
      isActive: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (category: any) => {
    setEditingCategory(category);
    setForm({
      name: category.name || "",
      slug: category.slug || "",
      description: category.description || "",
      imageUrl: category.imageUrl || "",
      bannerUrl: category.bannerUrl || "",
      order: category.order || 0,
      isActive: Boolean(category.isActive),
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) {
      setErrorMsg("Category name is required.");
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    try {
      const isEdit = !!editingCategory;
      const url = isEdit
        ? `/api/admin/categories/${editingCategory.id}`
        : "/api/admin/categories";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save category.");
      }

      setSuccessMsg(
        isEdit
          ? "Category updated successfully."
          : "New category published."
      );
      setTimeout(() => setSuccessMsg(null), 3000);
      setModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save category.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setSuccessMsg("Category deleted.");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setErrorMsg("Failed to delete category.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-canvas-border pb-6">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-gold font-semibold">
            CATALOG TAXONOMY
          </span>
          <h1 className="font-editorial-heading text-2xl sm:text-3xl text-charcoal">
            Category & Collection Management
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={fetchCategories}
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
            Add New Category
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

      {/* Categories Table */}
      <div className="bg-white border border-canvas-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-cream-100/70 border-b border-canvas-border text-charcoal/60 uppercase tracking-widest text-[11px]">
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">URL Slug</th>
                <th className="py-3.5 px-4">Products Linked</th>
                <th className="py-3.5 px-4">Display Priority</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-canvas-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-charcoal/50">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-gold" />
                    Loading categories...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-charcoal/50">
                    No categories found. Click "Add New Category" to create one.
                  </td>
                </tr>
              ) : (
                categories.map((c) => (
                  <tr key={c.id} className="hover:bg-cream-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 bg-cream-100 border border-canvas-border shrink-0 overflow-hidden">
                          {c.imageUrl ? (
                            <Image
                              src={c.imageUrl}
                              alt={c.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <FolderTree className="w-5 h-5 m-auto text-charcoal/40" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-charcoal">{c.name}</p>
                          <p className="text-[10px] text-charcoal/60 line-clamp-1 max-w-xs">
                            {c.description || "No description"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-charcoal/70">
                      /category/{c.slug}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 bg-cream-100 border border-canvas-border text-[10px] font-semibold">
                        {c.productsCount || 0} Products
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-charcoal">
                      #{c.order}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 text-[9px] uppercase font-bold border ${
                          c.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        {c.isActive ? "ACTIVE" : "HIDDEN"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-canvas-border text-charcoal hover:border-charcoal transition-colors text-xs"
                      >
                        <Edit className="w-3.5 h-3.5 text-gold-dark" />
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(c.id)}
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

      {/* Category Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border border-canvas-border p-6 max-w-lg w-full space-y-5 shadow-luxury">
            <div className="flex items-center justify-between border-b border-canvas-border pb-3">
              <h3 className="font-editorial-heading text-xl text-charcoal">
                {editingCategory ? "Edit Category" : "Create New Category"}
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
                  label="Category Name *"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g. Luxury Abayas"
                />
                <Input
                  label="Custom Slug (Optional)"
                  value={form.slug}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  placeholder="e.g. luxury-abayas"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Brief description for SEO and category cards..."
                  className="w-full border border-canvas-border p-2.5 text-xs text-charcoal focus:outline-none focus:border-gold"
                />
              </div>

              <Input
                label="Thumbnail Image URL"
                type="url"
                value={form.imageUrl}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, imageUrl: e.target.value }))
                }
                placeholder="https://images.unsplash.com/..."
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Display Priority"
                  type="number"
                  value={form.order}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      order: Number(e.target.value),
                    }))
                  }
                />

                <div className="flex items-center pt-6">
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
                    <span className="font-semibold">Active in Navigation</span>
                  </label>
                </div>
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
                  {editingCategory ? "Save Category" : "Publish Category"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
