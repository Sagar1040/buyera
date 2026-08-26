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
  const heights = {
    sm: "h-7",
    md: "h-9 sm:h-10",
    lg: "h-12 sm:h-14",
    xl: "h-16 sm:h-20",
  };

  if (variant === "icon") {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <svg
          viewBox="0 0 500 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${heights[size]} w-auto aspect-square`}
        >
          {/* Bag Handle */}
          <path
            d="M205 135 C205 70, 295 70, 295 135"
            stroke="#1E75FF"
            strokeWidth="20"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="205" cy="140" r="10" fill="#1E75FF" />
          <circle cx="295" cy="140" r="10" fill="#1E75FF" />

          {/* Left Orange Bag Fold */}
          <path
            d="M150 95 L45 385 L85 415 L145 155 Z"
            fill="#FF6A00"
          />

          {/* Main Blue Bag Frame */}
          <path
            d="M160 100 L130 425 L375 405 L150 435 L335 125 Z"
            fill="#1E75FF"
          />

          {/* Inner Bag White Cutout */}
          <path
            d="M165 120 L140 405 L350 385 Z"
            fill="#FFFFFF"
          />

          {/* Letter 'B' in Blue */}
          <path
            d="M160 170 H275 C320 170, 345 195, 345 235 C345 260, 330 280, 305 290 C335 300, 350 325, 350 360 C350 405, 315 430, 265 430 H140 L160 170 Z M215 220 L205 275 H260 C275 275, 285 265, 285 250 C285 235, 275 220, 260 220 H215 Z M200 320 L190 380 H265 C280 380, 290 370, 290 350 C290 330, 280 320, 265 320 H200 Z"
            fill="#1E75FF"
          />

          {/* Speed Bars forming 'E' in Orange */}
          <path
            d="M315 170 H470 L460 220 H335 Z"
            fill="#FF6A00"
          />
          <path
            d="M330 245 H450 L440 295 H325 Z"
            fill="#FF6A00"
          />
          <path
            d="M310 325 H440 L430 375 H300 Z"
            fill="#FF6A00"
          />
          <path
            d="M290 400 H430 L420 445 H280 Z"
            fill="#FF6A00"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-start ${className}`}>
      <svg
        viewBox="0 0 1050 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${heights[size]} w-auto max-w-full`}
      >
        {/* ================= LETTER 'B' (Blue) ================= */}
        <path
          d="M100 150 L65 330 H195 C230 330, 255 315, 260 285 C265 260, 250 245, 230 238 C248 230, 258 215, 255 192 C250 162, 225 150, 185 150 H100 Z M145 188 H175 C188 188, 195 194, 193 205 C190 218, 180 225, 168 225 H138 L145 188 Z M133 255 H168 C182 255, 190 262, 188 275 C185 288, 175 295, 160 295 H125 L133 255 Z"
          fill="#1E75FF"
        />

        {/* ================= LETTERS 'uy' (Orange) ================= */}
        {/* Letter 'u' */}
        <path
          d="M275 210 L258 295 C255 312, 262 330, 288 330 C310 330, 325 315, 330 295 L345 210 H312 L300 282 C298 292, 292 298, 282 298 C275 298, 272 292, 273 282 L288 210 H255 L275 210 Z"
          fill="#FF6A00"
        />

        {/* Letter 'y' */}
        <path
          d="M355 210 L378 285 L425 210 H458 L390 312 L372 370 H338 L355 315 L325 210 H355 Z"
          fill="#FF6A00"
        />

        {/* ================= TILTED SHOPPING BAG ================= */}
        {/* Bag Handle */}
        <path
          d="M620 120 C625 30, 715 35, 700 125"
          stroke="#1E75FF"
          strokeWidth="15"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="623" cy="125" r="8" fill="#1E75FF" />
        <circle cx="698" cy="130" r="8" fill="#1E75FF" />

        {/* Left Orange Bag Crease */}
        <path
          d="M570 75 L465 330 L495 365 L545 130 Z"
          fill="#FF6A00"
        />

        {/* Outer Blue Bag Outline */}
        <path
          d="M580 80 L520 375 L750 355 L510 375 L730 110 Z"
          fill="#1E75FF"
        />

        {/* ================= LETTER 'E' INSIDE BAG (Orange) ================= */}
        <path
          d="M575 150 L540 330 H750 L755 285 H605 L610 255 H730 L735 215 H618 L623 190 H750 L755 150 H575 Z"
          fill="#FF6A00"
        />

        {/* ================= LETTERS 'RA' (Blue) ================= */}
        {/* Letter 'R' */}
        <path
          d="M775 210 L752 330 H788 L798 280 H820 L840 330 H880 L855 272 C872 265, 882 250, 885 232 C890 205, 868 210, 835 210 H775 Z M812 232 H835 C845 232, 852 238, 850 248 C848 258, 840 262, 830 262 H806 L812 232 Z"
          fill="#1E75FF"
        />

        {/* Letter 'A' */}
        <path
          d="M890 330 L935 210 H975 L995 330 H958 L952 295 H925 L918 330 H890 Z M932 268 H948 L942 235 Z"
          fill="#1E75FF"
        />

        {/* Trailing Speed Line underneath Bag */}
        <path
          d="M500 355 L780 350 L530 375 Z"
          fill="#1E75FF"
        />
      </svg>

      {showTagline && (
        <span className="text-[9px] uppercase tracking-[0.3em] text-charcoal/60 font-sans font-medium pl-1 -mt-1">
          {settings.siteTagline || "Elegance • Modesty • You"}
        </span>
      )}
    </div>
  );
}
