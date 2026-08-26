"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useSettings } from "@/context/SettingsContext";

interface LogoProps {
  variant?: "full" | "icon";
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
}

export function Logo({
  variant = "full",
  className = "",
  size = "md",
  showTagline = false,
}: LogoProps) {
  const { settings } = useSettings();
  const [imageError, setImageError] = useState(false);

  const heights = {
    sm: "h-8 sm:h-9",
    md: "h-10 sm:h-12",
    lg: "h-14 sm:h-16",
    xl: "h-20 sm:h-24",
  };

  const logoSrc = settings.logoUrl && settings.logoUrl !== "/logo.png" ? settings.logoUrl : "/logo.svg";

  return (
    <div className={`flex flex-col items-start justify-center ${className}`}>
      {!imageError ? (
        <img
          src={logoSrc}
          alt={settings.siteTitle || "BUYERA"}
          className={`${heights[size]} w-auto max-w-[280px] object-contain transition-transform duration-300 hover:scale-[1.02]`}
          onError={() => setImageError(true)}
        />
      ) : (
        <span className="font-editorial-heading text-2xl font-bold tracking-tight text-charcoal">
          {settings.siteTitle || "BUYERA"}
        </span>
      )}

      {showTagline && settings.siteTagline && (
        <span className="text-[9px] uppercase tracking-[0.28em] text-charcoal/60 font-sans font-medium pl-0.5 -mt-0.5">
          {settings.siteTagline}
        </span>
      )}
    </div>
  );
}
