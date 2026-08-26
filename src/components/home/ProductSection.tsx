"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductType } from "@/types/product";
import { Sparkles, Flame, Clock, ArrowRight, Zap, Gift, RefreshCw } from "lucide-react";

interface ProductSectionProps {
  initialProducts?: ProductType[];
}

export function ProductSection({ initialProducts = [] }: ProductSectionProps) {
  const [activeTab, setActiveTab] = useState<"all" | "trending" | "bestsellers" | "festive">("all");
  const [products, setProducts] = useState<ProductType[]>(initialProducts);
  const [loading, setLoading] = useState(initialProducts.length === 0);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 42,
    seconds: 18,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch live published products from backend API
  useEffect(() => {
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.products)) {
          // Map to ProductType format and filter only active/published items
          const activeProds: ProductType[] = data.products
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

          setProducts(activeProds);
        }
      })
      .catch((err) => console.warn("Live products fetch notice:", err))
      .finally(() => setLoading(false));
  }, []);

  // Filter products by active tab
  const filteredProducts = products.filter((prod) => {
    if (activeTab === "trending") return prod.isFeatured || prod.isNew;
    if (activeTab === "bestsellers") return prod.isBestSeller;
    if (activeTab === "festive") {
      return (
        prod.tags?.some((t) => /festive|wedding|pakistani|silk|eid/i.test(t)) ||
        /suit|anarkali|gown|zari/i.test(prod.name)
      );
    }
    return true; // "all" tab
  });

  return (
    <div className="space-y-16 sm:space-y-20 py-12 sm:py-16">
      {/* 1. Soft Glassmorphic Flash Offer Banner */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-charcoal text-white rounded-3xl p-6 sm:p-10 border border-aramyaBorder/20 shadow-luxury-lg flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          {/* Subtle Glow Accents */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-terracotta/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-olive/20 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2.5 text-center md:text-left z-10">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="px-3 py-0.5 bg-terracotta text-white font-bold text-[9px] uppercase tracking-widest rounded-full">
                LIMITED ATELIER DROP
              </span>
              <span className="text-cream-200 text-xs uppercase tracking-widest font-semibold flex items-center gap-1">
                <Gift className="w-3.5 h-3.5 text-terracotta-300" />
                EVERYDAY ELEGANCE OFFER
              </span>
            </div>
            <h3 className="font-editorial-heading text-2xl sm:text-3xl font-normal text-cream-50">
              Complimentary 25% Off on Selected Silhouettes
            </h3>
            <p className="text-xs text-cream-200/80 font-light max-w-lg">
              Enter code{" "}
              <strong className="text-white bg-terracotta px-2.5 py-0.5 rounded-full font-mono font-bold">
                ARAMYA25
              </strong>{" "}
              at checkout. Includes custom sleeve & length tailoring.
            </p>
          </div>

          {/* Minimalist Countdown Clock */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 z-10">
            {[
              { label: "DAYS", value: timeLeft.days },
              { label: "HOURS", value: timeLeft.hours },
              { label: "MINS", value: timeLeft.minutes },
              { label: "SECS", value: timeLeft.seconds },
            ].map((box, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl w-14 h-14 sm:w-16 sm:h-16 text-center"
              >
                <span className="font-mono text-base sm:text-lg font-bold text-terracotta-200">
                  {String(box.value).padStart(2, "0")}
                </span>
                <span className="text-[8px] uppercase tracking-widest text-cream-200/70 font-semibold">
                  {box.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Curated Haute Couture Showcase */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2.5">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white text-[10px] tracking-[0.22em] uppercase text-terracotta font-brand-badge font-bold rounded-full border border-aramyaBorder shadow-xs">
            <Sparkles className="w-3 h-3 text-terracotta" />
            HAUTE COUTURE SELECTION
          </span>
          <h2 className="font-editorial-heading text-2xl sm:text-4xl text-charcoal font-normal">
            Signature Ensembles
          </h2>
          <p className="text-xs sm:text-sm text-charcoal/60 font-light leading-relaxed">
            Every piece is tailored to perfection with delicate zardozi, Korean Nida, and breathable silk weaves.
          </p>
        </div>

        {/* Aramya Minimalist Tab Switcher */}
        <div className="flex items-center justify-center gap-2 border-b border-aramyaBorder pb-4 mb-10 overflow-x-auto">
          {[
            { id: "all", label: "All New Arrivals", icon: Sparkles },
            { id: "trending", label: "Featured Atelier", icon: Zap },
            { id: "bestsellers", label: "Bestsellers", icon: Flame },
            { id: "festive", label: "Festive & Wedding", icon: Clock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-5 py-2 text-xs font-semibold uppercase tracking-widest rounded-full transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-terracotta text-white shadow-xs"
                    : "text-charcoal/70 hover:text-charcoal hover:bg-cream-100/70"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-charcoal/40"}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-16 text-center text-charcoal/50 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-terracotta" />
            <span className="text-xs uppercase tracking-widest font-bold">
              Loading New Arrivals...
            </span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-12 text-center text-charcoal/50 bg-white border border-aramyaBorder rounded-3xl p-8 max-w-md mx-auto">
            <p className="font-semibold text-charcoal text-sm">No silhouettes found in this edit</p>
            <p className="text-xs text-charcoal/50 mt-1 mb-4">
              Explore our full collection in the shop.
            </p>
            <button
              onClick={() => setActiveTab("all")}
              className="px-4 py-2 bg-cream-100 text-charcoal text-xs font-semibold rounded-full hover:bg-terracotta hover:text-white transition-all"
            >
              View All Silhouettes
            </button>
          </div>
        ) : (
          /* Product Cards Grid */
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}

        {/* View All CTA */}
        <div className="text-center pt-14">
          <Link href="/shop">
            <button className="btn-aramya-terracotta group">
              <span>EXPLORE ALL SILHOUETTES</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
