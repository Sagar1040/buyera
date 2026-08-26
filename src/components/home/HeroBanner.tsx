"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Scissors,
  Star,
  Award,
} from "lucide-react";

interface HeroSlide {
  id: string | number;
  tag: string;
  badge: string;
  title: string;
  subtitle: string;
  ctaPrimary: { text: string; href: string };
  ctaSecondary?: { text: string; href: string };
  image: string;
  highlightReview?: { author: string; text: string };
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: "default-1",
    tag: "HAUTE MODESTY ATELIER",
    badge: "FESTIVE COUTURE 2026",
    title: "Timeless Modesty. Artisanal Luxury.",
    subtitle:
      "Handcrafted Korean Nida abayas, intricate zardozi metallic threadwork, and bespoke velvet silhouettes created for the modern woman.",
    ctaPrimary: { text: "EXPLORE THE ATELIER", href: "/category/abayas" },
    ctaSecondary: { text: "NEW ARRIVALS", href: "/shop?sort=newest" },
    image:
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop",
    highlightReview: {
      author: "Farah M., Dubai",
      text: "The drape and zardozi detailing exceeded all expectations.",
    },
  },
  {
    id: "default-2",
    tag: "PAKISTANI DESIGNER EDIT",
    badge: "CUSTOM TAILORING",
    title: "Poetic Silhouettes & Resham Embroidery",
    subtitle:
      "Authentic festive Pakistani ensembles, pure lawn drapes, and handcrafted organza dupattas tailored to your precise measurements.",
    ctaPrimary: { text: "SHOP PAKISTANI SUITS", href: "/category/pakistani-churidars" },
    ctaSecondary: { text: "VIEW ANARKALIS", href: "/category/islamic-dresses" },
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop",
    highlightReview: {
      author: "Sana R., London",
      text: "Flawless made-to-measure stitching and fast delivery.",
    },
  },
  {
    id: "default-3",
    tag: "MEDINA SILK HERITAGE",
    badge: "SIGNATURE WEAVE",
    title: "Featherlight Silk & Chiffon Drapes",
    subtitle:
      "Signature non-slip, breathable Medina Silk shaylas in curated warm sand, desert rose, and regal gemstone palettes.",
    ctaPrimary: { text: "DISCOVER HIJABS", href: "/category/hijabs" },
    ctaSecondary: { text: "VIEW BOX SETS", href: "/category/hijabs?tag=box-set" },
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1200&auto=format&fit=crop",
    highlightReview: {
      author: "Zainab K., Bengaluru",
      text: "The softest Medina silk weave I have ever worn.",
    },
  },
];

export function HeroBanner() {
  const [slides, setSlides] = useState<HeroSlide[]>(DEFAULT_SLIDES);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const fetchLiveBanners = async () => {
      try {
        const res = await fetch("/api/admin/banners");
        const data = await res.json();
        if (data.success && Array.isArray(data.banners) && data.banners.length > 0) {
          const activeBanners = data.banners.filter((b: any) => b.isActive !== false);

          if (activeBanners.length > 0) {
            const mappedSlides: HeroSlide[] = activeBanners.map((b: any, idx: number) => ({
              id: b.id || `banner-${idx}`,
              tag: b.badge || "EXCLUSIVE ATELIER",
              badge: "HAUTE COUTURE",
              title: b.title,
              subtitle:
                b.subtitle ||
                "Exquisite handcrafted silhouettes tailored with artisanal mastery.",
              ctaPrimary: {
                text: b.ctaText || "EXPLORE COLLECTION",
                href: b.ctaUrl || b.ctaLink || "/shop",
              },
              ctaSecondary: {
                text: "DISCOVER NEW",
                href: "/shop?sort=newest",
              },
              image: b.imageUrl,
              highlightReview: DEFAULT_SLIDES[idx % DEFAULT_SLIDES.length].highlightReview,
            }));
            setSlides(mappedSlides);
          }
        }
      } catch (err) {
        console.warn("Using luxury default slides:", err);
      }
    };

    fetchLiveBanners();
  }, []);

  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const activeSlide = slides[currentSlide % (slides.length || 1)] || DEFAULT_SLIDES[0];

  return (
    <section
      className="relative w-full overflow-hidden bg-cream py-10 sm:py-16 lg:py-20 border-b border-stoneBorder/60 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 1. Subtle Luxury Background Gradient Blobs & Geometric Accents */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-gradient-to-br from-blush/80 via-cream-200/50 to-transparent rounded-full blur-3xl pointer-events-none -translate-y-1/3 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-gradient-to-tr from-sage/70 via-cream-100/40 to-transparent rounded-full blur-3xl pointer-events-none translate-y-1/4 -translate-x-1/4" />

      {/* Decorative Vector Arch Silhouette Watermark */}
      <svg
        className="absolute top-1/2 right-10 -translate-y-1/2 w-96 h-96 text-stoneBorder/30 pointer-events-none hidden xl:block"
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <path d="M 30,190 V 90 A 70,70 0 0,1 170,90 V 190" />
        <path d="M 50,190 V 95 A 50,50 0 0,1 150,95 V 190" strokeDasharray="3 3" />
        <circle cx="100" cy="90" r="15" />
      </svg>

      <div className="container mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Magazine Editorial Content */}
          <div className="lg:col-span-7 space-y-6 text-charcoal">
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white/80 backdrop-blur-md text-charcoal text-[10px] uppercase font-bold tracking-[0.2em] rounded-full border border-stoneBorder shadow-soft">
                <Sparkles className="w-3 h-3 text-gold" />
                {activeSlide.tag}
              </span>
              <span className="px-3 py-1 bg-gold/15 text-gold-dark text-[10px] font-semibold uppercase tracking-widest rounded-full border border-gold/30">
                {activeSlide.badge}
              </span>
            </div>

            {/* Editorial Title */}
            <h1 className="font-editorial-heading text-3xl sm:text-5xl lg:text-6xl text-charcoal font-normal leading-[1.12] tracking-tight">
              {activeSlide.title}
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-charcoal/70 font-light leading-relaxed max-w-xl">
              {activeSlide.subtitle}
            </p>

            {/* Dual Pill Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href={activeSlide.ctaPrimary.href}>
                <button className="btn-aramya-primary group">
                  <span>{activeSlide.ctaPrimary.text}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </Link>
              {activeSlide.ctaSecondary && (
                <Link href={activeSlide.ctaSecondary.href}>
                  <button className="btn-aramya-outline">
                    {activeSlide.ctaSecondary.text}
                  </button>
                </Link>
              )}
            </div>

            {/* Trust Metrics & Guarantees */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-stoneBorder/70 text-[11px] text-charcoal/70">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center border border-stoneBorder text-gold shadow-xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span>Grade-A Korean Nida</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center border border-stoneBorder text-gold shadow-xs">
                  <Scissors className="w-4 h-4" />
                </div>
                <span>Custom Made-to-Measure</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center border border-stoneBorder text-gold shadow-xs">
                  <Award className="w-4 h-4" />
                </div>
                <span>50,000+ Dressed</span>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Arched Portrait Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm lg:max-w-none">
              {/* Arched Photo Frame */}
              <div className="relative aspect-[3/4] w-full rounded-t-[10rem] rounded-b-3xl overflow-hidden bg-cream-200 border-2 border-stoneBorder shadow-luxury-lg">
                <img
                  key={activeSlide.id}
                  src={activeSlide.image}
                  alt={activeSlide.title}
                  className="w-full h-full object-cover object-top transition-all duration-1000 ease-out hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-transparent" />
              </div>

              {/* Floating Aesthetic Top Badge */}
              <div className="absolute -top-3 -left-3 sm:-left-6 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-stoneBorder shadow-soft flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-charcoal font-semibold animate-float">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Bespoke 2026 Collection</span>
              </div>

              {/* Floating Aesthetic Review Card */}
              {activeSlide.highlightReview && (
                <div className="absolute -bottom-5 -right-3 sm:-right-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-stoneBorder shadow-luxury max-w-[220px] sm:max-w-[240px] space-y-1 animate-fadeIn">
                  <div className="flex items-center gap-1 text-gold">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <p className="text-[10px] text-charcoal/80 font-light italic leading-snug">
                    "{activeSlide.highlightReview.text}"
                  </p>
                  <p className="text-[9px] uppercase tracking-wider text-charcoal/50 font-bold">
                    — {activeSlide.highlightReview.author}
                  </p>
                </div>
              )}
            </div>

            {/* Slider Navigation Arrows & Indicators */}
            {slides.length > 1 && (
              <div className="flex items-center justify-between mt-8 pt-2">
                {/* Indicators */}
                <div className="flex items-center gap-2">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        currentSlide === idx
                          ? "w-8 bg-charcoal"
                          : "w-2 bg-stoneBorder hover:bg-charcoal/40"
                      }`}
                    />
                  ))}
                </div>

                {/* Left/Right Pill Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    aria-label="Previous Slide"
                    className="w-8 h-8 rounded-full bg-white border border-stoneBorder text-charcoal hover:bg-charcoal hover:text-white flex items-center justify-center transition-all shadow-xs"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    aria-label="Next Slide"
                    className="w-8 h-8 rounded-full bg-white border border-stoneBorder text-charcoal hover:bg-charcoal hover:text-white flex items-center justify-center transition-all shadow-xs"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
