"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductType } from "@/types/product";
import { Sparkles, Search, SlidersHorizontal, RefreshCw, Layers } from "lucide-react";

export default function ShopPage() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("category") || "ALL";

  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "price_asc" | "price_desc" | "popularity">("newest");

  // Fetch categories
  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      })
      .catch((err) => console.warn("Categories fetch error:", err));
  }, []);

  // Fetch live products from backend
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const url = new URL("/api/admin/products", window.location.origin);
      if (selectedCategory !== "ALL") {
        url.searchParams.set("category", selectedCategory);
      }
      if (searchQuery.trim()) {
        url.searchParams.set("search", searchQuery.trim());
      }

      const res = await fetch(url.toString());
      const data = await res.json();

      if (data?.success && Array.isArray(data.products)) {
        const mapped: ProductType[] = data.products
          .filter((p: any) => p.isActive !== false)
          .map((p: any) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            sku: p.sku,
            price: p.price,
            mrp: p.mrp || p.price * 1.3,
            description: p.description || p.shortDesc || "",
            shortDesc: p.shortDesc,
            fabricCare: p.fabricCare,
            categoryId: p.categoryId || "cat-1",
            category: {
              id: p.categoryId || "cat-1",
              name: p.category || "Luxury Modest",
              slug: p.categorySlug || "abayas",
              isActive: true,
              order: 1,
            },
            images: (p.images && p.images.length > 0)
              ? p.images.map((url: string, idx: number) => ({
                  id: `img-${idx}`,
                  url,
                  isPrimary: idx === 0,
                  order: idx,
                }))
              : [
                  {
                    id: "img-def",
                    url: p.image || "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
                    isPrimary: true,
                    order: 1,
                  },
                ],
            variants: p.variants || [],
            isActive: p.isActive !== false,
            isFeatured: Boolean(p.isFeatured),
            isNew: Boolean(p.isNew),
            isBestSeller: Boolean(p.isBestSeller),
            tags: p.tags || [],
            createdAt: p.createdAt || new Date().toISOString(),
            updatedAt: p.updatedAt || new Date().toISOString(),
          }));

        setProducts(mapped);
      }
    } catch (err) {
      console.warn("Shop products fetch notice:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  // Client-side sorting
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "price_asc") return a.price - b.price;
    if (sortBy === "price_desc") return b.price - a.price;
    if (sortBy === "popularity") return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
    // newest (default)
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return timeB - timeA;
  });

  return (
    <div className="bg-cream-50 min-h-screen py-10 sm:py-14">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Title */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white text-[10px] tracking-[0.22em] uppercase text-terracotta font-brand-badge font-bold rounded-full border border-aramyaBorder shadow-xs">
            <Sparkles className="w-3 h-3 text-terracotta" />
            HAUTE COUTURE CATALOG
          </span>
          <h1 className="font-editorial-heading text-3xl sm:text-4xl text-charcoal font-normal">
            Bespoke Modest Silhouettes
          </h1>
          <p className="text-xs sm:text-sm text-charcoal/60 font-light">
            Showing {sortedProducts.length} certified artisan-tailored ensembles
          </p>
        </div>

        {/* Filter & Search Bar Strip */}
        <div className="bg-white border border-aramyaBorder p-4 rounded-3xl shadow-card flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory("ALL")}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-full transition-all whitespace-nowrap ${
                selectedCategory === "ALL"
                  ? "bg-terracotta text-white shadow-xs"
                  : "bg-cream-100/70 text-charcoal/70 hover:bg-cream-100 hover:text-charcoal"
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-full transition-all whitespace-nowrap ${
                  selectedCategory === cat.slug
                    ? "bg-terracotta text-white shadow-xs"
                    : "bg-cream-100/70 text-charcoal/70 hover:bg-cream-100 hover:text-charcoal"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                fetchProducts();
              }}
              className="relative flex-1 md:w-48"
            >
              <Search className="w-3.5 h-3.5 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-cream-50/70 border border-aramyaBorder rounded-full text-xs text-charcoal focus:outline-none focus:border-terracotta font-sans"
              />
            </form>

            <div className="flex items-center gap-1.5 shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5 text-charcoal/50" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-cream-50/70 border border-aramyaBorder rounded-full text-xs font-medium px-3 py-1.5 text-charcoal focus:outline-none focus:border-terracotta cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="popularity">Most Popular</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="py-24 text-center text-charcoal/50 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-7 h-7 animate-spin text-terracotta" />
            <span className="text-xs uppercase tracking-widest font-bold">
              Loading Haute Couture Collection...
            </span>
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="bg-white border border-aramyaBorder rounded-3xl p-12 text-center max-w-md mx-auto space-y-4 shadow-card">
            <Layers className="w-10 h-10 text-terracotta/40 mx-auto" />
            <div className="space-y-1">
              <h3 className="font-editorial-heading text-xl text-charcoal">
                No Silhouettes Found
              </h3>
              <p className="text-xs text-charcoal/50">
                Try selecting another category or clearing your search filter.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedCategory("ALL");
                setSearchQuery("");
              }}
              className="px-5 py-2 bg-terracotta text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-terracotta-dark transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
