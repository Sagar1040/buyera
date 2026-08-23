import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

export function BrandStory() {
  return (
    <section className="py-24 bg-cream">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Collage */}
          <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] overflow-hidden bg-cream-200 border border-canvas-border shadow-luxury">
            <Image
              src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1200&auto=format&fit=crop"
              alt="BUYERA Editorial Craftsmanship"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-charcoal/10" />

            {/* Floating Luxury Quote Card */}
            <div className="absolute bottom-6 left-6 right-6 p-6 bg-charcoal/90 backdrop-blur-md text-white border border-gold/30">
              <p className="font-editorial-heading italic text-sm sm:text-base text-cream">
                “True modesty is not the absence of style, but the highest expression of graceful confidence.”
              </p>
              <p className="text-[10px] tracking-widest uppercase text-gold font-sans mt-2">
                — BUYERA ATELIER
              </p>
            </div>
          </div>

          {/* Editorial Story Text */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] tracking-[0.25em] uppercase text-gold-600 font-brand-badge font-semibold">
                THE ATELIER HERITAGE
              </span>
              <h2 className="font-editorial-heading text-3xl sm:text-4xl lg:text-5xl font-normal text-charcoal leading-tight">
                Reimagining Modesty With Uncompromised Luxury
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-charcoal/70 font-light leading-relaxed">
              Founded on the belief that modesty should never mean compromise, BUYERA bridges contemporary high fashion with traditional modesty. Each silhouette is thoughtfully tailored in premium Medina silk, Japanese nida, and breathable organza.
            </p>

            <p className="text-xs sm:text-sm text-charcoal/70 font-light leading-relaxed">
              From hand-embroidered pearl detailing to flowy, versatile layering pieces, we empower the modern woman to celebrate her faith and personal style with poise and distinction.
            </p>

            <div className="pt-4 flex items-center gap-4">
              <Link href="/about">
                <Button variant="primary" size="md">
                  READ OUR STORY
                </Button>
              </Link>
              <Link href="/shop">
                <Button variant="outline" size="md">
                  BROWSE ALL DESIGNS
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
