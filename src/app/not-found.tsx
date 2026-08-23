import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20 bg-canvas">
      <span className="text-[11px] font-brand-badge tracking-[0.3em] uppercase text-gold font-semibold mb-2">
        404 ERROR
      </span>
      <h1 className="font-editorial-heading text-4xl sm:text-6xl text-charcoal font-normal mb-4">
        Page Not Found
      </h1>
      <p className="text-xs sm:text-sm text-charcoal/60 max-w-md mb-8 font-light leading-relaxed">
        The requested silhouette or editorial collection is currently unavailable or has been relocated.
      </p>
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="primary" size="md">
            RETURN TO ATELIER
          </Button>
        </Link>
        <Link href="/shop">
          <Button variant="outline" size="md">
            EXPLORE CATALOG
          </Button>
        </Link>
      </div>
    </div>
  );
}
