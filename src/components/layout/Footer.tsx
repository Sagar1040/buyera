"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Instagram,
  Facebook,
  Twitter,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Banknote,
  ShieldCheck,
  Globe,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useSettings } from "@/context/SettingsContext";

export function Footer() {
  const pathname = usePathname();
  const { settings } = useSettings();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const cleanWhatsapp = (settings.whatsappNumber || "+919876543210").replace(/[^0-9]/g, "");

  return (
    <footer className="bg-charcoal text-cream-200 border-t border-aramyaBorder/10 pt-16 pb-12">
      <div className="container mx-auto px-4 lg:px-8 space-y-12">
        {/* Top Section: Brand Info & 4 Category Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Intro */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block bg-white/95 p-2 rounded-xl border border-white/20 shadow-sm">
              <Logo size="md" showTagline={true} />
            </Link>

            <p className="text-xs text-cream-300/80 font-light leading-relaxed max-w-sm">
              {settings.footerBio ||
                "BUYERA is dedicated to bringing you the finest modest and ethnic fashion crafted with certified pure fabrics and bespoke tailoring."}
            </p>

            <div className="space-y-1.5 text-xs text-cream-300/70 pt-2 font-light">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-terracotta-300 shrink-0" />
                Bengaluru Atelier, Karnataka, India - 560034
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-terracotta-300 shrink-0" />
                {settings.supportEmail || "support@buyera.in"}
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-terracotta-300 shrink-0" />
                {settings.supportPhone || "+91 98765 43210"}
              </p>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-cream-50 border-b border-white/10 pb-2">
              Collections
            </h4>
            <ul className="space-y-2 text-xs text-cream-300/80 font-light">
              <li><Link href="/category/abayas" className="hover:text-terracotta-300 transition-colors">Dubai Abayas</Link></li>
              <li><Link href="/category/hijabs" className="hover:text-terracotta-300 transition-colors">Medina Silk Hijabs</Link></li>
              <li><Link href="/category/pakistani-churidars" className="hover:text-terracotta-300 transition-colors">Pakistani Lawn Suits</Link></li>
              <li><Link href="/category/islamic-dresses" className="hover:text-terracotta-300 transition-colors">Anarkali & Gowns</Link></li>
              <li><Link href="/shop?tag=kaftan" className="hover:text-terracotta-300 transition-colors">Royal Kaftans</Link></li>
              <li><Link href="/shop?sort=newest" className="hover:text-terracotta-300 transition-colors">New Arrivals</Link></li>
            </ul>
          </div>

          {/* Customer Concierge */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-cream-50 border-b border-white/10 pb-2">
              Customer Concierge
            </h4>
            <ul className="space-y-2 text-xs text-cream-300/80 font-light">
              <li><Link href="/account" className="hover:text-terracotta-300 transition-colors">Track Your Order</Link></li>
              <li><Link href="/account" className="hover:text-terracotta-300 transition-colors">Custom Sizing Guide</Link></li>
              <li><Link href="/account" className="hover:text-terracotta-300 transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/wishlist" className="hover:text-terracotta-300 transition-colors">Saved Silhouettes</Link></li>
              <li><Link href="/cart" className="hover:text-terracotta-300 transition-colors">Shopping Bag</Link></li>
            </ul>
          </div>

          {/* Social & Verification */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-cream-50 border-b border-white/10 pb-2">
              Follow Our Atelier
            </h4>
            <p className="text-xs text-cream-300/70 font-light">
              Join 120k+ followers for styling reels and festive previews.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-terracotta hover:text-white transition-all"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-terracotta hover:text-white transition-all"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              <a
                href={`https://wa.me/${cleanWhatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-olive-600 hover:text-white transition-all"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Accepted Payment Methods & Trust Banner */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-cream-300/70">
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <span className="flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-gold" />
              Razorpay Secure Checkout
            </span>
            <span className="text-white/20">•</span>
            <span className="flex items-center gap-1.5">
              <Banknote className="w-4 h-4 text-gold" />
              Cash on Delivery (COD)
            </span>
            <span className="text-white/20">•</span>
            <span className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-gold" />
              Shiprocket Logistics
            </span>
          </div>

          <p className="text-[11px] text-cream-400/60 text-center md:text-right font-light">
            © {new Date().getFullYear()} BUYERA India Inc. All Rights Reserved. Elegance • Modesty • You.
          </p>
        </div>
      </div>
    </footer>
  );
}
