import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="bg-charcoal text-cream text-[11px] py-2 px-4 border-b border-gold/20">
      <div className="container mx-auto flex items-center justify-center text-center gap-2 tracking-widest font-sans uppercase">
        <Sparkles className="w-3 h-3 text-gold animate-pulse hidden sm:inline-block" />
        <span>
          Complimentary Express Shipping Across India on Orders Above ₹999
        </span>
        <span className="text-gold hidden md:inline-block">•</span>
        <Link
          href="/shop"
          className="text-gold hover:text-white underline underline-offset-4 transition-colors font-medium hidden md:inline-block"
        >
          EXPLORE NEW ARRIVALS
        </Link>
      </div>
    </div>
  );
}
