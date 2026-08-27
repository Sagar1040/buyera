"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Scissors,
  Truck,
  CreditCard,
  Sparkles,
  ArrowRight,
  Award,
  Leaf,
  Layers,
} from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

const DEFAULT_STORY_IMAGE =
  "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop";

export function BrandStory() {
  const { settings } = useSettings();
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  const storyBadge = settings?.storyBadge || "THE BUYERA PHILOSOPHY";
  const storyTitle =
    settings?.storyTitle || "Modest Luxury Envisioned for Every Day";
  const storyDescription =
    settings?.storyDescription ||
    "Handcrafted premium modest fashion designed for everyday elegance.";

  // Determine active image URL with resilient fallback
  const rawImageUrl = settings?.storyImageUrl?.trim();
  const effectiveImageUrl =
    rawImageUrl && rawImageUrl !== "/story-image.jpg"
      ? rawImageUrl
      : DEFAULT_STORY_IMAGE;

  const currentImage = imgSrc || effectiveImageUrl;

  const storyStat1Number = settings?.storyStat1Number || "10,000+";
  const storyStat1Label = settings?.storyStat1Label || "Happy Customers";
  const storyStat2Number = settings?.storyStat2Number || "100%";
  const storyStat2Label =
    settings?.storyStat2Label || "Pure Breathable Fabrics";

  const trustPillars = [
    {
      icon: Leaf,
      iconColor: "text-olive-600 bg-olive-50 border-olive-100",
      title: "Pure Breathable Fabrics",
      desc: "Certified Grade-A Korean Nida, pure Medina Silks, and lightweight summer lawns.",
    },
    {
      icon: Scissors,
      iconColor: "text-terracotta bg-terracotta-50 border-terracotta-100",
      title: "Inclusive Sizing & Custom Fit",
      desc: "Our master artisans provide bespoke length, bust, and sleeve tailoring to perfection.",
    },
    {
      icon: Truck,
      iconColor: "text-charcoal bg-cream-100 border-aramyaBorder",
      title: "Express Pan-India Delivery",
      desc: "Dispatched swiftly across India with real-time tracking via BlueDart & FedEx.",
    },
    {
      icon: CreditCard,
      iconColor: "text-terracotta bg-terracotta-50 border-terracotta-100",
      title: "Secure Razorpay & COD",
      desc: "Pay securely via UPI, Cards, NetBanking or choose Cash on Delivery at your doorstep.",
    },
  ];

  return (
    <section className="py-20 bg-cream border-y border-aramyaBorder overflow-hidden relative">
      {/* Background Soft Blobs */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-terracotta-50/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-96 h-96 bg-olive-50/60 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-20 relative z-10">
        {/* 1. 4-Column Modern Icon Grid (Aramya Brand Values) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-aramyaBorder p-6 sm:p-7 rounded-3xl shadow-card hover:shadow-luxury-lg hover:border-terracotta/40 transition-all duration-300 text-center sm:text-left space-y-3.5"
              >
                <div
                  className={`w-12 h-12 rounded-2xl border flex items-center justify-center mx-auto sm:mx-0 shadow-xs ${pillar.iconColor}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-charcoal">
                  {pillar.title}
                </h3>
                <p className="text-xs text-charcoal/65 font-light leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* 2. Visual Storytelling Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Visual Showcase: Transparent Seamless Display */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden bg-transparent border-0 shadow-none flex items-center justify-center">
              <Image
                src={currentImage}
                alt={storyTitle}
                fill
                className="object-contain drop-shadow-none transition-transform duration-700 hover:scale-105"
                onError={() => setImgSrc(DEFAULT_STORY_IMAGE)}
              />
            </div>

            {/* Floating Top Badge */}
            <div className="absolute -top-4 -right-2 sm:-right-4 bg-white px-4 py-2 rounded-full border border-aramyaBorder shadow-soft flex items-center gap-2 text-xs font-semibold text-charcoal">
              <Sparkles className="w-3.5 h-3.5 text-terracotta" />
              <span>Certified Grade-A Korean Nida</span>
            </div>
          </div>

          {/* Narrative Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2.5">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white text-[10px] tracking-[0.22em] uppercase text-terracotta font-brand-badge font-bold rounded-full border border-aramyaBorder shadow-xs">
                <Layers className="w-3 h-3 text-terracotta" />
                {storyBadge}
              </span>
              <h2 className="font-editorial-heading text-3xl sm:text-4xl text-charcoal leading-tight font-normal">
                {storyTitle}
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-charcoal/70 font-light leading-relaxed whitespace-pre-line">
              {storyDescription}
            </p>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4 border-y border-aramyaBorder py-5 text-xs">
              <div>
                <p className="font-bold text-xl text-charcoal tracking-tight">
                  {storyStat1Number}
                </p>
                <p className="text-charcoal/60 text-[11px] font-light">
                  {storyStat1Label}
                </p>
              </div>
              <div>
                <p className="font-bold text-xl text-charcoal tracking-tight">
                  {storyStat2Number}
                </p>
                <p className="text-charcoal/60 text-[11px] font-light">
                  {storyStat2Label}
                </p>
              </div>
            </div>

            <div className="pt-1">
              <Link href="/shop">
                <button className="btn-aramya-terracotta group">
                  <span>DISCOVER OUR SILHOUETTES</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

