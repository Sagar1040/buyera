"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, PlusCircle } from "lucide-react";

interface CategoryStory {
  id: string;
  name: string;
  count?: string;
  badge?: string;
  image: string;
  href: string;
}

interface CategoryGridProps {
  categories?: any[];
}

export function CategoryGrid({ categories = [] }: CategoryGridProps) {
  const [catList, setCatList] = useState<CategoryStory[]>([]);

  useEffect(() => {
    if (categories && categories.length > 0) {
      const active = categories.filter((c: any) => c.isActive !== false);
      const mapped: CategoryStory[] = active.map((c: any) => ({
        id: c.id,
        name: c.name,
        count: "Curated Edit",
        badge: c.badge || "",
        image:
          c.imageUrl ||
          "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
        href: `/shop?category=${c.slug}`,
      }));
      setCatList(mapped);
    } else {
      // Fetch live categories if not passed from server
      fetch("/api/admin/categories")
        .then((res) => res.json())
        .then((data) => {
          if (data?.success && Array.isArray(data.categories) && data.categories.length > 0) {
            const mapped: CategoryStory[] = data.categories
              .filter((c: any) => c.isActive !== false)
              .map((c: any) => ({
                id: c.id,
                name: c.name,
                count: "Curated Edit",
                badge: c.badge || "",
                image:
                  c.imageUrl ||
                  "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
                href: `/shop?category=${c.slug}`,
              }));
            setCatList(mapped);
          } else {
            setCatList([]);
          }
        })
        .catch(() => setCatList([]));
    }
  }, [categories]);

  // Empty state if no categories exist in database
  if (catList.length === 0) {
    return (
      <section className="py-12 bg-cream/70 border-b border-aramyaBorder">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white border border-aramyaBorder rounded-3xl p-8 max-w-md mx-auto space-y-3 shadow-card">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cream-100 text-[10px] tracking-widest uppercase text-terracotta font-bold rounded-full">
              <Sparkles className="w-3 h-3 text-terracotta" />
              BOUTIQUE CATEGORIES
            </span>
            <p className="text-xs text-charcoal/60">
              No categories have been added yet.
            </p>
            <Link href="/admin/categories">
              <button className="px-4 py-2 bg-terracotta text-white text-xs font-bold uppercase tracking-wider rounded-full hover:bg-terracotta-dark transition-all flex items-center gap-1.5 mx-auto">
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Categories (Admin)</span>
              </button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-20 bg-cream/70 border-b border-aramyaBorder relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-12 sm:mb-14 space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white text-[10px] tracking-[0.2em] uppercase text-terracotta font-brand-badge font-bold rounded-full border border-aramyaBorder shadow-xs">
            <Sparkles className="w-3 h-3 text-terracotta" />
            SHOP BY CATEGORY
          </span>
          <h2 className="font-editorial-heading text-2xl sm:text-4xl text-charcoal font-normal">
            Everyday & Festive Silhouettes
          </h2>
          <p className="text-xs sm:text-sm text-charcoal/60 font-light">
            Explore pure breathable fabrics, contemporary drapes, and artisanal tailoring.
          </p>
        </div>

        {/* Circular / Arch Category Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 sm:gap-6">
          {catList.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="group flex flex-col items-center text-center"
            >
              {/* Circular Card with Soft Glow & Terracotta Ring on Hover */}
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden bg-white border-2 border-aramyaBorder shadow-card group-hover:border-terracotta group-hover:shadow-luxury-lg transition-all duration-500 transform group-hover:scale-105 p-1">
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 140px, 180px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-charcoal/10 group-hover:bg-transparent transition-colors" />
                </div>
              </div>

              {/* High Contrast Typography Below */}
              <div className="mt-3.5 space-y-0.5">
                {cat.badge && (
                  <span className="text-[11px] font-medium tracking-widest text-[#A34828] uppercase block">
                    {cat.badge}
                  </span>
                )}
                <h3 className="text-xs sm:text-sm font-bold text-charcoal group-hover:text-terracotta transition-colors">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
