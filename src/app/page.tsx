import React from "react";
import { HeroBanner } from "@/components/home/HeroBanner";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ProductSection } from "@/components/home/ProductSection";
import { BrandStory } from "@/components/home/BrandStory";
import { LookbookGrid } from "@/components/home/LookbookGrid";
import { Newsletter } from "@/components/home/Newsletter";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function HomePage() {
  return (
    <div className="flex flex-col w-full bg-cream">
      <HeroBanner />
      <CategoryGrid />
      <ProductSection />
      <BrandStory />
      <LookbookGrid />
      <Newsletter />
    </div>
  );
}
