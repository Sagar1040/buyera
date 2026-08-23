import React from "react";
import Link from "next/link";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductType } from "@/types/product";

const MOCK_CATEGORY_PRODUCTS: Record<string, { title: string; desc: string; items: ProductType[] }> = {
  abayas: {
    title: "Signature Abayas",
    desc: "Exquisite hand-embroidered Korean Nida, open front, and kimono silhouettes.",
    items: [
      {
        id: "prod-1",
        name: "Royal Emerald Hand-Embroidered Abaya",
        slug: "royal-emerald-hand-embroidered-abaya",
        description: "Crafted from premium Korean Nida fabric featuring intricate gold zardozi cuff embroidery.",
        mrp: 6999,
        price: 4999,
        sku: "BUY-ABY-001",
        isFeatured: true,
        isNew: true,
        isBestSeller: true,
        isActive: true,
        tags: ["abaya", "luxury"],
        categoryId: "cat-1",
        category: { id: "cat-1", name: "Luxury Abayas", slug: "abayas", isActive: true, order: 1 },
        images: [
          { id: "img-1", url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop", isPrimary: true, order: 1 },
        ],
        variants: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  hijabs: {
    title: "Premium Hijabs & Shaylas",
    desc: "Pure Medina silk, modal cotton, and luxury crinkle fabrics.",
    items: [
      {
        id: "prod-2",
        name: "Pure Medina Silk Luxury Shayla Hijab",
        slug: "pure-medina-silk-luxury-shayla-hijab",
        description: "Ultra-soft, opaque, and breathable pure Medina silk.",
        mrp: 1499,
        price: 999,
        sku: "BUY-HJB-002",
        isFeatured: true,
        isNew: true,
        isBestSeller: false,
        isActive: true,
        tags: ["hijab", "silk"],
        categoryId: "cat-2",
        category: { id: "cat-2", name: "Premium Hijabs", slug: "hijabs", isActive: true, order: 2 },
        images: [
          { id: "img-3", url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop", isPrimary: true, order: 1 },
        ],
        variants: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  "pakistani-churidars": {
    title: "Pakistani Churidars & Suits",
    desc: "Heavy zari embellishments, organza dupattas, and lawn festive wear.",
    items: [
      {
        id: "prod-3",
        name: "Embellished Organza Pakistani Churidar Suite",
        slug: "embellished-organza-pakistani-churidar-suite",
        description: "Three-piece formal ensemble including an organza shirt with heavy threadwork.",
        mrp: 12999,
        price: 8999,
        sku: "BUY-PKC-003",
        isFeatured: true,
        isNew: false,
        isBestSeller: true,
        isActive: true,
        tags: ["pakistani", "festive"],
        categoryId: "cat-3",
        category: { id: "cat-3", name: "Pakistani Churidars", slug: "pakistani-churidars", isActive: true, order: 3 },
        images: [
          { id: "img-4", url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop", isPrimary: true, order: 1 },
        ],
        variants: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  "islamic-dresses": {
    title: "Modest Islamic Dresses",
    desc: "Tiered maxi gowns, velvet couture, and modest evening silhouettes.",
    items: [
      {
        id: "prod-4",
        name: "Tiered Velvet Midnight Modest Maxi Dress",
        slug: "tiered-velvet-midnight-modest-maxi-dress",
        description: "Sumptuous plush micro-velvet tailored with balloon sleeves.",
        mrp: 7499,
        price: 5499,
        sku: "BUY-DRS-004",
        isFeatured: true,
        isNew: true,
        isBestSeller: false,
        isActive: true,
        tags: ["dress", "velvet"],
        categoryId: "cat-4",
        category: { id: "cat-4", name: "Islamic Dresses", slug: "islamic-dresses", isActive: true, order: 4 },
        images: [
          { id: "img-5", url: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop", isPrimary: true, order: 1 },
        ],
        variants: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  },
};

export default function CategoryDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const categoryData = MOCK_CATEGORY_PRODUCTS[params.slug] || {
    title: "Curated Collection",
    desc: "Discover handpicked modest silhouettes designed for distinction.",
    items: [],
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12">
      {/* Category Header */}
      <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
        <span className="text-[10px] tracking-[0.25em] uppercase text-gold font-brand-badge font-semibold">
          DEPARTMENT
        </span>
        <h1 className="font-editorial-heading text-3xl sm:text-4xl text-charcoal">
          {categoryData.title}
        </h1>
        <p className="text-xs text-charcoal/60 leading-relaxed max-w-md mx-auto">
          {categoryData.desc}
        </p>
      </div>

      {/* Product List */}
      {categoryData.items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoryData.items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-canvas-border space-y-3">
          <p className="text-xs text-charcoal/60">
            More silhouettes are arriving for this collection soon.
          </p>
          <Link
            href="/shop"
            className="text-xs uppercase tracking-widest text-gold-dark underline font-medium"
          >
            Explore All Collections
          </Link>
        </div>
      )}
    </div>
  );
}
