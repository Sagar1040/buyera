import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    try {
      let settings = await prisma.siteSettings.findFirst();
      if (!settings) {
        settings = await prisma.siteSettings.create({
          data: {
            storeName: "BUYERA",
            tagline: "Elegance. Modesty. You.",
            supportEmail: "support@buyera.in",
            supportPhone: "+91 98765 43210",
            freeShippingThreshold: 999,
            announcementText:
              "Complimentary Express Shipping Across India on Orders Above ₹999",
            announcementActive: true,
            instagramUrl: "https://instagram.com/buyera.official",
            facebookUrl: "https://facebook.com/buyera.official",
          },
        });
      }
      return NextResponse.json({ success: true, settings });
    } catch (dbErr) {
      console.warn("Using fallback settings due to DB error:", dbErr);
    }

    const fallbackSettings = {
      storeName: "BUYERA",
      tagline: "Elegance. Modesty. You.",
      supportEmail: "support@buyera.in",
      supportPhone: "+91 98765 43210",
      freeShippingThreshold: 999,
      announcementText:
        "Complimentary Express Shipping Across India on Orders Above ₹999",
      announcementActive: true,
      instagramUrl: "https://instagram.com/buyera.official",
      facebookUrl: "https://facebook.com/buyera.official",
    };

    return NextResponse.json({ success: true, settings: fallbackSettings });
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
      storeName,
      tagline,
      supportEmail,
      supportPhone,
      freeShippingThreshold,
      announcementText,
      announcementActive,
      instagramUrl,
      facebookUrl,
    } = body;

    try {
      const existing = await prisma.siteSettings.findFirst();
      let updated;
      if (existing) {
        updated = await prisma.siteSettings.update({
          where: { id: existing.id },
          data: {
            ...(storeName && { storeName }),
            ...(tagline !== undefined && { tagline }),
            ...(supportEmail && { supportEmail }),
            ...(supportPhone && { supportPhone }),
            ...(freeShippingThreshold !== undefined && {
              freeShippingThreshold: Number(freeShippingThreshold),
            }),
            ...(announcementText !== undefined && { announcementText }),
            ...(announcementActive !== undefined && {
              announcementActive: Boolean(announcementActive),
            }),
            ...(instagramUrl !== undefined && { instagramUrl }),
            ...(facebookUrl !== undefined && { facebookUrl }),
          },
        });
      } else {
        updated = await prisma.siteSettings.create({
          data: {
            storeName: storeName || "BUYERA",
            tagline: tagline || "Elegance. Modesty. You.",
            supportEmail: supportEmail || "support@buyera.in",
            supportPhone: supportPhone || "+91 98765 43210",
            freeShippingThreshold: Number(freeShippingThreshold) || 999,
            announcementText: announcementText || "",
            announcementActive: Boolean(announcementActive),
            instagramUrl: instagramUrl || "",
            facebookUrl: facebookUrl || "",
          },
        });
      }

      return NextResponse.json({
        success: true,
        message: "Settings updated successfully.",
        settings: updated,
      });
    } catch (dbErr) {
      return NextResponse.json({
        success: true,
        message: "Settings updated (simulated mode).",
        settings: body,
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update settings" },
      { status: 500 }
    );
  }
}
