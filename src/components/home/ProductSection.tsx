"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProductType } from "@/types/product";
import { ProductCard } from "@/components/shop/ProductCard";
import { ArrowRight } from "lucide-react";

interface ProductSectionProps {
  newArrivals: ProductType[];
  bestSellers: ProductType[];
  featured: ProductType[];
}

export function ProductSection({
  newArrivals = [],
  bestSellers = [],
  featured = [],
}: ProductSectionProps) {
  const [activeTab, setActiveTab] = useState<"new" | "bestseller" | "featured">(
    "new"
  );

  const getActiveProducts = () => {
    switch (activeTab) {
      case "bestseller":
        return bestSellers.length > 0 ? bestSellers : featured;
      case "featured":
        return featured.length > 0 ? featured : newArrivals;
      default:
        return newArrivals.length > 0 ? newArrivals : featured;
    }
  };

  const activeProducts = getActiveProducts().slice(0, 8);

  return (
    <section className="py-20 bg-cream-50 border-y border-canvas-border">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Title & Segmented Tab Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <p className="text-[10px] tracking-[0.25em] uppercase text-gold-600 font-brand-badge font-semibold">
              EXQUISITE CRAFTSMANSHIP
            </p>
            <h2 className="font-editorial-heading text-2xl sm:text-4xl text-charcoal font-normal">
              Curated Showcases
            </h2>
          </div>

          {/* Segmented Controls */}
          <div className="inline-flex p-1 bg-cream-200 border border-canvas-border self-start md:self-auto">
            <button
              onClick={() => setActiveTab("new")}
              className={`px-4 py-2 text-xs uppercase tracking-widest font-medium transition-all ${
                activeTab === "new"
                  ? "bg-charcoal text-white shadow-sm"
                  : "text-charcoal/70 hover:text-charcoal"
              }`}
            >
              New Arrivals
            </button>
            <button
              onClick={() => setActiveTab("bestseller")}
              className={`px-4 py-2 text-xs uppercase tracking-widest font-medium transition-all ${
                activeTab === "bestseller"
                  ? "bg-charcoal text-white shadow-sm"
                  : "text-charcoal/70 hover:text-charcoal"
              }`}
            >
              Bestsellers
            </button>
            <button
              onClick={() => setActiveTab("featured")}
              className={`px-4 py-2 text-xs uppercase tracking-widest font-medium transition-all ${
                activeTab === "featured"
                  ? "bg-charcoal text-white shadow-sm"
                  : "text-charcoal/70 hover:text-charcoal"
              }`}
            >
              Trending Now
            </button>
          </div>
        </div>

        {/* Product Grid */}
        {activeProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {activeProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border border-canvas-border">
            <p className="text-sm text-charcoal/60">
              New couture pieces are arriving shortly. Stay tuned.
            </p>
          </div>
        )}

        {/* View All Button */}
        <div className="mt-14 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-charcoal font-semibold border-b-2 border-charcoal hover:border-gold hover:text-gold transition-colors pb-1"
          >
            VIEW ENTIRE CATALOG
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
