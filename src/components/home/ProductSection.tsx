"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductType } from "@/types/product";
import { Sparkles, Flame, Clock, ArrowRight, Zap, Gift } from "lucide-react";

export function ProductSection() {
  const [activeTab, setActiveTab] = useState<"trending" | "bestsellers" | "eid" | "ready">("trending");

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

  const catalogProducts: ProductType[] = [
    {
      id: "prod-1",
      name: "Royal Emerald Hand-Embroidered Abaya",
      slug: "royal-emerald-abaya",
      sku: "BUY-ABY-001",
      mrp: 6999,
      price: 4999,
      isNew: true,
      isBestSeller: true,
      isActive: true,
      categoryId: "cat-1",
      category: { id: "cat-1", name: "Luxury Abayas", slug: "abayas", isActive: true, order: 1 },
      images: [
        { id: "img-1", url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop", isPrimary: true, order: 1 },
        { id: "img-2", url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop", isPrimary: false, order: 2 },
      ],
      description: "Crafted from Grade-A Korean Nida with intricate metallic zardozi cuffs.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "prod-2",
      name: "Medina Silk Heritage Hijab — Champagne Gold",
      slug: "medina-silk-hijab-champagne",
      sku: "BUY-HJB-002",
      mrp: 1499,
      price: 999,
      isNew: true,
      isBestSeller: false,
      isActive: true,
      categoryId: "cat-2",
      category: { id: "cat-2", name: "Medina Silk Hijabs", slug: "hijabs", isActive: true, order: 2 },
      images: [
        { id: "img-3", url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop", isPrimary: true, order: 1 },
        { id: "img-4", url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop", isPrimary: false, order: 2 },
      ],
      description: "Non-slip, breathable luxury weave in radiant warm champagne.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "prod-3",
      name: "Lahore Velvet Embroidered Anarkali Set",
      slug: "lahore-velvet-anarkali",
      sku: "BUY-ANK-003",
      mrp: 8999,
      price: 6499,
      isNew: false,
      isBestSeller: true,
      isActive: true,
      categoryId: "cat-3",
      category: { id: "cat-3", name: "Pakistani Suits", slug: "pakistani-churidars", isActive: true, order: 3 },
      images: [
        { id: "img-5", url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop", isPrimary: true, order: 1 },
        { id: "img-6", url: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop", isPrimary: false, order: 2 },
      ],
      description: "Intricate resham threadwork with heavy organza embroidered dupatta.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "prod-4",
      name: "Obsidian Black Open-Front Kimono Abaya",
      slug: "obsidian-kimono-abaya",
      sku: "BUY-ABY-004",
      mrp: 5999,
      price: 3999,
      isNew: false,
      isBestSeller: true,
      isActive: true,
      categoryId: "cat-1",
      category: { id: "cat-1", name: "Luxury Abayas", slug: "abayas", isActive: true, order: 1 },
      images: [
        { id: "img-7", url: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop", isPrimary: true, order: 1 },
        { id: "img-8", url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop", isPrimary: false, order: 2 },
      ],
      description: "Flowing contemporary kimono cut with subtle gold button line.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "prod-5",
      name: "Royal Zari Floor-Length Wedding Gown",
      slug: "royal-zari-wedding-gown",
      sku: "BUY-GWN-005",
      mrp: 12999,
      price: 9499,
      isNew: true,
      isBestSeller: false,
      isActive: true,
      categoryId: "cat-4",
      category: { id: "cat-4", name: "Islamic Dresses", slug: "islamic-dresses", isActive: true, order: 4 },
      images: [
        { id: "img-9", url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop", isPrimary: true, order: 1 },
        { id: "img-10", url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop", isPrimary: false, order: 2 },
      ],
      description: "Full-coverage royal silk gown with hand-sewn pearl work.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "prod-6",
      name: "Luxury Chiffon Shayla (Box of 4 Essentials)",
      slug: "chiffon-shayla-box-of-4",
      sku: "BUY-HJB-006",
      mrp: 3499,
      price: 2499,
      isNew: false,
      isBestSeller: true,
      isActive: true,
      categoryId: "cat-2",
      category: { id: "cat-2", name: "Medina Silk Hijabs", slug: "hijabs", isActive: true, order: 2 },
      images: [
        { id: "img-11", url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop", isPrimary: true, order: 1 },
        { id: "img-12", url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop", isPrimary: false, order: 2 },
      ],
      description: "Presented in our signature gold-embossed gift box with silk ribbon.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "prod-7",
      name: "Pakistani Pure Lawn Printed Festive Suit",
      slug: "pakistani-pure-lawn-suit",
      sku: "BUY-PAK-007",
      mrp: 4999,
      price: 3499,
      isNew: true,
      isBestSeller: false,
      isActive: true,
      categoryId: "cat-3",
      category: { id: "cat-3", name: "Pakistani Suits", slug: "pakistani-churidars", isActive: true, order: 3 },
      images: [
        { id: "img-13", url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop", isPrimary: true, order: 1 },
        { id: "img-14", url: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop", isPrimary: false, order: 2 },
      ],
      description: "Lightweight summer lawn with embroidered schiffli neckline and lace trims.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "prod-8",
      name: "Moroccan Embroidered Silk Kaftan Cape",
      slug: "moroccan-silk-kaftan",
      sku: "BUY-KFT-008",
      mrp: 7999,
      price: 5499,
      isNew: false,
      isBestSeller: true,
      isActive: true,
      categoryId: "cat-4",
      category: { id: "cat-4", name: "Islamic Dresses", slug: "islamic-dresses", isActive: true, order: 4 },
      images: [
        { id: "img-15", url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop", isPrimary: true, order: 1 },
        { id: "img-16", url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop", isPrimary: false, order: 2 },
      ],
      description: "Bespoke gold braid sfifa trims with regal floor-sweeping cape drapes.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-20 py-12 sm:py-16">
      {/* 1. Soft Glassmorphic Flash Offer Banner */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-charcoal text-white rounded-3xl p-6 sm:p-10 border border-gold/40 shadow-luxury-lg flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          {/* Subtle Glow Accents */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-gold/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-blush/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2.5 text-center md:text-left z-10">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="px-3 py-0.5 bg-rose-600 text-white font-bold text-[9px] uppercase tracking-widest rounded-full">
                LIMITED ATELIER DROP
              </span>
              <span className="text-gold text-xs uppercase tracking-widest font-semibold flex items-center gap-1">
                <Gift className="w-3.5 h-3.5 text-gold" />
                EID FESTIVE PRIVILEGE
              </span>
            </div>
            <h3 className="font-editorial-heading text-2xl sm:text-3xl font-normal text-cream-50">
              Complimentary 25% Off on Atelier Orders
            </h3>
            <p className="text-xs text-cream-200/80 font-light max-w-lg">
              Enter code <strong className="text-gold font-mono bg-white/10 px-2 py-0.5 rounded border border-gold/30">FESTIVE25</strong> at checkout. Includes bespoke custom sizing.
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
                <span className="font-mono text-base sm:text-lg font-bold text-gold">
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-[10px] tracking-[0.22em] uppercase text-charcoal/70 font-brand-badge font-bold rounded-full border border-stoneBorder">
            <Sparkles className="w-3 h-3 text-gold" />
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
        <div className="flex items-center justify-center gap-2 border-b border-stoneBorder/60 pb-4 mb-10 overflow-x-auto">
          {[
            { id: "trending", label: "Trending Now", icon: Sparkles },
            { id: "bestsellers", label: "Bestsellers", icon: Flame },
            { id: "eid", label: "Eid Special", icon: Zap },
            { id: "ready", label: "Ready to Ship", icon: Clock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-5 py-2 text-xs font-semibold uppercase tracking-widest rounded-full transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-charcoal text-white shadow-sm"
                    : "text-charcoal/70 hover:text-charcoal hover:bg-cream-100/70"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-gold" : "text-charcoal/40"}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {catalogProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center pt-14">
          <Link href="/shop">
            <button className="btn-aramya-gold group">
              <span>EXPLORE ALL 240+ SILHOUETTES</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
