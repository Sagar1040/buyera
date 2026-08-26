"use client";

import React, { useState } from "react";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductType } from "@/types/product";
import { Sparkles, Search, SlidersHorizontal, Layers } from "lucide-react";

interface ShopCatalogProps {
  initialProducts: ProductType[];
  categories: { id: string; name: string; slug: string }[];
}

export function ShopCatalog({ initialProducts, categories }: ShopCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "price_asc" | "price_desc" | "popularity">("newest");

  // Filter products by category and search
  const filteredProducts = initialProducts.filter((product) => {
    if (selectedCategory !== "ALL") {
      const matchCat =
        product.category?.slug?.toLowerCase() === selectedCategory.toLowerCase() ||
        product.categoryId === selectedCategory;
      if (!matchCat) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = product.name?.toLowerCase().includes(q);
      const matchSku = product.sku?.toLowerCase().includes(q);
      const matchDesc = product.description?.toLowerCase().includes(q);
      const matchTag = product.tags?.some((t) => t.toLowerCase().includes(q));
      if (!matchName && !matchSku && !matchDesc && !matchTag) return false;
    }

    return true;
  });

  // Sort filtered products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price_asc") return a.price - b.price;
    if (sortBy === "price_desc") return b.price - a.price;
    if (sortBy === "popularity") return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
    // newest
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return timeB - timeA;
  });

  return (
    <div className="space-y-8">
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
          <div className="relative flex-1 md:w-48">
            <Search className="w-3.5 h-3.5 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-cream-50/70 border border-aramyaBorder rounded-full text-xs text-charcoal focus:outline-none focus:border-terracotta font-sans"
            />
          </div>

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
      {sortedProducts.length === 0 ? (
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
  );
}
