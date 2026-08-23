import { PrismaClient, Role, DiscountType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌸 Seeding BUYERA database...");

  // 1. Create Admin & Test Customer Users
  const adminPassword = await bcrypt.hash("Admin@Buyera2026", 10);
  const customerPassword = await bcrypt.hash("Customer@123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@buyera.in" },
    update: {},
    create: {
      name: "BUYERA Executive Admin",
      email: "admin@buyera.in",
      phone: "+919876543210",
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "aisha.khan@example.com" },
    update: {},
    create: {
      name: "Aisha Khan",
      email: "aisha.khan@example.com",
      phone: "+919811223344",
      password: customerPassword,
      role: Role.CUSTOMER,
      addresses: {
        create: {
          fullName: "Aisha Khan",
          phone: "+919811223344",
          houseFlat: "Flat 402, Royal Palms Residency",
          street: "80 Feet Road, 4th Block",
          area: "Koramangala",
          city: "Bengaluru",
          district: "Bengaluru Urban",
          state: "Karnataka",
          pinCode: "560034",
          isDefault: true,
        },
      },
    },
  });

  console.log("✅ Seeded Users:", { adminEmail: admin.email, customerEmail: customer.email });

  // 2. Create Categories
  const categories = [
    {
      name: "Luxury Abayas",
      slug: "abayas",
      description: "Embroidered, front-open, and kimono cut luxury abayas in Korean Nida & silk.",
      imageUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
      order: 1,
    },
    {
      name: "Premium Hijabs",
      slug: "hijabs",
      description: "Pure Medina silk, modal cotton, and luxury georgette shaylas.",
      imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop",
      order: 2,
    },
    {
      name: "Pakistani Churidars",
      slug: "pakistani-churidars",
      description: "Handcrafted lawn, organza, and velvet 3-piece designer festive suits.",
      imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
      order: 3,
    },
    {
      name: "Islamic Dresses",
      slug: "islamic-dresses",
      description: "Flowing floor-length maxi gowns and modest evening silhouettes.",
      imageUrl: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop",
      order: 4,
    },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }

  console.log("✅ Seeded Categories");

  // 3. Create Sample Products & Variant Matrix
  const abayaCat = await prisma.category.findUnique({ where: { slug: "abayas" } });
  const hijabCat = await prisma.category.findUnique({ where: { slug: "hijabs" } });

  if (abayaCat) {
    await prisma.product.upsert({
      where: { slug: "royal-emerald-hand-embroidered-abaya" },
      update: {},
      create: {
        name: "Royal Emerald Hand-Embroidered Abaya",
        slug: "royal-emerald-hand-embroidered-abaya",
        description: "Crafted from premium Korean Nida fabric featuring intricate gold zardozi cuff embroidery and a complimentary matching silk chiffon shayla.",
        shortDesc: "Korean Nida Abaya with hand-embroidered metallic zardozi cuffs.",
        fabricCare: "Dry clean only. Steam iron inside out on low heat.",
        mrp: 6999,
        price: 4999,
        sku: "BUY-ABY-001",
        isFeatured: true,
        isNew: true,
        isBestSeller: true,
        categoryId: abayaCat.id,
        tags: ["abaya", "luxury", "emerald", "bestseller"],
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
              isPrimary: true,
              order: 1,
            },
            {
              url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop",
              isPrimary: false,
              order: 2,
            },
          ],
        },
        variants: {
          create: [
            { size: "52 (XS)", color: "Emerald Green", colorHex: "#0F3827", stock: 10, sku: "BUY-ABY-001-52" },
            { size: "54 (S)", color: "Emerald Green", colorHex: "#0F3827", stock: 15, sku: "BUY-ABY-001-54" },
            { size: "56 (M)", color: "Emerald Green", colorHex: "#0F3827", stock: 20, sku: "BUY-ABY-001-56" },
            { size: "58 (L)", color: "Emerald Green", colorHex: "#0F3827", stock: 8, sku: "BUY-ABY-001-58" },
          ],
        },
      },
    });
  }

  if (hijabCat) {
    await prisma.product.upsert({
      where: { slug: "pure-medina-silk-luxury-shayla-hijab" },
      update: {},
      create: {
        name: "Pure Medina Silk Luxury Shayla Hijab",
        slug: "pure-medina-silk-luxury-shayla-hijab",
        description: "Ultra-soft, opaque, and breathable pure Medina silk woven for effortless drapes and all-day royal comfort.",
        shortDesc: "Signature Medina Silk Shayla Hijab (190cm x 75cm).",
        fabricCare: "Gentle hand wash with mild detergent or dry clean.",
        mrp: 1499,
        price: 999,
        sku: "BUY-HJB-002",
        isFeatured: true,
        isNew: true,
        isBestSeller: true,
        categoryId: hijabCat.id,
        tags: ["hijab", "silk", "medina", "essential"],
        images: {
          create: [
            {
              url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop",
              isPrimary: true,
              order: 1,
            },
          ],
        },
        variants: {
          create: [
            { size: "One Size", color: "Champagne Ivory", colorHex: "#FBF9F5", stock: 50, sku: "BUY-HJB-002-IVR" },
            { size: "One Size", color: "Muted Gold", colorHex: "#C5A880", stock: 40, sku: "BUY-HJB-002-GLD" },
            { size: "One Size", color: "Midnight Charcoal", colorHex: "#121212", stock: 60, sku: "BUY-HJB-002-BLK" },
          ],
        },
      },
    });
  }

  console.log("✅ Seeded Products & Variants");

  // 4. Create Coupons
  await prisma.coupon.upsert({
    where: { code: "BUYERA10" },
    update: {},
    create: {
      code: "BUYERA10",
      discountType: DiscountType.PERCENTAGE,
      discountValue: 10,
      minOrderValue: 1999,
      maxDiscount: 1000,
      isActive: true,
    },
  });

  await prisma.coupon.upsert({
    where: { code: "ROYAL500" },
    update: {},
    create: {
      code: "ROYAL500",
      discountType: DiscountType.FIXED,
      discountValue: 500,
      minOrderValue: 3999,
      isActive: true,
    },
  });

  console.log("✅ Seeded Promotional Coupons");

  // 5. Create Hero Banners
  await prisma.banner.createMany({
    data: [
      {
        title: "Timeless Elegance In Pure Silk & Chiffon",
        subtitle: "Handcrafted luxury abayas, embellished Pakistani silhouettes, and breathable artisanal hijabs.",
        badge: "FESTIVE COUTURE 2026",
        imageUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1800&auto=format&fit=crop",
        ctaText: "EXPLORE COLLECTION",
        ctaUrl: "/shop",
        order: 1,
      },
      {
        title: "The Royal Embellished Abaya Edit",
        subtitle: "Intricate pearl and gold thread embroidery engineered for weddings and auspicious occasions.",
        badge: "NEW SEASON ARRIVALS",
        imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1800&auto=format&fit=crop",
        ctaText: "DISCOVER ABAYAS",
        ctaUrl: "/category/abayas",
        order: 2,
      },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seeded Banners & CMS");
  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
