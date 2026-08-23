"use client";

import React from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function WishlistPage() {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-16">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-cream-100 border border-gold/30 text-gold flex items-center justify-center mx-auto shadow-sm">
          <Heart className="w-8 h-8" />
        </div>
        <span className="text-[10px] tracking-[0.25em] uppercase text-gold font-brand-badge font-semibold">
          SAVED SILHOUETTES
        </span>
        <h1 className="font-editorial-heading text-3xl sm:text-4xl text-charcoal">
          Your Wishlist Is Empty
        </h1>
        <p className="text-xs sm:text-sm text-charcoal/60 font-light leading-relaxed max-w-md mx-auto">
          Save your favorite couture pieces, bespoke abayas, and silk shaylas by clicking the heart icon on any product.
        </p>
        <div className="pt-2">
          <Link href="/shop">
            <Button variant="gold" size="lg">
              DISCOVER LATEST ARRIVALS
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
