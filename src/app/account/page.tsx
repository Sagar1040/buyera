"use client";

import React from "react";
import Link from "next/link";
import { User, Package, MapPin, LogOut, ChevronRight, Truck } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function AccountPage() {
  const orders = [
    {
      id: "BUYERA-20260823-9K2L1",
      date: "Aug 23, 2026",
      total: 4999,
      status: "Processing",
      items: "Royal Emerald Hand-Embroidered Abaya (56)",
      awb: "SR109283746",
    },
  ];

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Account Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-canvas-border pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-cream-100 border border-gold/40 text-gold flex items-center justify-center font-bold text-lg">
              AK
            </div>
            <div>
              <span className="text-[10px] font-brand-badge tracking-[0.25em] uppercase text-gold font-semibold">
                PRIVÉ MEMBER
              </span>
              <h1 className="font-editorial-heading text-2xl text-charcoal">
                Aisha Khan
              </h1>
              <p className="text-xs text-charcoal/50">aisha.khan@example.com</p>
            </div>
          </div>

          <button
            onClick={() => alert("Logged out")}
            className="inline-flex items-center gap-1.5 text-xs text-charcoal/60 hover:text-rose-500 transition-colors self-start sm:self-auto"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>

        {/* Account Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Order History */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="font-editorial-heading text-xl text-charcoal border-b border-canvas-border pb-3">
              Order History & Tracking
            </h2>

            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-canvas-border p-6 shadow-sm space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-canvas-border pb-3">
                  <div>
                    <span className="text-xs font-mono font-medium text-charcoal">
                      {order.id}
                    </span>
                    <p className="text-[11px] text-charcoal/50">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-charcoal">
                      {formatPrice(order.total)}
                    </span>
                    <span className="block text-[10px] uppercase tracking-wider text-emerald-600 font-semibold">
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-charcoal/80">{order.items}</span>
                </div>

                {order.awb && (
                  <div className="p-3 bg-cream-50 border border-canvas-border flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-charcoal/80">
                      <Truck className="w-4 h-4 text-gold" />
                      <span>Shiprocket AWB: <strong className="font-mono">{order.awb}</strong></span>
                    </div>
                    <span className="text-gold-dark font-medium underline">
                      Live Courier Tracking
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Saved Addresses & Quick Links */}
          <div className="space-y-6">
            <div className="bg-white border border-canvas-border p-6 shadow-sm space-y-3">
              <h3 className="font-editorial-heading text-base text-charcoal border-b border-canvas-border pb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold" />
                Default Address
              </h3>
              <div className="text-xs text-charcoal/80 leading-relaxed font-light">
                <strong className="font-medium text-charcoal">Aisha Khan</strong>
                <p>Flat 402, Royal Palms Residency</p>
                <p>80 Feet Road, 4th Block, Koramangala</p>
                <p>Bengaluru, Karnataka - 560034</p>
                <p className="pt-1 text-charcoal/60">Phone: +91 9811223344</p>
              </div>
            </div>

            <div className="bg-charcoal text-cream p-6 border border-gold/30 space-y-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-gold font-brand-badge">
                CONCIERGE CARE
              </span>
              <h4 className="font-editorial-heading text-sm text-cream">
                Bespoke Sizing & Styling
              </h4>
              <p className="text-xs text-cream-300/70 font-light leading-relaxed">
                Need tailored alterations or bridal modest consultation?
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1 text-xs text-gold hover:underline pt-2 font-medium"
              >
                Contact Stylist <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
