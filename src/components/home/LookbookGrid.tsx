"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Instagram, Heart, Sparkles, ArrowRight } from "lucide-react";

interface LookbookItem {
  id: string;
  image: string;
  author: string;
  location: string;
  review: string;
  productName: string;
  productSlug: string;
  rating: number;
}

const LOOKBOOK_ITEMS: LookbookItem[] = [
  {
    id: "look-1",
    image:
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
    author: "Zainab Al-Mansoor",
    location: "Dubai, UAE",
    review:
      "The Korean Nida drape is extraordinarily soft and breathable. The metallic zardozi cuffs are pure luxury.",
    productName: "Royal Emerald Hand-Embroidered Abaya",
    productSlug: "royal-emerald-abaya",
    rating: 5,
  },
  {
    id: "look-2",
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop",
    author: "Aafiyah Sheikh",
    location: "London, UK",
    review:
      "Best Medina Silk hijab I've owned. It doesn't slip throughout the day and has the most gorgeous sheen.",
    productName: "Medina Silk Heritage Hijab",
    productSlug: "medina-silk-hijab-champagne",
    rating: 5,
  },
  {
    id: "look-3",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
    author: "Mariam Siddiqui",
    location: "Bengaluru, India",
    review:
      "Ordered custom tailored for a family wedding. The resham embroidery and fit were absolutely flawless.",
    productName: "Lahore Velvet Embroidered Anarkali",
    productSlug: "lahore-velvet-anarkali",
    rating: 5,
  },
  {
    id: "look-4",
    image:
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop",
    author: "Sarah Qureshi",
    location: "Toronto, Canada",
    review:
      "The kimono cut is so chic and modern. I received compliments all evening. Fast worldwide shipping!",
    productName: "Obsidian Black Open-Front Kimono",
    productSlug: "obsidian-kimono-abaya",
    rating: 5,
  },
];

export function LookbookGrid() {
  return (
    <section className="py-20 bg-warmBeige/40 border-b border-stoneBorder/60 relative overflow-hidden">
      {/* Background Glow Blobs */}
      <div className="absolute top-1/3 left-10 w-80 h-80 bg-blush/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-sage/50 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto space-y-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-[10px] tracking-[0.22em] uppercase text-charcoal/70 font-brand-badge font-bold rounded-full border border-stoneBorder">
            <Instagram className="w-3 h-3 text-gold" />
            STYLED BY OUR PRIVÉ COMMUNITY
          </span>
          <h2 className="font-editorial-heading text-2xl sm:text-4xl text-charcoal font-normal">
            The Aramya Lookbook
          </h2>
          <p className="text-xs sm:text-sm text-charcoal/60 font-light leading-relaxed">
            Real women celebrating modesty across 50+ countries. Tag <strong className="text-charcoal font-semibold">@buyera.couture</strong> to be featured.
          </p>
        </div>

        {/* 4-Column Card Grid with Floating Reviews */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {LOOKBOOK_ITEMS.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-3xl border border-stoneBorder/80 overflow-hidden shadow-card hover:shadow-luxury-lg hover:border-gold/60 transition-all duration-500 flex flex-col justify-between"
            >
              {/* Image Container with Soft Arched Top */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-cream-100">
                <Image
                  src={item.image}
                  alt={`${item.author} styling BUYERA`}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />

                {/* Location Tag */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-0.5 bg-white/90 backdrop-blur-md text-[9px] uppercase tracking-widest text-charcoal font-bold rounded-full shadow-xs">
                    {item.location}
                  </span>
                </div>

                {/* Product Pill Overlay */}
                <div className="absolute bottom-3 inset-x-3">
                  <Link
                    href={`/product/${item.productSlug}`}
                    className="block bg-charcoal/85 backdrop-blur-md text-white text-[10px] font-medium py-1.5 px-3 rounded-full hover:bg-black transition-colors line-clamp-1 text-center"
                  >
                    Shop This Silhouette →
                  </Link>
                </div>
              </div>

              {/* Review & Client Details */}
              <div className="p-5 space-y-3 bg-white flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-gold">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-charcoal/80 font-light italic leading-relaxed">
                    "{item.review}"
                  </p>
                </div>

                <div className="pt-2 border-t border-stoneBorder/50 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-charcoal">
                    {item.author}
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    Verified Order
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
