import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "gold" | "outline" | "ghost" | "dark";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "py-2 px-4 text-[11px]",
      md: "py-3.5 px-6 text-xs",
      lg: "py-4 px-8 text-sm",
    };

    const variantClasses = {
      primary:
        "bg-charcoal text-white hover:bg-black border border-charcoal shadow-luxury",
      gold:
        "bg-gold text-charcoal hover:bg-gold-500 hover:text-white border border-gold font-semibold shadow-gold-subtle",
      outline:
        "bg-transparent text-charcoal border border-charcoal/30 hover:border-charcoal hover:bg-charcoal hover:text-white",
      ghost:
        "bg-transparent text-charcoal/80 hover:text-charcoal hover:bg-cream-100/60 border border-transparent",
      dark:
        "bg-charcoal-900 text-cream hover:bg-charcoal border border-gold/30 hover:border-gold shadow-gold-subtle",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "font-sans uppercase tracking-widest transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none inline-flex items-center justify-center gap-2",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {isLoading && (
          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
