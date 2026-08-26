"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Check, Sparkles, Scissors, Eye } from "lucide-react";
import { ProductType } from "@/types/product";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: ProductType;
}

const COLOR_MAP: Record<string, string> = {
  emerald: "#1B4D3E",
  green: "#2E5A44",
  champagne: "#E8D8B8",
  gold: "#C5A880",
  black: "#1C1C1C",
  obsidian: "#121212",
  ruby: "#7E1928",
  maroon: "#5E1924",
  ivory: "#FBF9F5",
  pastel: "#D8C7B8",
  charcoal: "#2A2A2A",
  terracotta: "#A34828",
  olive: "#5B6B50",
  default: "#A34828",
};

export function ProductCard({ product }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [addedSize, setAddedSize] = useState<string | null>(null);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const isFavorited = isInWishlist(product.id);

  // Dual Image Swap (Front View vs Drape Angle)
  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop";

  const secondaryImage =
    product.images?.[1]?.url ||
    product.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop";

  const discountPercent = calculateDiscount(product.mrp, product.price);

  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const variantColors = Array.from(
    new Set(product.variants?.map((v) => v.color).filter(Boolean) || ["Emerald Green", "Terracotta Rust", "Champagne Gold"])
  );

  const getColorHex = (name: string) => {
    const lower = name.toLowerCase();
    for (const [key, hex] of Object.entries(COLOR_MAP)) {
      if (lower.includes(key)) return hex;
    }
    return "#A34828";
  };

  const handleQuickAddSize = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, {
      size,
      quantity: 1,
    });
    setAddedSize(size);
    setTimeout(() => setAddedSize(null), 1800);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-aramyaBorder overflow-hidden transition-all duration-500 hover:shadow-luxury-lg hover:border-terracotta/50">
      {/* 3:4 Image Container with Dual Image Crossfade */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-cream-100/70">
        <Link href={`/product/${product.slug}`} className="block w-full h-full relative">
          {/* Primary Image */}
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover object-top transition-all duration-700 ease-out group-hover:opacity-0 group-hover:scale-105"
          />

          {/* Secondary Drape Reveal on Hover */}
          <Image
            src={secondaryImage}
            alt={`${product.name} drape`}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover object-top absolute inset-0 opacity-0 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-105"
          />
        </Link>

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.isBestSeller && (
            <span className="px-2.5 py-0.5 bg-charcoal/90 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-widest rounded-full shadow-xs">
              BESTSELLER
            </span>
          )}
          {product.isNew && (
            <span className="px-2.5 py-0.5 bg-olive text-white text-[9px] font-bold uppercase tracking-widest rounded-full shadow-xs">
              NEW DROP
            </span>
          )}
          {discountPercent > 0 && (
            <span className="px-2.5 py-0.5 bg-terracotta text-white text-[9px] font-bold uppercase tracking-widest rounded-full shadow-xs">
              SAVE {discountPercent}%
            </span>
          )}
        </div>

        {/* Floating Wishlist Heart */}
        <div className="absolute top-3 right-3 z-20">
          <button
            onClick={handleToggleWishlist}
            aria-label={isFavorited ? "Remove from Wishlist" : "Add to Wishlist"}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md shadow-xs transition-all duration-300 hover:scale-110 ${
              isFavorited
                ? "bg-terracotta text-white"
                : "bg-white/90 text-charcoal hover:text-terracotta hover:bg-white"
            }`}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFavorited ? "fill-current" : ""
              }`}
            />
          </button>
        </div>

        {/* Instant Size Pills & Add To Bag on Desktop Hover */}
        <div className="hidden lg:block absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-aramyaBorder/70 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20 shadow-md">
          {addedSize ? (
            <div className="flex items-center justify-center gap-1.5 py-1 text-olive-600 text-[11px] font-bold uppercase tracking-wider">
              <Check className="w-3.5 h-3.5" />
              ADDED SIZE {addedSize} TO BAG
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-charcoal/60 font-semibold px-0.5">
                <span>Select Size:</span>
                <span className="text-terracotta flex items-center gap-0.5">
                  <Scissors className="w-2.5 h-2.5" /> Custom Fit
                </span>
              </div>
              <div className="flex items-center justify-between gap-1">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={(e) => handleQuickAddSize(e, size)}
                    className="flex-1 py-1 text-[10px] font-semibold border border-aramyaBorder rounded-full hover:bg-terracotta hover:text-white hover:border-terracotta transition-all uppercase"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white">
        <div className="space-y-1.5">
          {/* Category Subtitle */}
          {product.category && (
            <p className="text-[10px] tracking-[0.2em] uppercase text-charcoal/45 font-semibold">
              {product.category.name}
            </p>
          )}

          {/* Product Name */}
          <Link
            href={`/product/${product.slug}`}
            className="block text-xs sm:text-sm font-medium text-charcoal hover:text-terracotta transition-colors line-clamp-1 leading-snug"
          >
            {product.name}
          </Link>

          {/* Color Swatch Circles */}
          {variantColors.length > 0 && (
            <div className="flex items-center gap-1.5 pt-1">
              {variantColors.slice(0, 4).map((color, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedColorIndex(idx);
                  }}
                  title={color}
                  className={`w-3 h-3 rounded-full border transition-all ${
                    selectedColorIndex === idx
                      ? "ring-1 ring-terracotta ring-offset-1 scale-110"
                      : "border-black/10 hover:scale-110"
                  }`}
                  style={{ backgroundColor: getColorHex(color) }}
                />
              ))}
              {variantColors.length > 4 && (
                <span className="text-[9px] text-charcoal/40 font-mono">
                  +{variantColors.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Pricing Block with Strikethrough & SAVE Tag */}
        <div className="mt-3 pt-2.5 border-t border-aramyaBorder/60 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-charcoal tracking-tight">
              {formatPrice(product.price)}
            </span>
            {product.mrp > product.price && (
              <span className="text-xs text-charcoal/40 line-through font-light">
                {formatPrice(product.mrp)}
              </span>
            )}
          </div>
          {discountPercent > 0 && (
            <span className="text-[10px] font-bold text-terracotta bg-terracotta/10 px-2 py-0.5 rounded-full">
              SAVE {discountPercent}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
