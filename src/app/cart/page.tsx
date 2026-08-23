"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const [items, setItems] = useState([
    {
      id: "item-1",
      name: "Royal Emerald Hand-Embroidered Abaya",
      size: "56 (M)",
      color: "Emerald Green",
      price: 4999,
      mrp: 6999,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "item-2",
      name: "Pure Medina Silk Luxury Shayla Hijab",
      size: "One Size",
      color: "Champagne Ivory",
      price: 999,
      mrp: 1499,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop",
    },
  ]);

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as typeof items
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShippingThreshold = 999;
  const shipping = subtotal >= freeShippingThreshold ? 0 : 99;
  const total = subtotal + shipping;

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Cart Title */}
        <div className="text-center space-y-1">
          <span className="text-[10px] tracking-[0.25em] uppercase text-gold font-brand-badge font-semibold">
            YOUR BAG
          </span>
          <h1 className="font-editorial-heading text-3xl text-charcoal">
            Shopping Bag ({items.length})
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white border border-canvas-border space-y-4">
            <ShoppingBag className="w-12 h-12 text-gold mx-auto" />
            <h2 className="font-editorial-heading text-xl text-charcoal">
              Your shopping bag is currently empty
            </h2>
            <p className="text-xs text-charcoal/60">
              Discover our latest luxury abayas and Medina silk hijabs.
            </p>
            <Link href="/shop" className="inline-block pt-2">
              <Button variant="gold" size="md">
                EXPLORE CATALOG
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-white border border-canvas-border shadow-sm items-center"
                >
                  <div className="relative w-20 h-24 bg-cream-100 shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs sm:text-sm font-medium text-charcoal line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-charcoal/60 mt-0.5">
                      Size: {item.size} • Color: {item.color}
                    </p>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-sm font-semibold text-charcoal">
                        {formatPrice(item.price)}
                      </span>
                      {item.mrp > item.price && (
                        <span className="text-xs text-charcoal/40 line-through">
                          {formatPrice(item.mrp)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center border border-canvas-border bg-canvas">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1.5 text-charcoal hover:bg-cream-200"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 text-xs font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1.5 text-charcoal hover:bg-cream-200"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-charcoal/40 hover:text-rose-500 transition-colors"
                    aria-label="Remove Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary Box */}
            <div className="bg-white border border-canvas-border p-6 shadow-luxury space-y-5 self-start">
              <h2 className="font-editorial-heading text-lg text-charcoal border-b border-canvas-border pb-3">
                Order Summary
              </h2>

              <div className="space-y-2.5 text-xs text-charcoal/70">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-charcoal">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-medium text-charcoal">
                    {shipping === 0 ? "FREE" : formatPrice(shipping)}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-canvas-border flex justify-between items-baseline">
                <span className="text-sm font-semibold text-charcoal">
                  Total Payable
                </span>
                <span className="text-lg font-bold text-charcoal">
                  {formatPrice(total)}
                </span>
              </div>

              <Link href="/checkout" className="block w-full">
                <Button variant="gold" size="lg" className="w-full">
                  PROCEED TO CHECKOUT
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-charcoal/60 uppercase tracking-wider pt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-gold" />
                Encrypted Razorpay Checkout
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
