"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag } from "lucide-react";
import { ProductType } from "@/types/product";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

interface ProductCardProps {
  product: ProductType;
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop";

  const hoverImage =
    product.images?.[1]?.url || primaryImage;

  const discountPercent = calculateDiscount(product.mrp, product.price);

  return (
    <div className="group relative flex flex-col bg-white border border-canvas-border transition-all duration-300 hover:shadow-luxury">
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-cream-100">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.isNew && <Badge variant="new">NEW</Badge>}
          {product.isBestSeller && <Badge variant="bestseller">BESTSELLER</Badge>}
          {discountPercent > 0 && (
            <Badge variant="sale">-{discountPercent}%</Badge>
          )}
        </div>

        {/* Quick Action Buttons (Wishlist & Quick Add) */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            aria-label="Add to Wishlist"
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-charcoal hover:text-rose-500 flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110"
          >
            <Heart className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Add To Bag Bar on Hover */}
        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-charcoal/80 via-charcoal/40 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Link
            href={`/product/${product.slug}`}
            className="w-full py-2.5 bg-white text-charcoal hover:bg-gold hover:text-white text-[11px] font-medium tracking-widest uppercase flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            SELECT OPTIONS
          </Link>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          {product.category && (
            <p className="text-[10px] tracking-widest uppercase text-charcoal/50 font-medium mb-1">
              {product.category.name}
            </p>
          )}
          <Link
            href={`/product/${product.slug}`}
            className="block text-xs sm:text-sm font-medium text-charcoal hover:text-gold-dark transition-colors line-clamp-1"
          >
            {product.name}
          </Link>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-sm font-semibold text-charcoal">
            {formatPrice(product.price)}
          </span>
          {product.mrp > product.price && (
            <span className="text-xs text-charcoal/40 line-through">
              {formatPrice(product.mrp)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
