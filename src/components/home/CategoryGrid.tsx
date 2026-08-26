"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";

interface CategoryStory {
  id: string;
  name: string;
  count: string;
  tag: string;
  image: string;
  href: string;
}

const categories: CategoryStory[] = [
  {
    id: "cat-1",
    name: "Abayas",
    count: "48+ Styles",
    tag: "DUBAI EDIT",
    image:
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
    href: "/category/abayas",
  },
  {
    id: "cat-2",
    name: "Hijabs",
    count: "36+ Shades",
    tag: "MEDINA SILK",
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop",
    href: "/category/hijabs",
  },
  {
    id: "cat-3",
    name: "Kurtas & Suits",
    count: "52+ Ensembles",
    tag: "PURE LAWN",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
    href: "/category/pakistani-churidars",
  },
  {
    id: "cat-4",
    name: "Kaftans",
    count: "18+ Styles",
    tag: "EMBELLISHED",
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop",
    href: "/shop?tag=kaftan",
  },
  {
    id: "cat-5",
    name: "Co-ords",
    count: "24+ Styles",
    tag: "MODERN FIT",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
    href: "/shop?cat=modest-wear",
  },
  {
    id: "cat-6",
    name: "Anarkalis",
    count: "28+ Styles",
    tag: "HAUTE COUTURE",
    image:
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop",
    href: "/category/islamic-dresses",
  },
];

export function CategoryGrid() {
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
          {categories.map((cat) => (
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
                <span className="text-[9px] uppercase tracking-widest text-terracotta font-bold block">
                  {cat.tag}
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-charcoal group-hover:text-terracotta transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[10px] text-charcoal/50 font-light">
                  {cat.count}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
