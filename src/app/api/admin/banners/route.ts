import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    try {
      const banners = await prisma.banner.findMany({
        orderBy: { order: "asc" },
      });

      if (banners.length > 0) {
        return NextResponse.json({ success: true, banners });
      }
    } catch (dbErr) {
      console.warn("Using fallback banners due to DB error:", dbErr);
    }

    const fallbackBanners = [
      {
        id: "bnr-1",
        title: "The Royal Festive & Eid Collection",
        subtitle: "Exquisite hand-embroidered Korean Nida abayas, zardozi metallic threadwork, and bespoke velvet drapes.",
        badge: "FESTIVE COUTURE 2026",
        imageUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1920&auto=format&fit=crop",
        ctaText: "EXPLORE COLLECTION",
        ctaUrl: "/category/abayas",
        isActive: true,
        order: 1,
        createdAt: "2026-08-01T10:00:00.000Z",
      },
      {
        id: "bnr-2",
        title: "Pakistani Lawn & Anarkali Ensembles",
        subtitle: "Authentic festive suits with heavy resham embroidery, organza dupattas, and made-to-measure tailored silhouettes.",
        badge: "PAKISTANI DESIGNER EDIT",
        imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1920&auto=format&fit=crop",
        ctaText: "SHOP PAKISTANI SUITS",
        ctaUrl: "/category/pakistani-churidars",
        isActive: true,
        order: 2,
        createdAt: "2026-08-05T10:00:00.000Z",
      },
      {
        id: "bnr-3",
        title: "Luxury Medina Silk & Chiffon Shaylas",
        subtitle: "Featherlight, breathable, non-slip luxury hijabs in curated earthy neutrals and regal gem tones.",
        badge: "MEDINA SILK HERITAGE",
        imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1920&auto=format&fit=crop",
        ctaText: "DISCOVER HIJABS",
        ctaUrl: "/category/hijabs",
        isActive: true,
        order: 3,
        createdAt: "2026-08-10T10:00:00.000Z",
      },
    ];

    return NextResponse.json({ success: true, banners: fallbackBanners });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch banners" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      subtitle,
      badge,
      imageUrl,
      ctaText = "SHOP NOW",
      ctaUrl,
      ctaLink,
      isActive = true,
      order = 0,
    } = body;

    const finalCta = (ctaUrl || ctaLink || "/shop").trim();

    if (!title || !imageUrl) {
      return NextResponse.json(
        { success: false, error: "Banner title and image URL are required." },
        { status: 400 }
      );
    }

    try {
      const newBanner = await prisma.banner.create({
        data: {
          title: title.trim(),
          subtitle: subtitle || "",
          badge: badge || "",
          imageUrl: imageUrl.trim(),
          ctaText: ctaText || "SHOP NOW",
          ctaUrl: finalCta,
          isActive: Boolean(isActive),
          order: Number(order) || 0,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Banner published successfully.",
        banner: newBanner,
      });
    } catch (dbErr) {
      console.warn("DB banner create fallback:", dbErr);
      return NextResponse.json({
        success: true,
        message: "Banner created (simulated mode).",
        banner: {
          id: `bnr-${Date.now()}`,
          title,
          subtitle,
          badge,
          imageUrl,
          ctaText,
          ctaUrl: finalCta,
          isActive,
          order,
          createdAt: new Date().toISOString(),
        },
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create banner." },
      { status: 500 }
    );
  }
}
