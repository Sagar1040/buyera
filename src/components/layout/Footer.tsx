import React from "react";
import Link from "next/link";
import { ShieldCheck, Truck, RotateCcw, Lock } from "lucide-react";

export function Footer() {
  const trustFeatures = [
    {
      icon: Truck,
      title: "Complimentary Delivery",
      desc: "Free standard shipping across India above ₹999",
    },
    {
      icon: ShieldCheck,
      title: "100% Authentic Luxury",
      desc: "Handpicked premium fabrics and artisanal stitching",
    },
    {
      icon: RotateCcw,
      title: "Hassle-Free Returns",
      desc: "7-day seamless doorstep exchange & return policy",
    },
    {
      icon: Lock,
      title: "Secure Payments",
      desc: "Encrypted 256-bit Razorpay & UPI transactions",
    },
  ];

  return (
    <footer className="bg-charcoal text-cream-100 border-t border-gold/20 pt-16 pb-12">
      {/* Trust & Guarantee Grid */}
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-16 border-b border-charcoal-200">
          {trustFeatures.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="flex items-start space-x-4">
                <div className="p-3 bg-charcoal-200 text-gold border border-gold/20 rounded-none shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest font-semibold text-cream">
                    {f.title}
                  </h4>
                  <p className="text-xs text-cream-300/70 mt-1 font-light leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 py-16">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <span className="font-editorial-heading text-2xl font-bold tracking-[0.2em] text-white">
              BUYERA
            </span>
            <p className="text-xs text-cream-300/80 font-light max-w-sm leading-relaxed">
              Curating high-end modesty and sophisticated Islamic couture for the modern woman.
              Designed with bespoke craftsmanship and timeless modesty.
            </p>
            <div className="text-xs text-gold tracking-widest uppercase font-mono pt-2">
              Elegance. Modesty. You.
            </div>
          </div>

          {/* Collections */}
          <div className="space-y-3">
            <h5 className="text-xs uppercase tracking-widest font-semibold text-gold">
              Collections
            </h5>
            <ul className="space-y-2 text-xs font-light text-cream-300/80">
              <li>
                <Link href="/category/abayas" className="hover:text-gold transition-colors">
                  Signature Abayas
                </Link>
              </li>
              <li>
                <Link href="/category/hijabs" className="hover:text-gold transition-colors">
                  Premium Silk & Chiffon Hijabs
                </Link>
              </li>
              <li>
                <Link href="/category/pakistani-churidars" className="hover:text-gold transition-colors">
                  Pakistani Churidars & Suits
                </Link>
              </li>
              <li>
                <Link href="/category/islamic-dresses" className="hover:text-gold transition-colors">
                  Modest Maxi Dresses
                </Link>
              </li>
              <li>
                <Link href="/shop?tag=new" className="hover:text-gold transition-colors">
                  New Season Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Client Care */}
          <div className="space-y-3">
            <h5 className="text-xs uppercase tracking-widest font-semibold text-gold">
              Client Care
            </h5>
            <ul className="space-y-2 text-xs font-light text-cream-300/80">
              <li>
                <Link href="/account/orders" className="hover:text-gold transition-colors">
                  Track Your Shipment
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-gold transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-gold transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="hover:text-gold transition-colors">
                  Size Guide & Care
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold transition-colors">
                  Contact Concierge
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Admin */}
          <div className="space-y-3">
            <h5 className="text-xs uppercase tracking-widest font-semibold text-gold">
              Company
            </h5>
            <ul className="space-y-2 text-xs font-light text-cream-300/80">
              <li>
                <Link href="/about" className="hover:text-gold transition-colors">
                  Our Editorial Story
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-gold transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-gold transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-gold/80 hover:text-gold transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-charcoal-200/60 flex flex-col sm:flex-row items-center justify-between text-xs text-cream-300/50 font-light gap-4">
          <p>© {new Date().getFullYear()} BUYERA India. All rights reserved.</p>
          <p className="tracking-widest uppercase text-[10px]">
            Crafted for Modest Luxury • Razorpay & Shiprocket Integrated
          </p>
        </div>
      </div>
    </footer>
  );
}
