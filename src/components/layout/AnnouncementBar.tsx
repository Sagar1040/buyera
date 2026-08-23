"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Globe, PhoneCall, ChevronDown } from "lucide-react";

export function AnnouncementBar() {
  const [currency, setCurrency] = useState("INR (₹)");
  const [currencyOpen, setCurrencyOpen] = useState(false);

  return (
    <div className="bg-charcoal text-cream-100 text-[11px] font-sans py-2 px-4 border-b border-canvas-border/20 z-50">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left: Global Shipping & Help Hotline */}
        <div className="hidden md:flex items-center space-x-6 tracking-wider">
          <span className="flex items-center gap-1.5 text-cream-200">
            <Globe className="w-3.5 h-3.5 text-gold" />
            Express Worldwide Shipping to 50+ Countries
          </span>
          <span className="text-cream-400/40">|</span>
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-cream-200 hover:text-gold transition-colors"
          >
            <PhoneCall className="w-3 h-3 text-gold" />
            Styling Concierge & Custom Sizing
          </a>
        </div>

        {/* Center: Promotional Flash Code */}
        <div className="flex-1 text-center font-medium tracking-widest uppercase">
          <span className="inline-flex items-center gap-1.5 text-gold-light">
            <Sparkles className="w-3 h-3 text-gold animate-pulse" />
            <span>
              Extra 15% OFF on First Order • Use Code:{" "}
              <strong className="text-white bg-gold-dark/40 px-1.5 py-0.5 border border-gold/40 tracking-normal font-mono">
                BUYERA15
              </strong>
            </span>
          </span>
        </div>

        {/* Right: Currency / Country Selector & Track Order */}
        <div className="hidden lg:flex items-center space-x-5 tracking-wider">
          <Link
            href="/account"
            className="text-cream-300 hover:text-gold transition-colors text-[11px]"
          >
            Track Order
          </Link>
          <span className="text-cream-400/40">|</span>
          <div className="relative">
            <button
              onClick={() => setCurrencyOpen(!currencyOpen)}
              className="flex items-center gap-1 text-cream-200 hover:text-gold transition-colors uppercase font-medium"
            >
              <span>{currency}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {currencyOpen && (
              <div className="absolute right-0 mt-1.5 w-28 bg-white border border-canvas-border shadow-luxury py-1 text-charcoal z-50 animate-fadeIn">
                {["INR (₹)", "USD ($)", "AED (د.إ)", "GBP (£)", "EUR (€)"].map(
                  (cur) => (
                    <button
                      key={cur}
                      onClick={() => {
                        setCurrency(cur);
                        setCurrencyOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-[10px] uppercase font-semibold hover:bg-cream-100 hover:text-gold transition-colors"
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
