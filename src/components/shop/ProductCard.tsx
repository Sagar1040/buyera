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
  default: "#C5A880",
};

export function ProductCard({ product }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [addedSize, setAddedSize] = useState<string | null>(null);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const isFavorited = isInWishlist(product.id);

  // Dual Image Swap (Front Silhouette vs Drape / Detail)
  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop";

  const secondaryImage =
    product.images?.[1]?.url ||
    product.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop";

  const discountPercent = calculateDiscount(product.mrp, product.price);

  const availableSizes = ["52 (XS)", "54 (S)", "56 (M)", "58 (L)", "60 (XL)"];

  // Derive color swatches from variants or defaults
  const variantColors = Array.from(
    new Set(product.variants?.map((v) => v.color).filter(Boolean) || ["Emerald Green", "Champagne Gold", "Obsidian Black"])
  );

  const getColorHex = (name: string) => {
    const lower = name.toLowerCase();
    for (const [key, hex] of Object.entries(COLOR_MAP)) {
      if (lower.includes(key)) return hex;
    }
    return "#C5A880";
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
    <div className="group relative flex flex-col bg-white rounded-2xl border border-stoneBorder/80 overflow-hidden transition-all duration-500 hover:shadow-luxury-lg hover:border-gold/60">
      {/* Tall Portrait 3:4 Image Container with Dual Image Crossfade */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-cream-100/70">
        <Link href={`/product/${product.slug}`} className="block w-full h-full relative">
          {/* Primary Front Image */}
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover object-top transition-all duration-700 ease-out group-hover:opacity-0 group-hover:scale-105"
          />

          {/* Secondary Hover Image Reveal */}
          <Image
            src={secondaryImage}
            alt={`${product.name} drape view`}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover object-top absolute inset-0 opacity-0 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-105"
          />
        </Link>

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.isBestSeller && (
            <span className="px-2.5 py-0.5 bg-charcoal/90 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-widest rounded-full shadow-sm">
              BESTSELLER
            </span>
          )}
          {product.isNew && (
            <span className="px-2.5 py-0.5 bg-gold/90 backdrop-blur-md text-charcoal text-[9px] font-bold uppercase tracking-widest rounded-full shadow-sm flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 fill-current" />
              NEW ATELIER
            </span>
          )}
          {discountPercent > 0 && (
            <span className="px-2.5 py-0.5 bg-emerald-700/90 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-widest rounded-full shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Floating Wishlist Heart */}
        <div className="absolute top-3 right-3 z-20">
          <button
            onClick={handleToggleWishlist}
            aria-label={isFavorited ? "Remove from Wishlist" : "Add to Wishlist"}
            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md shadow-sm transition-all duration-300 hover:scale-110 ${
              isFavorited
                ? "bg-rose-500 text-white"
                : "bg-white/85 text-charcoal hover:text-rose-500 hover:bg-white"
            }`}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFavorited ? "fill-current" : ""
              }`}
            />
          </button>
        </div>

        {/* Quick Size Select Bar on Desktop Hover */}
        <div className="hidden lg:block absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-stoneBorder/60 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20 shadow-md">
          {addedSize ? (
            <div className="flex items-center justify-center gap-1.5 py-1 text-emerald-700 text-[11px] font-bold uppercase tracking-wider">
              <Check className="w-3.5 h-3.5" />
              ADDED SIZE {addedSize} TO BAG
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-charcoal/60 font-semibold px-0.5">
                <span>Select Size To Add:</span>
                <span className="text-gold-dark flex items-center gap-0.5">
                  <Scissors className="w-2.5 h-2.5" /> Custom Tailoring
                </span>
              </div>
              <div className="flex items-center justify-between gap-1.5">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={(e) => handleQuickAddSize(e, size)}
                    className="flex-1 py-1 text-[10px] font-semibold border border-stoneBorder rounded-full hover:bg-charcoal hover:text-white hover:border-charcoal transition-all uppercase"
                  >
                    {size.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Information Card */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white">
        <div className="space-y-1.5">
          {/* Category Tag */}
          {product.category && (
            <p className="text-[10px] tracking-[0.2em] uppercase text-charcoal/45 font-medium">
              {product.category.name}
            </p>
          )}

          {/* Product Title */}
          <Link
            href={`/product/${product.slug}`}
            className="block text-xs sm:text-sm font-medium text-charcoal hover:text-gold-dark transition-colors line-clamp-1 leading-snug"
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
                      ? "ring-1 ring-gold ring-offset-1 scale-110"
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

        {/* Pricing Block with Strikethrough and Pill Discount */}
        <div className="mt-3 pt-2.5 border-t border-stoneBorder/50 flex items-baseline justify-between">
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
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              Save {discountPercent}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
