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
    <section className="py-16 sm:py-20 bg-warmBeige/60 border-b border-stoneBorder/60 relative overflow-hidden">
      {/* Background Soft Blobs */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-sage/40 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-blush/50 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16 space-y-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/90 backdrop-blur-sm text-[10px] tracking-[0.22em] uppercase text-charcoal/70 font-brand-badge font-bold rounded-full border border-stoneBorder">
            <Sparkles className="w-3 h-3 text-gold" />
            CURATED DEPARTMENTS
          </span>
          <h2 className="font-editorial-heading text-2xl sm:text-4xl text-charcoal font-normal">
            Curated by Silhouette & Occasion
          </h2>
          <p className="text-xs sm:text-sm text-charcoal/60 font-light leading-relaxed">
            Discover bespoke modest silhouettes crafted with certified Grade-A fabrics and exquisite artisanal tailoring.
          </p>
        </div>

        {/* Aesthetic Arched Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="group flex flex-col items-center text-center bg-white/70 backdrop-blur-sm p-3.5 sm:p-4 rounded-3xl border border-stoneBorder/80 transition-all duration-500 hover:bg-white hover:border-gold/60 hover:shadow-luxury hover:-translate-y-1"
            >
              {/* Arched Top Image Container */}
              <div className="relative w-full aspect-[4/5] rounded-t-[3.5rem] rounded-b-xl overflow-hidden bg-cream-200 border border-stoneBorder/60 shadow-xs">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 150px, 220px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-charcoal/10 group-hover:bg-transparent transition-colors" />
                
                {/* Floating Tag Pill */}
                <div className="absolute bottom-2 inset-x-2 flex justify-center">
                  <span className="px-2 py-0.5 bg-white/90 backdrop-blur-md text-[8px] uppercase tracking-widest text-charcoal font-bold rounded-full shadow-xs">
                    {cat.tag}
                  </span>
                </div>
              </div>

              {/* Text Info */}
              <div className="mt-3 space-y-0.5 w-full">
                <h3 className="text-xs sm:text-sm font-semibold text-charcoal group-hover:text-gold-dark transition-colors line-clamp-1">
                  {cat.name}
                </h3>
                <p className="text-[10px] text-charcoal/45 font-light">
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
