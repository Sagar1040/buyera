import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
        xl: "2.5rem",
        "2xl": "3rem",
      },
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // High Contrast & Deep Dark Accents
        charcoal: {
          50: "#2B2B2B",
          100: "#242424",
          200: "#1E1E1E",
          300: "#1A1A1A",
          400: "#161616",
          DEFAULT: "#121212", // Primary Brand Black
          900: "#0D0D0D",
          950: "#080808",
        },
        // Warm Cream / Ivory Surfaces
        cream: {
          50: "#FDFCF9",
          DEFAULT: "#FBF9F5", // Secondary Surface Ivory
          100: "#F7F3EB",
          200: "#EFE8DC",
          300: "#E4D9C7",
          400: "#D6C6AE",
          500: "#C4AF90",
        },
        // Muted Luxury Gold Accent Palette
        gold: {
          50: "#F9F5EE",
          100: "#F0E7D4",
          200: "#E3CEAA",
          300: "#D5B682",
          DEFAULT: "#C5A880", // Primary Accent Muted Gold
          500: "#B89667",
          600: "#A38051",
          700: "#86663E",
          800: "#684E30",
          900: "#4D3924",
        },
        // Off-White Background Canvas
        canvas: {
          DEFAULT: "#F7F7F7",
          subtle: "#F4F4F4",
          border: "#E9E5DE",
          card: "#FFFFFF",
        },
        // Status Colors
        emerald: {
          500: "#10B981",
          600: "#059669",
        },
        rose: {
          500: "#F43F5E",
          600: "#E11D48",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Playfair Display", "Cinzel", "Georgia", "serif"],
        sans: ["var(--font-jakarta)", "Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-cinzel)", "Cinzel", "Playfair Display", "serif"],
      },
      boxShadow: {
        luxury: "0 10px 30px -10px rgba(18, 18, 18, 0.08)",
        "luxury-lg": "0 20px 40px -15px rgba(18, 18, 18, 0.12)",
        "gold-glow": "0 0 25px rgba(197, 168, 128, 0.28)",
        "gold-subtle": "0 4px 20px rgba(197, 168, 128, 0.15)",
        card: "0 2px 12px -2px rgba(18, 18, 18, 0.04)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #D5B682 0%, #C5A880 50%, #A38051 100%)",
        "gold-shimmer": "linear-gradient(90deg, #C5A880 0%, #F0E7D4 50%, #C5A880 100%)",
        "dark-gradient": "linear-gradient(180deg, #1A1A1A 0%, #121212 100%)",
        "cream-gradient": "linear-gradient(180deg, #FFFFFF 0%, #FBF9F5 100%)",
      },
      letterSpacing: {
        widest: "0.2em",
        editorial: "0.15em",
      },
      keyframes: {
        shimmer: {
          "100%": {
            transform: "translateX(100%)",
          },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
      },
      animation: {
        shimmer: "shimmer 2s infinite",
        fadeIn: "fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        slideInRight: "slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
