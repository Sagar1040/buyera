"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Lock, ArrowLeft, Tag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  const subtotal = 5998;
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = Math.max(0, subtotal - discount + shipping);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === "BUYERA10") {
      const disc = Math.round((subtotal * 10) / 100);
      setDiscount(disc);
      setCouponApplied(true);
    } else {
      alert("Invalid coupon code. Try BUYERA10");
    }
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs text-charcoal/60 hover:text-charcoal mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to shopping bag
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Shipping Details Form */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white border border-canvas-border p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-canvas-border pb-4">
                <h2 className="font-editorial-heading text-xl text-charcoal">
                  1. Shipping Information
                </h2>
                <span className="text-[10px] tracking-widest uppercase text-gold font-semibold">
                  DELIVERY TO INDIA
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Full Name" placeholder="Aisha Khan" required />
                <Input label="Mobile Number" placeholder="+91 98765 43210" required />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Flat / House / Building" placeholder="Flat 402, Royal Palms" required />
                <Input label="Street & Area" placeholder="80 Feet Road, Koramangala" required />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input label="City" placeholder="Bengaluru" required />
                <Input label="State" placeholder="Karnataka" required />
                <Input label="PIN Code" placeholder="560034" required />
              </div>
            </div>

            {/* Payment Section */}
            <div className="bg-white border border-canvas-border p-8 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-canvas-border pb-4">
                <h2 className="font-editorial-heading text-xl text-charcoal">
                  2. Payment Method
                </h2>
                <span className="text-[10px] tracking-widest uppercase text-emerald-600 font-semibold">
                  RAZORPAY 256-BIT SECURE
                </span>
              </div>

              <p className="text-xs text-charcoal/70 leading-relaxed">
                You will be redirected to the secure Razorpay payment gateway to pay via UPI (Google Pay, PhonePe, Paytm), Credit/Debit Card, or Net Banking.
              </p>

              <div className="p-4 bg-cream-100 border border-gold/30 flex items-center gap-3">
                <Lock className="w-5 h-5 text-gold shrink-0" />
                <p className="text-[11px] text-charcoal/80">
                  Server-side cryptographic signature verification (HMAC SHA256) protects every transaction against tampering.
                </p>
              </div>
            </div>
          </div>

          {/* Checkout Summary Box */}
          <div className="bg-white border border-canvas-border p-6 shadow-luxury space-y-6 self-start">
            <h2 className="font-editorial-heading text-lg text-charcoal border-b border-canvas-border pb-3">
              Order Review
            </h2>

            {/* Coupon Code Engine */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label className="block text-xs uppercase tracking-wider text-charcoal/70 font-medium">
                Promotional Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="e.g. BUYERA10"
                  className="flex-1 px-3 py-2 text-xs uppercase bg-canvas border border-canvas-border focus:outline-none focus:border-gold"
                />
                <Button type="submit" variant="primary" size="sm">
                  APPLY
                </Button>
              </div>
              {couponApplied && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium pt-1">
                  <Tag className="w-3.5 h-3.5" />
                  Coupon applied: 10% discount
                </div>
              )}
            </form>

            <div className="space-y-3 text-xs text-charcoal/70 border-t border-canvas-border pt-4">
              <div className="flex justify-between">
                <span>Subtotal (2 items)</span>
                <span className="font-medium text-charcoal">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Coupon Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Express Shipping</span>
                <span className="font-medium text-charcoal">
                  {shipping === 0 ? "FREE" : formatPrice(shipping)}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-canvas-border flex justify-between items-baseline">
              <span className="text-sm font-semibold text-charcoal">Total Amount</span>
              <span className="text-xl font-bold text-charcoal">{formatPrice(total)}</span>
            </div>

            <Button variant="gold" size="lg" className="w-full">
              <Lock className="w-4 h-4 mr-1" />
              PAY {formatPrice(total)} WITH RAZORPAY
            </Button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-charcoal/50 uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-gold" />
              100% Encrypted & Authenticated
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
