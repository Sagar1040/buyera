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
          DEFAULT: "#1E1E1E", // Aramya Signature Charcoal
          900: "#0D0D0D",
          950: "#080808",
        },
        // Aramya Signature Earthy Terracotta / Rust
        terracotta: {
          50: "#FAF3F0",
          100: "#F5E4DE",
          200: "#EBCCBF",
          300: "#DCAB9B",
          400: "#C47960",
          DEFAULT: "#A34828", // Primary Earthy Accent
          600: "#8F3D20",
          700: "#75321A",
          800: "#5D2613",
        },
        // Aramya Warm Olive
        olive: {
          50: "#F4F6F3",
          100: "#E6EBE4",
          200: "#D0DCD0",
          300: "#A8BEA7",
          DEFAULT: "#5B6B50", // Warm Olive Accent
          600: "#4B5942",
          700: "#3D4836",
        },
        // Aramya Warm Organic Cream & Sand
        cream: {
          50: "#FDFBF7",
          DEFAULT: "#FBF9F5", // Aramya Primary Background
          100: "#F5EFEB", // Aramya Sand
          200: "#EFE8DE", // Aramya Subtle Border
          300: "#E4D9C7",
          400: "#D6C6AE",
          500: "#C4AF90",
        },
        softSand: "#F5EFEB",
        aramyaBorder: "#EFE8DE",
        blush: {
          50: "#FCF8F6",
          DEFAULT: "#F9F1ED",
          100: "#F4E5DE",
          200: "#E8CEC2",
        },
        sage: {
          50: "#F4F6F4",
          DEFAULT: "#E8ECE6",
          100: "#DBE2D9",
          200: "#C1CEC0",
        },
        stoneBorder: "#EFE8DE",
        // Muted Luxury Gold Accent Palette
        gold: {
          50: "#FAF6EF",
          100: "#F0E7D4",
          200: "#E3CEAA",
          300: "#D5B682",
          DEFAULT: "#C5A880",
          500: "#B89667",
          600: "#A38051",
          700: "#86663E",
          800: "#684E30",
          900: "#4D3924",
        },
        // Off-White Background Canvas
        canvas: {
          DEFAULT: "#FBF9F5",
          subtle: "#F5EFEB",
          border: "#EFE8DE",
          card: "#FFFFFF",
        },
        // Status Colors
        emerald: {
          500: "#10B981",
          600: "#059669",
          700: "#047857",
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
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
        "5xl": "2.5rem",
        arch: "8rem 8rem 1.5rem 1.5rem",
      },
      boxShadow: {
        luxury: "0 10px 30px -10px rgba(28, 28, 28, 0.06)",
        "luxury-lg": "0 20px 45px -12px rgba(28, 28, 28, 0.09)",
        "gold-glow": "0 0 25px rgba(197, 168, 128, 0.28)",
        "gold-subtle": "0 4px 20px rgba(197, 168, 128, 0.15)",
        card: "0 2px 14px -2px rgba(28, 28, 28, 0.03)",
        soft: "0 4px 24px 0 rgba(0, 0, 0, 0.04)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #D5B682 0%, #C5A880 50%, #A38051 100%)",
        "gold-shimmer": "linear-gradient(90deg, #C5A880 0%, #F0E7D4 50%, #C5A880 100%)",
        "dark-gradient": "linear-gradient(180deg, #242424 0%, #161616 100%)",
        "cream-gradient": "linear-gradient(180deg, #FFFFFF 0%, #FAF7F2 100%)",
        "aramya-hero": "radial-gradient(ellipse at 70% 30%, rgba(249, 241, 237, 0.9) 0%, rgba(250, 247, 242, 0.98) 60%, #FAF7F2 100%)",
        "aramya-texture": "radial-gradient(circle at 10% 20%, rgba(232, 236, 230, 0.5) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(249, 241, 237, 0.6) 0%, transparent 50%)",
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
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        shimmer: "shimmer 2s infinite",
        fadeIn: "fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        float: "float 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
