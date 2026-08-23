"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Check, Zap, Scissors } from "lucide-react";
import { ProductType } from "@/types/product";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: ProductType;
}

export function ProductCard({ product }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [addedSize, setAddedSize] = useState<string | null>(null);

  const isFavorited = isInWishlist(product.id);

  // Cbazaar Dual Image Swap (Front vs Angle/Detail)
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
    <div className="group relative flex flex-col bg-white border border-canvas-border transition-all duration-300 hover:shadow-luxury hover:border-gold/50">
      {/* Tall Portrait 3:4 Image Container with Dual Image Swap */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-cream-100">
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
            alt={`${product.name} drape`}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover object-top absolute inset-0 opacity-0 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-105"
          />
        </Link>

        {/* Floating Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          {product.isBestSeller && (
            <span className="px-2 py-0.5 bg-charcoal text-white text-[9px] font-bold uppercase tracking-wider shadow-sm">
              BESTSELLER
            </span>
          )}
          <span className="px-2 py-0.5 bg-gold text-charcoal text-[9px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
            <Zap className="w-2.5 h-2.5 fill-current" />
            READY TO SHIP
          </span>
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 bg-emerald-700 text-white text-[9px] font-bold uppercase tracking-wider shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Floating Wishlist Heart */}
        <div className="absolute top-2.5 right-2.5 z-20">
          <button
            onClick={handleToggleWishlist}
            aria-label={isFavorited ? "Remove from Wishlist" : "Add to Wishlist"}
            className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110 ${
              isFavorited
                ? "bg-rose-500 text-white"
                : "bg-white/90 backdrop-blur-sm text-charcoal hover:text-rose-500"
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
        <div className="hidden lg:block absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-canvas-border p-2.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20 shadow-md">
          {addedSize ? (
            <div className="flex items-center justify-center gap-1.5 py-1 text-emerald-700 text-[11px] font-bold uppercase tracking-wider">
              <Check className="w-3.5 h-3.5" />
              ADDED SIZE {addedSize} TO BAG
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-charcoal/60 font-semibold px-0.5">
                <span>Select Size To Add:</span>
                <span className="text-gold-dark flex items-center gap-0.5">
                  <Scissors className="w-2.5 h-2.5" /> Custom Tailored
                </span>
              </div>
              <div className="flex items-center justify-between gap-1">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={(e) => handleQuickAddSize(e, size)}
                    className="flex-1 py-1 text-[10px] font-medium border border-canvas-border hover:bg-charcoal hover:text-white hover:border-charcoal transition-colors uppercase"
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
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between bg-white">
        <div className="space-y-1">
          {product.category && (
            <p className="text-[10px] tracking-widest uppercase text-charcoal/50 font-medium">
              {product.category.name}
            </p>
          )}
          <Link
            href={`/product/${product.slug}`}
            className="block text-xs sm:text-sm font-medium text-charcoal hover:text-gold-dark transition-colors line-clamp-1 leading-snug"
          >
            {product.name}
          </Link>
        </div>

        {/* Pricing Block with Strike-through and Discount */}
        <div className="mt-2.5 pt-2 border-t border-canvas-border/60 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-charcoal">
              {formatPrice(product.price)}
            </span>
            {product.mrp > product.price && (
              <span className="text-xs text-charcoal/40 line-through">
                {formatPrice(product.mrp)}
              </span>
            )}
          </div>
          {discountPercent > 0 && (
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 border border-emerald-200">
              Save {discountPercent}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
