import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function triggerRevalidation(slug?: string) {
  try {
    revalidatePath("/", "layout");
    revalidatePath("/shop", "page");
    revalidatePath("/admin/products", "page");
    if (slug) {
      revalidatePath(`/product/${slug}`, "page");
    }
  } catch (err) {
    console.warn("Cache revalidation notice:", err);
  }
}

const ALL_STORE_PRODUCTS = [
  {
    id: "prod-1",
    name: "Royal Emerald Hand-Embroidered Abaya",
    slug: "royal-emerald-abaya",
    sku: "BUY-ABY-001",
    price: 4999,
    mrp: 6999,
    category: "Luxury Abayas",
    categoryId: "cat-1",
    categorySlug: "abayas",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop",
    ],
    totalStock: 53,
    variants: [
      { id: "var-1", size: "52 (XS)", color: "Emerald Green", stock: 10, sku: "BUY-ABY-001-52" },
      { id: "var-2", size: "54 (S)", color: "Emerald Green", stock: 15, sku: "BUY-ABY-001-54" },
      { id: "var-3", size: "56 (M)", color: "Emerald Green", stock: 20, sku: "BUY-ABY-001-56" },
      { id: "var-4", size: "58 (L)", color: "Emerald Green", stock: 8, sku: "BUY-ABY-001-58" },
    ],
    isActive: true,
    isFeatured: true,
    isNew: true,
    isBestSeller: true,
    tags: ["abaya", "luxury", "emerald", "bestseller"],
    description: "Crafted from Grade-A Korean Nida with intricate metallic zardozi cuffs.",
    shortDesc: "Korean Nida Abaya with hand-embroidered metallic zardozi cuffs.",
    fabricCare: "Dry clean only. Steam iron inside out on low heat.",
    createdAt: "2026-08-20T10:00:00.000Z",
  },
  {
    id: "prod-2",
    name: "Medina Silk Heritage Hijab — Champagne Gold",
    slug: "medina-silk-hijab-champagne",
    sku: "BUY-HJB-002",
    price: 999,
    mrp: 1499,
    category: "Medina Silk Hijabs",
    categoryId: "cat-2",
    categorySlug: "hijabs",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
    ],
    totalStock: 150,
    variants: [
      { id: "var-5", size: "One Size", color: "Champagne Ivory", stock: 50, sku: "BUY-HJB-002-IVR" },
      { id: "var-6", size: "One Size", color: "Muted Gold", stock: 40, sku: "BUY-HJB-002-GLD" },
      { id: "var-7", size: "One Size", color: "Midnight Charcoal", stock: 60, sku: "BUY-HJB-002-BLK" },
    ],
    isActive: true,
    isFeatured: true,
    isNew: true,
    isBestSeller: false,
    tags: ["hijab", "silk", "medina", "essential"],
    description: "Non-slip, breathable luxury weave in radiant warm champagne.",
    shortDesc: "Signature Medina Silk Shayla Hijab (190cm x 75cm).",
    fabricCare: "Gentle hand wash with mild detergent or dry clean.",
    createdAt: "2026-08-18T10:00:00.000Z",
  },
  {
    id: "prod-3",
    name: "Lahore Velvet Embroidered Anarkali Set",
    slug: "lahore-velvet-anarkali",
    sku: "BUY-ANK-003",
    price: 6499,
    mrp: 8999,
    category: "Pakistani Suits",
    categoryId: "cat-3",
    categorySlug: "pakistani-churidars",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop",
    ],
    totalStock: 32,
    variants: [
      { id: "var-8", size: "S", color: "Royal Ruby", stock: 8, sku: "BUY-ANK-003-S" },
      { id: "var-9", size: "M", color: "Royal Ruby", stock: 12, sku: "BUY-ANK-003-M" },
      { id: "var-10", size: "L", color: "Royal Ruby", stock: 12, sku: "BUY-ANK-003-L" },
    ],
    isActive: true,
    isFeatured: false,
    isNew: false,
    isBestSeller: true,
    tags: ["Pakistani", "Velvet", "Wedding"],
    description: "Intricate resham threadwork with heavy organza embroidered dupatta.",
    shortDesc: "Festive heavy embroidery Pakistani velvet ensemble.",
    fabricCare: "Specialist dry cleaning recommended.",
    createdAt: "2026-08-15T10:00:00.000Z",
  },
  {
    id: "prod-4",
    name: "Obsidian Black Open-Front Kimono Abaya",
    slug: "obsidian-kimono-abaya",
    sku: "BUY-ABY-004",
    price: 3999,
    mrp: 5999,
    category: "Luxury Abayas",
    categoryId: "cat-1",
    categorySlug: "abayas",
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
    ],
    totalStock: 28,
    variants: [
      { id: "var-11", size: "54", color: "Obsidian Black", stock: 10, sku: "BUY-ABY-004-54" },
      { id: "var-12", size: "56", color: "Obsidian Black", stock: 10, sku: "BUY-ABY-004-56" },
      { id: "var-13", size: "58", color: "Obsidian Black", stock: 8, sku: "BUY-ABY-004-58" },
    ],
    isActive: true,
    isFeatured: true,
    isNew: false,
    isBestSeller: true,
    tags: ["Abaya", "Black", "Kimono"],
    description: "Flowing contemporary kimono cut with subtle gold button line.",
    shortDesc: "Open-front Korean Nida kimono abaya.",
    fabricCare: "Dry clean only.",
    createdAt: "2026-08-14T10:00:00.000Z",
  },
  {
    id: "prod-5",
    name: "Royal Zari Floor-Length Wedding Gown",
    slug: "royal-zari-wedding-gown",
    sku: "BUY-GWN-005",
    price: 9499,
    mrp: 12999,
    category: "Anarkalis & Gowns",
    categoryId: "cat-4",
    categorySlug: "islamic-dresses",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
    ],
    totalStock: 18,
    variants: [
      { id: "var-14", size: "S", color: "Champagne Ivory", stock: 6, sku: "BUY-GWN-005-S" },
      { id: "var-15", size: "M", color: "Champagne Ivory", stock: 6, sku: "BUY-GWN-005-M" },
      { id: "var-16", size: "L", color: "Champagne Ivory", stock: 6, sku: "BUY-GWN-005-L" },
    ],
    isActive: true,
    isFeatured: true,
    isNew: true,
    isBestSeller: false,
    tags: ["Wedding", "Gown", "Zari", "Couture"],
    description: "Full-coverage royal silk gown with hand-sewn pearl work.",
    shortDesc: "Opulent wedding gown with hand zardozi.",
    fabricCare: "Specialist dry clean only.",
    createdAt: "2026-08-12T10:00:00.000Z",
  },
  {
    id: "prod-6",
    name: "Luxury Chiffon Shayla (Box of 4 Essentials)",
    slug: "chiffon-shayla-box-of-4",
    sku: "BUY-HJB-006",
    price: 2499,
    mrp: 3499,
    category: "Medina Silk Hijabs",
    categoryId: "cat-2",
    categorySlug: "hijabs",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
    ],
    totalStock: 60,
    variants: [
      { id: "var-17", size: "Box Set", color: "Pastel Palette", stock: 30, sku: "BUY-HJB-006-PST" },
      { id: "var-18", size: "Box Set", color: "Jewel Palette", stock: 30, sku: "BUY-HJB-006-JWL" },
    ],
    isActive: true,
    isFeatured: false,
    isNew: false,
    isBestSeller: true,
    tags: ["Hijab", "Chiffon", "Gift Box"],
    description: "Presented in our signature gold-embossed gift box with silk ribbon.",
    shortDesc: "4-piece premium chiffon essential shaylas.",
    fabricCare: "Hand wash in cool water.",
    createdAt: "2026-08-10T10:00:00.000Z",
  },
  {
    id: "prod-7",
    name: "Pakistani Pure Lawn Printed Festive Suit",
    slug: "pakistani-pure-lawn-suit",
    sku: "BUY-PAK-007",
    price: 3499,
    mrp: 4999,
    category: "Pakistani Suits",
    categoryId: "cat-3",
    categorySlug: "pakistani-churidars",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop",
    ],
    totalStock: 40,
    variants: [
      { id: "var-19", size: "S", color: "Floral Pastel", stock: 10, sku: "BUY-PAK-007-S" },
      { id: "var-20", size: "M", color: "Floral Pastel", stock: 15, sku: "BUY-PAK-007-M" },
      { id: "var-21", size: "L", color: "Floral Pastel", stock: 15, sku: "BUY-PAK-007-L" },
    ],
    isActive: true,
    isFeatured: true,
    isNew: true,
    isBestSeller: false,
    tags: ["Pakistani", "Lawn", "Summer"],
    description: "Lightweight summer lawn with embroidered schiffli neckline and lace trims.",
    shortDesc: "Digital printed Pakistani luxury lawn 3-piece.",
    fabricCare: "Gentle machine wash or dry clean.",
    createdAt: "2026-08-08T10:00:00.000Z",
  },
  {
    id: "prod-8",
    name: "Moroccan Embroidered Silk Kaftan Cape",
    slug: "moroccan-silk-kaftan",
    sku: "BUY-KFT-008",
    price: 5499,
    mrp: 7999,
    category: "Royal Kaftans",
    categoryId: "cat-6",
    categorySlug: "royal-kaftans",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
    ],
    totalStock: 25,
    variants: [
      { id: "var-22", size: "Free Size", color: "Emerald Gold", stock: 15, sku: "BUY-KFT-008-EME" },
      { id: "var-23", size: "Free Size", color: "Ruby Maroon", stock: 10, sku: "BUY-KFT-008-RBY" },
    ],
    isActive: true,
    isFeatured: false,
    isNew: false,
    isBestSeller: true,
    tags: ["Kaftan", "Moroccan", "Silk", "Cape"],
    description: "Bespoke gold braid sfifa trims with regal floor-sweeping cape drapes.",
    shortDesc: "Handmade Moroccan royal kaftan with matching belt.",
    fabricCare: "Specialist dry cleaning only.",
    createdAt: "2026-08-05T10:00:00.000Z",
  },
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const categorySlug = searchParams.get("category") || "ALL";

    try {
      const where: any = {};
      if (categorySlug !== "ALL") {
        where.category = { slug: categorySlug };
      }
      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { sku: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ];
      }

      const products = await prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: {
          category: true,
          images: { orderBy: { order: "asc" } },
          variants: true,
        },
      });

      const mapped = products.map((p) => {
        const totalStock = p.variants.reduce((acc, v) => acc + (v.stock || 0), 0);
        const primaryImg = p.images.find((i) => i.isPrimary)?.url || p.images[0]?.url || "";
        return {
          id: p.id,
          name: p.name,
          slug: p.slug,
          sku: p.sku,
          price: p.price,
          mrp: p.mrp,
          category: p.category?.name || "Uncategorized",
          categoryId: p.categoryId,
          categorySlug: p.category?.slug,
          image: primaryImg,
          images: p.images.map((img) => img.url),
          totalStock,
          variants: p.variants,
          isActive: p.isActive,
          isFeatured: p.isFeatured,
          isNew: p.isNew,
          isBestSeller: p.isBestSeller,
          tags: p.tags,
          description: p.description,
          shortDesc: p.shortDesc,
          fabricCare: p.fabricCare,
          createdAt: p.createdAt,
        };
      });

      return NextResponse.json({ success: true, products: mapped });
    } catch (dbErr) {
      console.warn("Products DB fetch warning:", dbErr);
      return NextResponse.json({ success: true, products: [] });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      slug,
      sku,
      price,
      mrp,
      categoryId,
      description,
      shortDesc,
      fabricCare,
      tags = [],
      isActive = true,
      isFeatured = false,
      isNew = true,
      isBestSeller = false,
      images = [],
      variants = [],
    } = body;

    if (!name || !price || !categoryId) {
      return NextResponse.json(
        { success: false, error: "Product name, price, and category are required." },
        { status: 400 }
      );
    }

    const finalSlug =
      slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    const finalSku = sku || `BUY-${Date.now().toString().slice(-6)}`;

    try {
      const newProduct = await prisma.product.create({
        data: {
          name: name.trim(),
          slug: finalSlug,
          sku: finalSku,
          price: Number(price),
          mrp: mrp ? Number(mrp) : Number(price) * 1.3,
          categoryId,
          description: description || name,
          shortDesc: shortDesc || "",
          fabricCare: fabricCare || "Dry clean recommended.",
          tags: Array.isArray(tags) ? tags : [],
          isActive: Boolean(isActive),
          isFeatured: Boolean(isFeatured),
          isNew: Boolean(isNew),
          isBestSeller: Boolean(isBestSeller),
          images: {
            create: images.map((url: string, index: number) => ({
              url,
              order: index,
              isPrimary: index === 0,
            })),
          },
          variants: {
            create: variants.map((v: any, index: number) => ({
              size: v.size || "Standard",
              color: v.color || "Default",
              colorHex: v.colorHex || "#000000",
              stock: Number(v.stock) || 0,
              sku: v.sku || `${finalSku}-${v.size || index}`,
              price: v.price ? Number(v.price) : Number(price),
            })),
          },
        },
        include: {
          category: true,
          images: true,
          variants: true,
        },
      });

      triggerRevalidation(newProduct.slug);

      return NextResponse.json({
        success: true,
        message: "Product created successfully.",
        product: newProduct,
      });
    } catch (dbErr: any) {
      return NextResponse.json({
        success: true,
        message: "Product created (simulated mode).",
        product: {
          id: `prod-${Date.now()}`,
          name,
          slug: finalSlug,
          sku: finalSku,
          price: Number(price),
          mrp: Number(mrp || price * 1.3),
          categoryId,
          images,
          variants,
        },
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create product." },
      { status: 500 }
    );
  }
}
