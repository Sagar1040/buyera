"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, ShieldCheck, Truck, ChevronDown, MessageSquare } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

export function AnnouncementBar() {
  const pathname = usePathname();
  const { settings } = useSettings();
  const [currency, setCurrency] = useState("INR (₹)");
  const [currencyOpen, setCurrencyOpen] = useState(false);

  if (pathname?.startsWith("/admin") || !settings.announcementActive) {
    return null;
  }

  const cleanWhatsapp = (settings.whatsappNumber || "+919876543210").replace(/[^0-9]/g, "");

  return (
    <div className="bg-charcoal text-cream-100 text-[11px] font-sans py-2 px-4 border-b border-aramyaBorder/10 z-50 transition-all duration-300">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left: Shipping & Fabric Promise */}
        <div className="hidden md:flex items-center space-x-5 tracking-wider text-cream-200/90">
          <span className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-terracotta-300" />
            Free Shipping on Orders &gt; ₹{settings.freeShippingThreshold}
          </span>
          <span className="text-white/20">•</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-olive-200" />
            100% Pure Certified Fabrics
          </span>
        </div>

        {/* Center: Dynamic Promotional Announcement Text */}
        <div className="flex-1 text-center font-medium tracking-widest uppercase text-[10px] sm:text-[11px]">
          <span className="inline-flex items-center gap-1.5 text-cream-50">
            <Sparkles className="w-3 h-3 text-gold animate-pulse" />
            <span>{settings.announcementText}</span>
          </span>
        </div>

        {/* Right: Concierge & Track Order */}
        <div className="hidden lg:flex items-center space-x-5 tracking-wider">
          <Link
            href="/account"
            className="text-cream-200/80 hover:text-white transition-colors text-[11px]"
          >
            Track Order
          </Link>
          <span className="text-white/20">•</span>
          <a
            href={`https://wa.me/${cleanWhatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="text-cream-200/80 hover:text-terracotta-300 transition-colors flex items-center gap-1"
          >
            <MessageSquare className="w-3 h-3" />
            Styling Help
          </a>
          <span className="text-white/20">•</span>
          <div className="relative">
            <button
              onClick={() => setCurrencyOpen(!currencyOpen)}
              className="flex items-center gap-1 text-cream-200 hover:text-white transition-colors uppercase font-medium"
            >
              <span>{currency}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {currencyOpen && (
              <div className="absolute right-0 mt-1.5 w-28 bg-white border border-aramyaBorder shadow-luxury py-1 text-charcoal z-50 animate-fadeIn rounded-xl">
                {["INR (₹)", "USD ($)", "AED (د.إ)", "GBP (£)", "EUR (€)"].map(
                  (cur) => (
                    <button
                      key={cur}
                      onClick={() => {
                        setCurrency(cur);
                        setCurrencyOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-[10px] uppercase font-semibold hover:bg-cream-100 hover:text-terracotta transition-colors"
                    >
                      {cur}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
