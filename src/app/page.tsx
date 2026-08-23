import React from "react";
import { HeroBanner } from "@/components/home/HeroBanner";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ProductSection } from "@/components/home/ProductSection";
import { BrandStory } from "@/components/home/BrandStory";
import { Newsletter } from "@/components/home/Newsletter";
import { ProductType, CategoryType } from "@/types/product";

// Fallback curated mock data for initial load before database seeding
const SAMPLE_PRODUCTS: ProductType[] = [
  {
    id: "prod-1",
    name: "Royal Emerald Hand-Embroidered Abaya",
    slug: "royal-emerald-hand-embroidered-abaya",
    description:
      "Crafted from premium Korean Nida fabric featuring intricate gold zardozi cuff embroidery and a complimentary matching silk chiffon shayla.",
    mrp: 6999,
    price: 4999,
    sku: "BUY-ABY-001",
    isFeatured: true,
    isNew: true,
    isBestSeller: true,
    isActive: true,
    tags: ["abaya", "luxury", "embroidery", "bestseller"],
    categoryId: "cat-1",
    category: {
      id: "cat-1",
      name: "Luxury Abayas",
      slug: "abayas",
      isActive: true,
      order: 1,
    },
    images: [
      {
        id: "img-1",
        url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
        isPrimary: true,
        order: 1,
      },
      {
        id: "img-2",
        url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop",
        isPrimary: false,
        order: 2,
      },
    ],
    variants: [
      {
        id: "var-1",
        productId: "prod-1",
        size: "54 (S)",
        color: "Emerald Green",
        colorHex: "#0F3827",
        stock: 12,
        sku: "BUY-ABY-001-54",
      },
      {
        id: "var-2",
        productId: "prod-1",
        size: "56 (M)",
        color: "Emerald Green",
        colorHex: "#0F3827",
        stock: 15,
        sku: "BUY-ABY-001-56",
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-2",
    name: "Pure Medina Silk Luxury Shayla Hijab",
    slug: "pure-medina-silk-luxury-shayla-hijab",
    description:
      "Ultra-soft, opaque, and breathable pure Medina silk woven for effortless drapes and all-day royal comfort.",
    mrp: 1499,
    price: 999,
    sku: "BUY-HJB-002",
    isFeatured: true,
    isNew: true,
    isBestSeller: false,
    isActive: true,
    tags: ["hijab", "silk", "medina", "new"],
    categoryId: "cat-2",
    category: {
      id: "cat-2",
      name: "Premium Hijabs",
      slug: "hijabs",
      isActive: true,
      order: 2,
    },
    images: [
      {
        id: "img-3",
        url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop",
        isPrimary: true,
        order: 1,
      },
    ],
    variants: [
      {
        id: "var-3",
        productId: "prod-2",
        size: "One Size (190x75cm)",
        color: "Champagne Ivory",
        colorHex: "#FBF9F5",
        stock: 45,
        sku: "BUY-HJB-002-IVR",
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-3",
    name: "Embellished Organza Pakistani Churidar Suite",
    slug: "embellished-organza-pakistani-churidar-suite",
    description:
      "Three-piece formal ensemble including an organza shirt with heavy threadwork, raw silk trousers, and an embroidered scalloped dupatta.",
    mrp: 12999,
    price: 8999,
    sku: "BUY-PKC-003",
    isFeatured: true,
    isNew: false,
    isBestSeller: true,
    isActive: true,
    tags: ["pakistani", "churidar", "festive", "wedding"],
    categoryId: "cat-3",
    category: {
      id: "cat-3",
      name: "Pakistani Churidars",
      slug: "pakistani-churidars",
      isActive: true,
      order: 3,
    },
    images: [
      {
        id: "img-4",
        url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
        isPrimary: true,
        order: 1,
      },
    ],
    variants: [
      {
        id: "var-4",
        productId: "prod-3",
        size: "M",
        color: "Dusty Rose Gold",
        colorHex: "#C5A880",
        stock: 8,
        sku: "BUY-PKC-003-M",
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "prod-4",
    name: "Tiered Velvet Midnight Modest Maxi Dress",
    slug: "tiered-velvet-midnight-modest-maxi-dress",
    description:
      "Sumptuous plush micro-velvet tailored with balloon sleeves and a flattering tiered hem designed for winter galas.",
    mrp: 7499,
    price: 5499,
    sku: "BUY-DRS-004",
    isFeatured: true,
    isNew: true,
    isBestSeller: false,
    isActive: true,
    tags: ["dress", "velvet", "maxi", "winter"],
    categoryId: "cat-4",
    category: {
      id: "cat-4",
      name: "Islamic Dresses",
      slug: "islamic-dresses",
      isActive: true,
      order: 4,
    },
    images: [
      {
        id: "img-5",
        url: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop",
        isPrimary: true,
        order: 1,
      },
    ],
    variants: [
      {
        id: "var-5",
        productId: "prod-4",
        size: "L",
        color: "Midnight Obsidian",
        colorHex: "#121212",
        stock: 14,
        sku: "BUY-DRS-004-L",
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default async function HomePage() {
  return (
    <div className="flex flex-col w-full">
      <HeroBanner />
      <CategoryGrid />
      <ProductSection
        newArrivals={SAMPLE_PRODUCTS}
        bestSellers={SAMPLE_PRODUCTS.filter((p) => p.isBestSeller)}
        featured={SAMPLE_PRODUCTS.filter((p) => p.isFeatured)}
      />
      <BrandStory />
      <Newsletter />
    </div>
  );
}
