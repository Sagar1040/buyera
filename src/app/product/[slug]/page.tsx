"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Truck, ShieldCheck, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, calculateDiscount } from "@/lib/utils";

export default function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const [selectedSize, setSelectedSize] = useState("56 (M)");
  const [selectedColor, setSelectedColor] = useState("Emerald Green");
  const [selectedImage, setSelectedImage] = useState(0);
  const [descOpen, setDescOpen] = useState(true);
  const [careOpen, setCareOpen] = useState(false);
  const [shippingOpen, setShippingOpen] = useState(false);

  // Mock product data for PDP
  const product = {
    name: "Royal Emerald Hand-Embroidered Abaya",
    slug: params.slug,
    sku: "BUY-ABY-001",
    mrp: 6999,
    price: 4999,
    isNew: true,
    isBestSeller: true,
    category: { name: "Luxury Abayas", slug: "abayas" },
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1200&auto=format&fit=crop",
    ],
    sizes: ["52 (XS)", "54 (S)", "56 (M)", "58 (L)", "60 (XL)"],
    colors: [
      { name: "Emerald Green", hex: "#0F3827" },
      { name: "Midnight Obsidian", hex: "#121212" },
      { name: "Muted Champagne", hex: "#C5A880" },
    ],
    description:
      "Crafted with unparalleled precision from premium Korean Nida fabric. This masterpiece features intricate metallic zardozi hand-embroidery along the wide cuffs, designed for high-profile festive gatherings and wedding receptions. Includes a matching luxury chiffon shayla hijab.",
    fabricCare:
      "100% Grade-A Korean Nida. Dry clean recommended. Do not bleach. Steam iron on reverse at low temperature.",
  };

  const discount = calculateDiscount(product.mrp, product.price);

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12">
      {/* Breadcrumb Navigation */}
      <nav className="text-xs text-charcoal/50 mb-8 flex items-center gap-2">
        <Link href="/" className="hover:text-charcoal">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-charcoal">Shop</Link>
        <span>/</span>
        <Link href={`/category/${product.category.slug}`} className="hover:text-charcoal">
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-charcoal font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Left: Multi-Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-cream-100 border border-canvas-border shadow-sm">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              priority
              className="object-cover object-top"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isNew && <Badge variant="new">NEW ARRIVAL</Badge>}
              {product.isBestSeller && <Badge variant="bestseller">BESTSELLER</Badge>}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-4">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative w-20 h-24 border overflow-hidden transition-all ${
                  selectedImage === idx ? "border-gold ring-1 ring-gold" : "border-canvas-border opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={img} alt="Thumbnail" fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product Details & Variant Matrix */}
        <div className="space-y-6">
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase text-gold font-brand-badge font-semibold">
              {product.category.name}
            </span>
            <h1 className="font-editorial-heading text-2xl sm:text-3xl text-charcoal font-normal mt-1">
              {product.name}
            </h1>
            <p className="text-xs text-charcoal/50 font-mono mt-1">SKU: {product.sku}</p>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 border-y border-canvas-border py-4">
            <span className="text-2xl font-bold text-charcoal">
              {formatPrice(product.price)}
            </span>
            {product.mrp > product.price && (
              <>
                <span className="text-sm text-charcoal/40 line-through">
                  {formatPrice(product.mrp)}
                </span>
                <span className="text-xs text-rose-600 font-semibold">
                  Save {discount}%
                </span>
              </>
            )}
            <span className="text-[11px] text-charcoal/50 ml-auto font-light">
              Inclusive of all taxes
            </span>
          </div>

          {/* Color Matrix */}
          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-wider text-charcoal font-medium">
              Color: <span className="font-normal text-charcoal/70">{selectedColor}</span>
            </label>
            <div className="flex items-center gap-3">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                  className={`w-7 h-7 rounded-full border-2 transition-transform ${
                    selectedColor === c.name ? "border-gold scale-110 shadow-sm" : "border-white/80"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Size Matrix */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-xs uppercase tracking-wider text-charcoal font-medium">
                Size: <span className="font-normal text-charcoal/70">{selectedSize}</span>
              </label>
              <button className="text-[11px] text-gold-dark underline uppercase tracking-wider">
                Size Chart
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`px-4 py-2 text-xs uppercase font-medium border transition-all ${
                    selectedSize === s
                      ? "bg-charcoal text-white border-charcoal"
                      : "bg-white text-charcoal border-canvas-border hover:border-charcoal"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4 pt-2">
            <Link href="/cart" className="flex-1">
              <Button variant="gold" size="lg" className="w-full">
                <ShoppingBag className="w-4 h-4 mr-2" />
                ADD TO SHOPPING BAG
              </Button>
            </Link>
            <button
              aria-label="Add to Wishlist"
              className="p-3.5 border border-canvas-border hover:border-rose-400 text-charcoal hover:text-rose-500 transition-colors"
            >
              <Heart className="w-5 h-5" />
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-canvas-border text-xs text-charcoal/70">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-gold shrink-0" />
              <span>Complimentary Delivery in 3-5 Business Days</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
              <span>7-Day Hassle-Free Returns</span>
            </div>
          </div>

          {/* Expandable Accordions */}
          <div className="border-t border-canvas-border pt-4 divide-y divide-canvas-border">
            {/* Description */}
            <div className="py-3">
              <button
                onClick={() => setDescOpen(!descOpen)}
                className="w-full flex justify-between items-center text-xs uppercase tracking-widest font-semibold text-charcoal"
              >
                <span>Editorial Description</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${descOpen ? "rotate-180" : ""}`} />
              </button>
              {descOpen && (
                <p className="text-xs text-charcoal/70 font-light leading-relaxed mt-3">
                  {product.description}
                </p>
              )}
            </div>

            {/* Fabric & Care */}
            <div className="py-3">
              <button
                onClick={() => setCareOpen(!careOpen)}
                className="w-full flex justify-between items-center text-xs uppercase tracking-widest font-semibold text-charcoal"
              >
                <span>Fabric & Care Instructions</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${careOpen ? "rotate-180" : ""}`} />
              </button>
              {careOpen && (
                <p className="text-xs text-charcoal/70 font-light leading-relaxed mt-3">
                  {product.fabricCare}
                </p>
              )}
            </div>

            {/* Shipping & Delivery */}
            <div className="py-3">
              <button
                onClick={() => setShippingOpen(!shippingOpen)}
                className="w-full flex justify-between items-center text-xs uppercase tracking-widest font-semibold text-charcoal"
              >
                <span>Shipping & Authenticity</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${shippingOpen ? "rotate-180" : ""}`} />
              </button>
              {shippingOpen && (
                <p className="text-xs text-charcoal/70 font-light leading-relaxed mt-3">
                  Every BUYERA order is dispatched in our signature luxury gold-foil presentation box. Includes live tracking with Shiprocket.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
