"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, ShieldCheck, Scissors } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface HeroSlide {
  id: number;
  tag: string;
  badge: string;
  title: string;
  subtitle: string;
  ctaPrimary: { text: string; href: string };
  ctaSecondary: { text: string; href: string };
  image: string;
}

const slides: HeroSlide[] = [
  {
    id: 1,
    tag: "FESTIVE COUTURE 2026",
    badge: "READY TO SHIP",
    title: "The Royal Festive & Eid Collection",
    subtitle:
      "Exquisite hand-embroidered Korean Nida abayas, zardozi metallic threadwork, and bespoke velvet drapes crafted for celebrations.",
    ctaPrimary: { text: "EXPLORE COLLECTION", href: "/category/abayas" },
    ctaSecondary: { text: "SHOP NEW ARRIVALS", href: "/shop?sort=newest" },
    image:
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1920&auto=format&fit=crop",
  },
  {
    id: 2,
    tag: "PAKISTANI DESIGNER EDIT",
    badge: "CUSTOM TAILORING",
    title: "Pakistani Lawn & Anarkali Ensembles",
    subtitle:
      "Authentic festive suits with heavy resham embroidery, organza dupattas, and made-to-measure tailored silhouettes.",
    ctaPrimary: { text: "SHOP PAKISTANI SUITS", href: "/category/pakistani-churidars" },
    ctaSecondary: { text: "VIEW ANARKALIS", href: "/category/islamic-dresses" },
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1920&auto=format&fit=crop",
  },
  {
    id: 3,
    tag: "MEDINA SILK HERITAGE",
    badge: "BESTSELLER",
    title: "Luxury Medina Silk & Chiffon Shaylas",
    subtitle:
      "Featherlight, breathable, non-slip luxury hijabs in curated earthy neutrals and regal gem tones.",
    ctaPrimary: { text: "DISCOVER HIJABS", href: "/category/hijabs" },
    ctaSecondary: { text: "VIEW BOX SETS", href: "/category/hijabs?tag=box-set" },
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1920&auto=format&fit=crop",
  },
];

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section
      className="relative w-full h-[620px] sm:h-[720px] bg-charcoal overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      {slides.map((slide, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {/* Background Image with Cinematic Luxury Gradient */}
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={index === 0}
              className="object-cover object-center transform scale-105 transition-transform duration-[10000ms] ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/60 to-charcoal/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-black/20" />

            {/* Slide Content */}
            <div className="container mx-auto h-full px-6 sm:px-12 flex items-center relative z-20">
              <div className="max-w-2xl space-y-6 text-white animate-fadeIn">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/90 text-charcoal font-bold text-[10px] uppercase tracking-[0.25em]">
                    <Sparkles className="w-3 h-3" />
                    {slide.tag}
                  </span>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white font-semibold text-[10px] uppercase tracking-widest border border-white/30">
                    {slide.badge}
                  </span>
                </div>

                {/* Editorial Title */}
                <h1 className="font-editorial-heading text-3xl sm:text-5xl lg:text-6xl font-normal leading-[1.15] text-cream-50">
                  {slide.title}
                </h1>

                {/* Subtitle */}
                <p className="text-xs sm:text-sm text-cream-200/90 font-light leading-relaxed max-w-xl">
                  {slide.subtitle}
                </p>

                {/* Dual CTAs */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link href={slide.ctaPrimary.href}>
                    <Button variant="gold" size="lg" className="text-xs tracking-widest uppercase">
                      {slide.ctaPrimary.text}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link href={slide.ctaSecondary.href}>
                    <Button
                      variant="outline"
                      size="lg"
                      className="text-xs tracking-widest uppercase text-white border-white/60 hover:bg-white hover:text-charcoal"
                    >
                      {slide.ctaSecondary.text}
                    </Button>
                  </Link>
                </div>

                {/* Micro Guarantees */}
                <div className="flex items-center gap-6 pt-4 text-[11px] text-cream-300/80 font-light border-t border-white/10">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                    100% Authentic Fabric
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Scissors className="w-3.5 h-3.5 text-gold" />
                    Custom Made-to-Measure
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        aria-label="Previous Slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-charcoal/50 hover:bg-gold text-white flex items-center justify-center backdrop-blur-sm border border-white/20 transition-all hover:scale-110"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={handleNext}
        aria-label="Next Slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-charcoal/50 hover:bg-gold text-white flex items-center justify-center backdrop-blur-sm border border-white/20 transition-all hover:scale-110"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Slide Indicator Dots */}
      <div className="absolute bottom-6 inset-x-0 z-30 flex items-center justify-center space-x-2.5">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-1.5 transition-all duration-300 ${
              currentSlide === idx ? "w-8 bg-gold" : "w-2 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
