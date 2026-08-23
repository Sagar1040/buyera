"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  imageUrl: string;
  ctaText: string;
  ctaUrl: string;
}

const DEFAULT_SLIDES: BannerSlide[] = [
  {
    id: "1",
    badge: "FESTIVE COUTURE 2026",
    title: "Timeless Elegance In Pure Silk & Chiffon",
    subtitle:
      "Handcrafted luxury abayas, embellished Pakistani silhouettes, and breathable artisanal hijabs.",
    imageUrl:
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1800&auto=format&fit=crop",
    ctaText: "EXPLORE COLLECTION",
    ctaUrl: "/shop",
  },
  {
    id: "2",
    badge: "NEW SEASON ARRIVALS",
    title: "The Royal Embellished Abaya Edit",
    subtitle:
      "Intricate pearl and gold thread embroidery engineered for weddings and auspicious occasions.",
    imageUrl:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1800&auto=format&fit=crop",
    ctaText: "DISCOVER ABAYAS",
    ctaUrl: "/category/abayas",
  },
];

export function HeroBanner({ banners = DEFAULT_SLIDES }: { banners?: BannerSlide[] }) {
  const slides = banners.length > 0 ? banners : DEFAULT_SLIDES;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative w-full h-[70vh] sm:h-[80vh] lg:h-[88vh] bg-charcoal overflow-hidden">
      {slides.map((slide, idx) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === current ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          {/* Background Image with Dark Vignette Overlay */}
          <div className="absolute inset-0">
            <Image
              src={slide.imageUrl}
              alt={slide.title}
              fill
              priority={idx === 0}
              className="object-cover object-center scale-105 transition-transform duration-10000 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />
          </div>

          {/* Hero Content Box */}
          <div className="relative z-20 container mx-auto h-full flex items-center px-4 lg:px-8">
            <div className="max-w-2xl text-white space-y-5 animate-fadeIn">
              {slide.badge && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/20 border border-gold/40 text-gold text-[10px] tracking-[0.25em] uppercase font-brand-badge">
                  {slide.badge}
                </div>
              )}
              <h1 className="font-editorial-heading text-3xl sm:text-5xl lg:text-6xl font-normal leading-[1.15] text-cream">
                {slide.title}
              </h1>
              <p className="text-xs sm:text-sm text-cream-200/80 font-light max-w-lg leading-relaxed">
                {slide.subtitle}
              </p>
              <div className="pt-2 flex items-center gap-4">
                <Link href={slide.ctaUrl}>
                  <Button variant="gold" size="lg">
                    {slide.ctaText}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                <Link href="/category/abayas">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-cream/40 text-cream hover:bg-cream hover:text-charcoal hover:border-cream hidden sm:inline-flex"
                  >
                    VIEW LOOKBOOK
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Slider Controls */}
      <div className="absolute bottom-8 right-8 z-30 flex items-center gap-3">
        <button
          onClick={() =>
            setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
          }
          className="w-10 h-10 border border-cream/20 bg-charcoal/40 backdrop-blur-sm text-cream hover:bg-gold hover:text-charcoal transition-all flex items-center justify-center"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
          className="w-10 h-10 border border-cream/20 bg-charcoal/40 backdrop-blur-sm text-cream hover:bg-gold hover:text-charcoal transition-all flex items-center justify-center"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-8 z-30 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1 transition-all duration-300 ${
              i === current ? "w-8 bg-gold" : "w-3 bg-cream/30 hover:bg-cream/60"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
