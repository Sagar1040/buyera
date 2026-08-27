import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const DEFAULT_SITE_SETTINGS = {
  id: "site_config",
  siteTitle: "BUYERA",
  siteTagline: "Elegance. Modesty. You.",
  logoUrl: "/logo.svg",
  faviconUrl: "/favicon.ico",
  announcementText: "Free Shipping across India | Extra 10% Off on First Order: Code ARAMYA10",
  announcementActive: true,
  supportEmail: "support@buyera.in",
  supportPhone: "+91 98765 43210",
  whatsappNumber: "+91 98765 43210",
  instagramUrl: "https://instagram.com/buyera.official",
  facebookUrl: "https://facebook.com/buyera.official",
  freeShippingThreshold: 999.0,
  standardShippingFee: 99.0,
  enableCOD: true,
  enableRazorpay: true,
  footerBio:
    "BUYERA is dedicated to bringing you the finest modest and ethnic fashion crafted with certified pure fabrics and bespoke tailoring.",
  storyBadge: "THE BUYERA PHILOSOPHY",
  storyTitle: "Modest Luxury Envisioned for Every Day",
  storyDescription: "Handcrafted premium modest fashion designed for everyday elegance.",
  storyImageUrl: "/story-image.jpg",
  storyStat1Number: "10,000+",
  storyStat1Label: "Happy Customers",
  storyStat2Number: "100%",
  storyStat2Label: "Pure Breathable Fabrics",
};

export async function GET() {
  try {
    try {
      const settings = await (prisma as any).siteSetting.findUnique({
        where: { id: "site_config" },
      });

      if (settings) {
        return NextResponse.json({ success: true, settings });
      }
    } catch (dbErr) {
      console.warn("Using fallback settings for public endpoint:", dbErr);
    }

    return NextResponse.json({ success: true, settings: DEFAULT_SITE_SETTINGS });
  } catch (error: any) {
    return NextResponse.json({ success: true, settings: DEFAULT_SITE_SETTINGS });
  }
}
