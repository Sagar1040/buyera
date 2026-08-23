import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "new" | "sale" | "bestseller" | "gold" | "outline" | "charcoal";
}

export function Badge({
  className,
  variant = "gold",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    new: "bg-charcoal text-white",
    sale: "bg-rose-500 text-white",
    bestseller: "bg-gold text-charcoal font-semibold",
    gold: "bg-gold/20 text-gold-700 border border-gold/40",
    outline: "border border-charcoal/30 text-charcoal",
    charcoal: "bg-charcoal/10 text-charcoal",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 text-[10px] font-brand-badge font-medium tracking-widest uppercase transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
