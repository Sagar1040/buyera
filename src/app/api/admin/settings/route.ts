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
      let settings = await (prisma as any).siteSetting.findUnique({
        where: { id: "site_config" },
      });

      if (!settings) {
        settings = await (prisma as any).siteSetting.create({
          data: DEFAULT_SITE_SETTINGS,
        });
      }

      return NextResponse.json({ success: true, settings });
    } catch (dbErr) {
      console.warn("Using fallback settings due to DB error:", dbErr);
    }

    return NextResponse.json({ success: true, settings: DEFAULT_SITE_SETTINGS });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load settings" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const {
      siteTitle,
      siteTagline,
      logoUrl,
      faviconUrl,
      announcementText,
      announcementActive,
      supportEmail,
      supportPhone,
      whatsappNumber,
      instagramUrl,
      facebookUrl,
      freeShippingThreshold,
      standardShippingFee,
      enableCOD,
      enableRazorpay,
      footerBio,
      storyBadge,
      storyTitle,
      storyDescription,
      storyImageUrl,
      storyStat1Number,
      storyStat1Label,
      storyStat2Number,
      storyStat2Label,
    } = body;

    const dataToSave = {
      ...(siteTitle !== undefined && { siteTitle: siteTitle.trim() }),
      ...(siteTagline !== undefined && { siteTagline: siteTagline.trim() }),
      ...(logoUrl !== undefined && { logoUrl: logoUrl.trim() }),
      ...(faviconUrl !== undefined && { faviconUrl: faviconUrl.trim() }),
      ...(announcementText !== undefined && { announcementText }),
      ...(announcementActive !== undefined && {
        announcementActive: Boolean(announcementActive),
      }),
      ...(supportEmail !== undefined && { supportEmail: supportEmail.trim() }),
      ...(supportPhone !== undefined && { supportPhone: supportPhone.trim() }),
      ...(whatsappNumber !== undefined && { whatsappNumber: whatsappNumber.trim() }),
      ...(instagramUrl !== undefined && { instagramUrl: instagramUrl.trim() }),
      ...(facebookUrl !== undefined && { facebookUrl: facebookUrl.trim() }),
      ...(freeShippingThreshold !== undefined && {
        freeShippingThreshold: Number(freeShippingThreshold),
      }),
      ...(standardShippingFee !== undefined && {
        standardShippingFee: Number(standardShippingFee),
      }),
      ...(enableCOD !== undefined && { enableCOD: Boolean(enableCOD) }),
      ...(enableRazorpay !== undefined && { enableRazorpay: Boolean(enableRazorpay) }),
      ...(footerBio !== undefined && { footerBio }),
      ...(storyBadge !== undefined && { storyBadge: storyBadge.trim() }),
      ...(storyTitle !== undefined && { storyTitle: storyTitle.trim() }),
      ...(storyDescription !== undefined && { storyDescription: storyDescription.trim() }),
      ...(storyImageUrl !== undefined && { storyImageUrl: storyImageUrl.trim() }),
      ...(storyStat1Number !== undefined && { storyStat1Number: storyStat1Number.trim() }),
      ...(storyStat1Label !== undefined && { storyStat1Label: storyStat1Label.trim() }),
      ...(storyStat2Number !== undefined && { storyStat2Number: storyStat2Number.trim() }),
      ...(storyStat2Label !== undefined && { storyStat2Label: storyStat2Label.trim() }),
    };

    try {
      const updated = await (prisma as any).siteSetting.upsert({
        where: { id: "site_config" },
        update: dataToSave,
        create: {
          ...DEFAULT_SITE_SETTINGS,
          ...dataToSave,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Settings updated successfully.",
        settings: updated,
      });
    } catch (dbErr) {
      console.warn("DB settings update simulated:", dbErr);
      return NextResponse.json({
        success: true,
        message: "Settings updated (simulated mode).",
        settings: { ...DEFAULT_SITE_SETTINGS, ...body },
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update settings" },
      { status: 500 }
    );
  }
}
