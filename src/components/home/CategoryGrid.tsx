"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

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
    name: "Luxury Abayas",
    count: "48+ Silhouettes",
    tag: "DUBAI EDIT",
    image:
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
    href: "/category/abayas",
  },
  {
    id: "cat-2",
    name: "Medina Silk Hijabs",
    count: "36+ Shades",
    tag: "PURE WEAVE",
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop",
    href: "/category/hijabs",
  },
  {
    id: "cat-3",
    name: "Pakistani Suits",
    count: "52+ Ensembles",
    tag: "EID SPECIAL",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
    href: "/category/pakistani-churidars",
  },
  {
    id: "cat-4",
    name: "Anarkalis & Gowns",
    count: "28+ Styles",
    tag: "HAUTE COUTURE",
    image:
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop",
    href: "/category/islamic-dresses",
  },
  {
    id: "cat-5",
    name: "Modest Co-ords",
    count: "24+ Styles",
    tag: "NEW IN",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
    href: "/shop?cat=modest-wear",
  },
  {
    id: "cat-6",
    name: "Royal Kaftans",
    count: "18+ Styles",
    tag: "EMBELLISHED",
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop",
    href: "/shop?tag=kaftan",
  },
];

export function CategoryGrid() {
  return (
    <section className="py-16 bg-cream-50/50 border-b border-canvas-border">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-[10px] tracking-[0.25em] uppercase text-gold font-brand-badge font-semibold">
            CURATED DEPARTMENTS
          </span>
          <h2 className="font-editorial-heading text-2xl sm:text-3xl text-charcoal">
            Shop by Category
          </h2>
          <p className="text-xs text-charcoal/60 font-light">
            Discover hand-curated modest silhouettes crafted with premium fabrics and exquisite artisanal tailoring.
          </p>
        </div>

        {/* Circular / Luxury Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="group flex flex-col items-center text-center"
            >
              {/* Image Circle with Metallic Ring on Hover */}
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden bg-cream-200 border-2 border-canvas-border shadow-sm group-hover:border-gold group-hover:shadow-luxury transition-all duration-300 transform group-hover:scale-105">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 120px, 160px"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-charcoal/10 group-hover:bg-transparent transition-colors" />
              </div>

              {/* Text Info */}
              <div className="mt-3.5 space-y-0.5">
                <span className="text-[9px] uppercase tracking-widest text-gold-dark font-bold">
                  {cat.tag}
                </span>
                <h3 className="text-xs sm:text-sm font-semibold text-charcoal group-hover:text-gold transition-colors line-clamp-1">
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
