"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToBag = (product: any) => {
    addToCart(product, { quantity: 1 });
    removeFromWishlist(product.id);
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 py-14">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Wishlist Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-canvas-border pb-6 gap-4">
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase text-gold font-brand-badge font-semibold">
              SAVED SILHOUETTES
            </span>
            <h1 className="font-editorial-heading text-3xl sm:text-4xl text-charcoal">
              My Wishlist ({wishlist.length})
            </h1>
          </div>

          {wishlist.length > 0 && (
            <button
              onClick={clearWishlist}
              className="text-xs uppercase tracking-widest text-charcoal/50 hover:text-rose-600 transition-colors self-start sm:self-auto"
            >
              Clear All Items
            </button>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-20 bg-white border border-canvas-border p-8 shadow-sm space-y-5">
            <div className="w-16 h-16 rounded-full bg-cream-100 border border-gold/30 text-gold flex items-center justify-center mx-auto shadow-sm">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="font-editorial-heading text-2xl text-charcoal">
              Your Wishlist Is Empty
            </h2>
            <p className="text-xs text-charcoal/60 leading-relaxed font-light">
              Explore our modest haute couture, luxury abayas, and silk shaylas. Click the heart icon on any piece to save it for later.
            </p>
            <div className="pt-2">
              <Link href="/shop">
                <Button variant="gold" size="lg">
                  EXPLORE COLLECTIONS
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((product) => {
              const image =
                product.images?.find((img) => img.isPrimary)?.url ||
                product.images?.[0]?.url ||
                "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop";

              return (
                <div
                  key={product.id}
                  className="bg-white border border-canvas-border p-4 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-luxury transition-all"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-cream-100">
                    <Link href={`/product/${product.slug}`}>
                      <Image
                        src={image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </Link>
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      aria-label="Remove from Wishlist"
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 text-charcoal hover:text-rose-600 flex items-center justify-center shadow transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    {product.category && (
                      <p className="text-[10px] uppercase tracking-widest text-charcoal/50">
                        {product.category.name}
                      </p>
                    )}
                    <Link
                      href={`/product/${product.slug}`}
                      className="block text-sm font-medium text-charcoal hover:text-gold transition-colors line-clamp-1"
                    >
                      {product.name}
                    </Link>
                    <div className="flex items-baseline gap-2 pt-1">
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

                  <div className="pt-2 flex gap-2">
                    <Button
                      onClick={() => handleMoveToBag(product)}
                      variant="gold"
                      size="sm"
                      className="flex-1 text-[11px]"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
                      MOVE TO BAG
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
