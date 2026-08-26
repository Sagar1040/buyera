import React from "react";
import { prisma } from "@/lib/prisma";
import { ProductType } from "@/types/product";
import { ShopCatalog } from "@/components/shop/ShopCatalog";
import { Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ShopPage() {
  let products: ProductType[] = [];
  let categories: { id: string; name: string; slug: string }[] = [];

  try {
    const [rawProducts, rawCategories] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
        include: {
          category: true,
          images: { orderBy: { order: "asc" } },
          variants: true,
        },
      }),
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      }),
    ]);

    categories = rawCategories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
    }));

    products = rawProducts.map((p) => ({
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
    console.warn("Direct ShopPage DB query error:", err);
  }

  return (
    <div className="bg-cream-50 min-h-screen py-10 sm:py-14">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Title */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white text-[10px] tracking-[0.22em] uppercase text-terracotta font-brand-badge font-bold rounded-full border border-aramyaBorder shadow-xs">
            <Sparkles className="w-3 h-3 text-terracotta" />
            HAUTE COUTURE CATALOG
          </span>
          <h1 className="font-editorial-heading text-3xl sm:text-4xl text-charcoal font-normal">
            Bespoke Modest Silhouettes
          </h1>
          <p className="text-xs sm:text-sm text-charcoal/60 font-light">
            Showing {products.length} certified artisan-tailored ensembles
          </p>
        </div>

        {/* Dynamic Catalog with Live Direct Data */}
        <ShopCatalog initialProducts={products} categories={categories} />
      </div>
    </div>
  );
}
