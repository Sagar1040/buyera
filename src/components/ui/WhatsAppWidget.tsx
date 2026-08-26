"use client";

import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

export function WhatsAppWidget() {
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);

  const cleanNumber = (settings.whatsappNumber || "+919876543210").replace(/[^0-9]/g, "");

  const handleOpenWhatsApp = () => {
    const message = encodeURIComponent(
      `Hello ${settings.siteTitle} Atelier, I would like styling assistance and bespoke sizing help.`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, "_blank");
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {isOpen && (
        <div className="mb-3 bg-white border border-aramyaBorder rounded-2xl p-4 shadow-luxury max-w-xs space-y-2.5 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-aramyaBorder pb-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-charcoal">{settings.siteTitle} VIP Concierge</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-charcoal/40 hover:text-charcoal p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-charcoal/70 font-light leading-relaxed">
            Need help choosing your silhouette, fabric draping advice, or custom bridal sizing? Chat directly with our master stylists.
          </p>
          <button
            onClick={handleOpenWhatsApp}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-1.5"
          >
            <MessageCircle className="w-4 h-4" />
            Start WhatsApp Chat
          </button>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="WhatsApp Support"
        className="w-12 h-12 rounded-full bg-emerald-600 text-white shadow-luxury flex items-center justify-center hover:bg-emerald-700 transition-all hover:scale-105 active:scale-95 group"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  );
}
