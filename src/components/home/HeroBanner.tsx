"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Scissors,
  Award,
  PlusCircle,
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
}

interface HeroBannerProps {
  banners?: any[];
}

export function HeroBanner({ banners = [] }: HeroBannerProps) {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Map incoming banners to HeroSlide format
  useEffect(() => {
    if (banners && banners.length > 0) {
      const activeBanners = banners.filter((b: any) => b.isActive !== false);
      const mapped: HeroSlide[] = activeBanners.map((b: any, idx: number) => ({
        id: b.id || `banner-${idx}`,
        tag: "✦ Handcrafted Everyday Elegance",
        badge: b.badge || "HAUTE COUTURE",
        title: b.title,
        subtitle:
          b.subtitle ||
          "Explore certified pure fabrics, contemporary drapes, and artisanal tailoring.",
        ctaPrimary: {
          text: b.ctaText || "Shop Collection",
          href: b.ctaUrl || b.ctaLink || "/shop",
        },
        ctaSecondary: {
          text: "Explore All Silhouettes",
          href: "/shop",
        },
        image: b.imageUrl || b.image || "",
      }));
      setSlides(mapped);
    } else {
      // Fetch live banners if not passed from server
      fetch("/api/admin/banners")
        .then((res) => res.json())
        .then((data) => {
          if (data?.success && Array.isArray(data.banners) && data.banners.length > 0) {
            const mapped: HeroSlide[] = data.banners
              .filter((b: any) => b.isActive !== false)
              .map((b: any, idx: number) => ({
                id: b.id || `banner-${idx}`,
                tag: "✦ Handcrafted Everyday Elegance",
                badge: b.badge || "HAUTE COUTURE",
                title: b.title,
                subtitle:
                  b.subtitle ||
                  "Explore certified pure fabrics, contemporary drapes, and artisanal tailoring.",
                ctaPrimary: {
                  text: b.ctaText || "Shop Collection",
                  href: b.ctaUrl || b.ctaLink || "/shop",
                },
                ctaSecondary: {
                  text: "Explore All Silhouettes",
                  href: "/shop",
                },
                image: b.imageUrl || b.image || "",
              }));
            setSlides(mapped);
          } else {
            setSlides([]);
          }
        })
        .catch(() => setSlides([]));
    }
  }, [banners]);

  // Auto-advance carousel
  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [slides.length, isPaused]);

  // 1. Empty State (No Banners yet in Database)
  if (slides.length === 0) {
    return (
      <section className="relative bg-cream-100/60 border-b border-aramyaBorder py-20 sm:py-28 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-2xl space-y-6">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white text-[11px] tracking-[0.25em] uppercase text-terracotta font-brand-badge font-bold rounded-full border border-aramyaBorder shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-terracotta" />
            BUYERA ATELIER 2026
          </span>

          <h1 className="font-editorial-heading text-3xl sm:text-5xl lg:text-6xl text-charcoal font-normal leading-tight">
            Timeless Modesty. <br />
            <span className="italic font-serif text-terracotta">Artisanal Luxury.</span>
          </h1>

          <p className="text-sm sm:text-base text-charcoal/70 font-light max-w-lg mx-auto leading-relaxed">
            Welcome to BUYERA. Discover bespoke abayas, breathable Medina silk shaylas, and festive designer ensembles.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/shop">
              <button className="btn-aramya-terracotta group">
                <span>EXPLORE THE SHOP</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </Link>

            <Link href="/admin/banners">
              <button className="btn-aramya-outline flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-terracotta" />
                <span>ADD HERO BANNER (ADMIN)</span>
              </button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // 2. Active Carousel with Dynamic Banners
  const slide = slides[currentSlide] || slides[0];

  return (
    <section
      className="relative bg-cream min-h-[520px] sm:min-h-[600px] lg:min-h-[660px] flex items-center border-b border-aramyaBorder overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Soft Glow */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-terracotta/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-olive/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          {/* Left Column: Editorial Copy */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-7 text-center lg:text-left">
            <div className="space-y-2.5">
              {slide.badge && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white text-[10px] sm:text-xs tracking-[0.2em] uppercase text-terracotta font-brand-badge font-bold rounded-full border border-aramyaBorder shadow-xs">
                  <Sparkles className="w-3 h-3 text-terracotta" />
                  <span>{slide.badge}</span>
                </div>
              )}

              <h1 className="font-editorial-heading text-3xl sm:text-5xl lg:text-6xl text-charcoal font-normal leading-[1.15] tracking-tight">
                {slide.title}
              </h1>
            </div>

            {slide.subtitle && (
              <p className="text-xs sm:text-sm lg:text-base text-charcoal/70 font-light max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {slide.subtitle}
              </p>
            )}

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-1">
              <Link href={slide.ctaPrimary.href}>
                <button className="btn-aramya-terracotta group">
                  <span>{slide.ctaPrimary.text}</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </Link>

              {slide.ctaSecondary && (
                <Link href={slide.ctaSecondary.href}>
                  <button className="btn-aramya-outline">
                    <span>{slide.ctaSecondary.text}</span>
                  </button>
                </Link>
              )}
            </div>

            {/* Trust Badges */}
            <div className="pt-5 sm:pt-6 border-t border-aramyaBorder grid grid-cols-3 gap-3 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-terracotta shrink-0" />
                <span className="text-[10px] sm:text-xs text-charcoal/80 font-medium">
                  100% Pure Fabrics
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Scissors className="w-4 h-4 text-olive shrink-0" />
                <span className="text-[10px] sm:text-xs text-charcoal/80 font-medium">
                  Custom Tailoring
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-terracotta shrink-0" />
                <span className="text-[10px] sm:text-xs text-charcoal/80 font-medium">
                  Artisanal Finish
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Banner Image Artwork */}
          <div className="lg:col-span-5 relative flex items-center justify-center bg-transparent border-none shadow-none">
            {slide.image ? (
              <div className="relative w-full max-w-[480px] flex items-center justify-center bg-transparent border-none shadow-none group">
                <img
                  src={slide.image}
                  alt={slide.title}
                  loading="eager"
                  className="w-full h-auto max-h-[550px] object-contain drop-shadow-none transition-transform duration-700 ease-out group-hover:scale-105"
                  onError={(e) => {
                    console.warn("Banner image failed to load:", slide.image);
                  }}
                />
              </div>
            ) : (
              <div className="w-full max-w-[440px] h-[360px] sm:h-[450px] bg-transparent border border-dashed border-aramyaBorder/60 flex items-center justify-center p-8 text-center text-charcoal/40 text-xs">
                <span>No banner artwork uploaded</span>
              </div>
            )}
          </div>
        </div>

        {/* Carousel Navigation Controls */}
        {slides.length > 1 && (
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-aramyaBorder/60">
            <div className="flex items-center gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 transition-all duration-300 rounded-full ${
                    idx === currentSlide
                      ? "w-8 bg-terracotta"
                      : "w-2 bg-charcoal/20 hover:bg-charcoal/40"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
                }
                className="p-2 bg-white border border-aramyaBorder rounded-full hover:bg-terracotta hover:text-white transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setCurrentSlide((prev) => (prev + 1) % slides.length)
                }
                className="p-2 bg-white border border-aramyaBorder rounded-full hover:bg-terracotta hover:text-white transition-colors"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
