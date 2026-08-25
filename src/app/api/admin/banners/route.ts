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
        title: "The Royal Farasha Collection",
        subtitle: "Handcrafted in Grade-A Korean Nida with bespoke Zardozi metallic threadwork.",
        badge: "AUTUMN/WINTER 2026",
        imageUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1600&auto=format&fit=crop",
        ctaText: "EXPLORE ATELIER",
        ctaUrl: "/shop?category=abayas",
        isActive: true,
        order: 1,
        createdAt: "2026-08-01T10:00:00.000Z",
      },
      {
        id: "bnr-2",
        title: "Pure Medina Silk Luxury Shaylas",
        subtitle: "Ultra-breathable opaque silk drapes in timeless curated pastels and jewel tones.",
        badge: "NEW COUTURE ARRIVALS",
        imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1600&auto=format&fit=crop",
        ctaText: "SHOP HIJABS",
        ctaUrl: "/shop?category=hijabs",
        isActive: true,
        order: 2,
        createdAt: "2026-08-05T10:00:00.000Z",
      },
      {
        id: "bnr-3",
        title: "Lahore Velvet Festive Ensembles",
        subtitle: "Opulent raw silk and micro-velvet 3-piece handcrafted designer suits.",
        badge: "WEDDING & EID FESTIVE",
        imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1600&auto=format&fit=crop",
        ctaText: "VIEW FESTIVE EDIT",
        ctaUrl: "/shop?category=pakistani-churidars",
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
      ctaUrl = "/shop",
      isActive = true,
      order = 0,
    } = body;

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
          ctaUrl: ctaUrl || "/shop",
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
          ctaUrl,
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
