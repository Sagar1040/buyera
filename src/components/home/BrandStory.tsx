"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Globe,
  Scissors,
  ShieldCheck,
  CreditCard,
  Sparkles,
  ArrowRight,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export function BrandStory() {
  const trustPillars = [
    {
      icon: Globe,
      title: "Worldwide Express Delivery",
      desc: "Dispatched to 50+ countries via BlueDart, FedEx, and DHL with live tracking.",
    },
    {
      icon: Scissors,
      title: "Custom Made-to-Measure",
      desc: "Our master artisans provide bespoke tailoring, sleeve sizing, and length customizations.",
    },
    {
      icon: ShieldCheck,
      title: "100% Certified Fabrics",
      desc: "Authentic Korean Nida, pure breathable Medina Silks, and hand-embroidered resham threads.",
    },
    {
      icon: CreditCard,
      title: "Dual Payment Security",
      desc: "Pay securely via Razorpay (UPI / Cards / NetBanking) or choose Cash on Delivery.",
    },
  ];

  return (
    <section className="py-20 bg-cream border-y border-canvas-border overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 space-y-20">
        {/* 1. Trust & Service Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-canvas-border p-6 shadow-sm hover:shadow-luxury hover:border-gold/40 transition-all text-center sm:text-left space-y-3"
              >
                <div className="w-12 h-12 rounded-full bg-cream-100 border border-gold/30 text-gold-dark flex items-center justify-center mx-auto sm:mx-0 shadow-sm">
                  <Icon className="w-6 h-6" />
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

        {/* 2. Editorial Heritage Brand Story Feature */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Visual Showcase */}
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream-200 border border-canvas-border shadow-luxury">
            <Image
              src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop"
              alt="BUYERA Master Tailors"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-gold font-bold flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                Bespoke Artisanal Atelier
              </span>
              <p className="text-xs text-cream-200 font-light">
                Hand-embroidered zardozi and metallic resham stitching crafted by master tailors.
              </p>
            </div>
          </div>

          {/* Narrative Content */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] tracking-[0.25em] uppercase text-gold font-brand-badge font-semibold">
                OUR HAUTE COUTURE HERITAGE
              </span>
              <h2 className="font-editorial-heading text-3xl sm:text-4xl text-charcoal leading-tight">
                Where Modesty Meets Uncompromising Luxury
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-charcoal/70 font-light leading-relaxed">
              Founded in Bengaluru, <strong>BUYERA</strong> redefines ethnic and Islamic fashion with timeless dignity. Every abaya, hijab, and Pakistani ensemble is envisioned for the modern woman who honors modesty without sacrificing contemporary luxury.
            </p>

            <div className="grid grid-cols-2 gap-4 border-y border-canvas-border py-4 text-xs">
              <div>
                <p className="font-bold text-lg text-charcoal">50,000+</p>
                <p className="text-charcoal/60 text-[11px]">Modest Women Dressed Worldwide</p>
              </div>
              <div>
                <p className="font-bold text-lg text-charcoal">100%</p>
                <p className="text-charcoal/60 text-[11px]">Bespoke Craftsmanship & Quality</p>
              </div>
            </div>

            <div>
              <Link href="/shop">
                <Button variant="primary" size="md">
                  READ OUR STORY & CRAFT
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
