import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { CategoryType } from "@/types/product";

const DEFAULT_CATEGORIES: Partial<CategoryType>[] = [
  {
    name: "Luxury Abayas",
    slug: "abayas",
    description: "Open front, kimono cuts, and embroidered evening wear",
    imageUrl:
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Premium Hijabs",
    slug: "hijabs",
    description: "Medina silk, modal, jersey, and instant crinkle collections",
    imageUrl:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Pakistani Churidars",
    slug: "pakistani-churidars",
    description: "Heavy zari work, organza dupattas, and lawn prints",
    imageUrl:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Islamic Dresses",
    slug: "islamic-dresses",
    description: "Tiered maxi silhouettes and modest evening couture",
    imageUrl:
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop",
  },
];

export function CategoryGrid({
  categories = DEFAULT_CATEGORIES as CategoryType[],
}: {
  categories?: CategoryType[];
}) {
  const displayCategories =
    categories.length > 0 ? categories.slice(0, 4) : DEFAULT_CATEGORIES;

  return (
    <section className="py-20 bg-canvas">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
          <p className="text-[10px] tracking-[0.25em] uppercase text-gold-600 font-brand-badge font-semibold">
            CURATED DEPARTMENTS
          </p>
          <h2 className="font-editorial-heading text-2xl sm:text-4xl text-charcoal font-normal">
            Shop By Signature Category
          </h2>
          <div className="w-12 h-[1px] bg-gold mx-auto mt-3" />
        </div>

        {/* 2x2 Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="group relative block aspect-[4/5] overflow-hidden bg-cream-200 border border-canvas-border shadow-sm hover:shadow-luxury transition-all duration-500"
            >
              {/* Category Image */}
              {cat.imageUrl && (
                <Image
                  src={cat.imageUrl}
                  alt={cat.name || "Category"}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                />
              )}

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent transition-opacity duration-300" />

              {/* Text Information */}
              <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end text-white">
                <div className="flex items-center justify-between">
                  <h3 className="font-editorial-heading text-lg sm:text-xl font-medium tracking-wide text-cream group-hover:text-gold transition-colors">
                    {cat.name}
                  </h3>
                  <div className="w-8 h-8 rounded-full border border-cream/30 flex items-center justify-center text-cream group-hover:bg-gold group-hover:border-gold group-hover:text-charcoal transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
                {cat.description && (
                  <p className="text-[11px] text-cream-200/80 font-light mt-1 line-clamp-1">
                    {cat.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
