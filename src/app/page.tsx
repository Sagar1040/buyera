import React from "react";
import { prisma } from "@/lib/prisma";
import { HeroBanner } from "@/components/home/HeroBanner";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ProductSection } from "@/components/home/ProductSection";
import { BrandStory } from "@/components/home/BrandStory";
import { LookbookGrid } from "@/components/home/LookbookGrid";
import { Newsletter } from "@/components/home/Newsletter";
import { ProductType } from "@/types/product";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  let banners: any[] = [];
  let categories: any[] = [];
  let latestProducts: ProductType[] = [];

  try {
    const [rawBanners, rawCategories, rawProducts] = await Promise.all([
      prisma.banner.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      }),
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      }),
      prisma.product.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
        take: 12,
        include: {
          category: true,
          images: { orderBy: { order: "asc" } },
          variants: true,
        },
      }),
    ]);

    banners = rawBanners;
    categories = rawCategories;

    latestProducts = rawProducts.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      price: p.price,
      mrp: p.mrp || p.price * 1.3,
      description: p.description || p.shortDesc || "",
      shortDesc: p.shortDesc,
      fabricCare: p.fabricCare,
      categoryId: p.categoryId,
      category: p.category || {
        id: p.categoryId,
        name: "Luxury Modest",
        slug: "abayas",
        isActive: true,
        order: 1,
      },
      images:
        p.images && p.images.length > 0
          ? p.images.map((img, idx) => ({
              id: img.id || `img-${idx}`,
              url: img.url,
              isPrimary: img.isPrimary || idx === 0,
              order: img.order || idx,
            }))
          : [
              {
                id: "img-def",
                url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
                isPrimary: true,
                order: 1,
              },
            ],
      variants: p.variants || [],
      isActive: p.isActive !== false,
      isFeatured: Boolean(p.isFeatured),
      isNew: Boolean(p.isNew),
      isBestSeller: Boolean(p.isBestSeller),
      tags: p.tags || [],
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));
  } catch (err) {
    console.warn("HomePage direct DB fetch error:", err);
  }

  return (
    <div className="flex flex-col w-full bg-cream">
      <HeroBanner banners={banners} />
      <CategoryGrid categories={categories} />
      <ProductSection initialProducts={latestProducts} />
      <BrandStory />
      <LookbookGrid />
      <Newsletter />
    </div>
  );
}
