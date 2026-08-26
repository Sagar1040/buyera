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
  Layers,
  HeartHandshake,
} from "lucide-react";

export function BrandStory() {
  const trustPillars = [
    {
      icon: Globe,
      title: "Worldwide Express Delivery",
      desc: "Dispatched to 50+ countries via BlueDart, FedEx, and DHL with live tracked updates.",
    },
    {
      icon: Scissors,
      title: "Custom Made-to-Measure",
      desc: "Our master tailors provide bespoke length, bust, and sleeve sizing adjustments.",
    },
    {
      icon: ShieldCheck,
      title: "100% Certified Fabrics",
      desc: "Grade-A Korean Nida, pure breathable Medina Silks, and hand-embroidered resham threads.",
    },
    {
      icon: CreditCard,
      title: "Dual Payment Security",
      desc: "Pay securely via Razorpay (UPI / Cards / NetBanking) or choose Cash on Delivery.",
    },
  ];

  return (
    <section className="py-20 bg-cream border-y border-stoneBorder/60 overflow-hidden relative">
      {/* Subtle Aesthetic Background Gradient Blobs */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-sage/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-96 h-96 bg-blush/60 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-20 relative z-10">
        {/* 1. Trust & Service Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-white/80 backdrop-blur-sm border border-stoneBorder/80 p-6 sm:p-7 rounded-3xl shadow-card hover:shadow-luxury-lg hover:border-gold/50 transition-all duration-300 text-center sm:text-left space-y-3.5"
              >
                <div className="w-12 h-12 rounded-full bg-cream-100 border border-stoneBorder text-gold-dark flex items-center justify-center mx-auto sm:mx-0 shadow-xs">
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

        {/* 2. Editorial "The Craft & Fabric" Visual Storytelling Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Visual Showcase: Arched Collage */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden bg-cream-200 border border-stoneBorder shadow-luxury-lg">
              <Image
                src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop"
                alt="BUYERA Master Artisans at work"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
              
              {/* Bottom Overlay Info */}
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1.5">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-gold/90 text-charcoal text-[9px] uppercase font-bold tracking-widest rounded-full">
                  <Award className="w-3 h-3" />
                  Bespoke Artisanal Atelier
                </span>
                <p className="text-xs text-cream-100 font-light leading-relaxed">
                  Hand-embroidered zardozi and metallic resham stitching perfected by multi-generational artisans.
                </p>
              </div>
            </div>

            {/* Floating Top Mini Pill */}
            <div className="absolute -top-4 -right-2 sm:-right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full border border-stoneBorder shadow-soft flex items-center gap-2 text-xs font-semibold text-charcoal">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>Certified Grade-A Korean Nida</span>
            </div>
          </div>

          {/* Narrative Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-[10px] tracking-[0.22em] uppercase text-charcoal/70 font-brand-badge font-bold rounded-full border border-stoneBorder">
                <Layers className="w-3 h-3 text-gold" />
                THE CRAFT & FABRIC
              </span>
              <h2 className="font-editorial-heading text-3xl sm:text-4xl text-charcoal leading-tight font-normal">
                Where Modesty Meets Uncompromising Luxury
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-charcoal/70 font-light leading-relaxed">
              Founded in Bengaluru, <strong>BUYERA</strong> reimagines ethnic and Islamic fashion with timeless dignity. Every abaya, hijab, and Pakistani ensemble is envisioned for the discerning woman who honors modesty without compromising on contemporary haute couture elegance.
            </p>

            {/* Key Atelier Metrics */}
            <div className="grid grid-cols-2 gap-4 border-y border-stoneBorder/70 py-5 text-xs">
              <div>
                <p className="font-bold text-xl text-charcoal tracking-tight">50,000+</p>
                <p className="text-charcoal/60 text-[11px] font-light">Modest Women Dressed Worldwide</p>
              </div>
              <div>
                <p className="font-bold text-xl text-charcoal tracking-tight">100%</p>
                <p className="text-charcoal/60 text-[11px] font-light">Certified Pure Fabric & Tailoring</p>
              </div>
            </div>

            <div className="pt-1">
              <Link href="/shop">
                <button className="btn-aramya-primary group">
                  <span>DISCOVER OUR CRAFT & SILHOUETTES</span>
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
