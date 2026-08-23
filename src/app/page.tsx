import React from "react";
import { HeroBanner } from "@/components/home/HeroBanner";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ProductSection } from "@/components/home/ProductSection";
import { BrandStory } from "@/components/home/BrandStory";
import { Newsletter } from "@/components/home/Newsletter";

export const dynamic = "force-static";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      <HeroBanner />
      <CategoryGrid />
      <ProductSection />
      <BrandStory />
      <Newsletter />
    </div>
  );
}
