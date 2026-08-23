import type { Metadata } from "next";
import { Playfair_Display, Cinzel, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AppProviders } from "@/components/providers/AppProviders";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BUYERA | Luxury Women's Islamic & Modest Fashion",
  description:
    "Discover exquisite modest fashion, designer Abayas, luxury Silk Hijabs, and Pakistani Churidars at BUYERA India. Elegance. Modesty. You.",
  keywords: [
    "Abaya",
    "Hijab",
    "Pakistani Suit",
    "Churidar",
    "Modest Fashion",
    "Islamic Dresses",
    "Buyera",
  ],
  openGraph: {
    title: "BUYERA | Luxury Women's Islamic & Modest Fashion",
    description:
      "Curating high-end modesty and sophisticated Islamic couture with bespoke craftsmanship.",
    url: "https://buyera.in",
    siteName: "BUYERA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${cinzel.variable} ${jakarta.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-canvas text-charcoal selection:bg-gold selection:text-white">
        <AppProviders>
          <AnnouncementBar />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
