import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("=================================================");
  console.log("🧹 Starting BUYERA Database Cleanup Routine...");
  console.log("=================================================");

  try {
    // 1. Clean Products and All Related Child Records
    console.log("1️⃣ Purging demo products and dependent records...");
    await prisma.cartItem.deleteMany({});
    await prisma.wishlistItem.deleteMany({});
    await prisma.review.deleteMany({});
    await prisma.productImage.deleteMany({});
    await prisma.productVariant.deleteMany({});
    await prisma.orderItem.deleteMany({});
    const deletedProducts = await prisma.product.deleteMany({});
    console.log(`   ✓ Removed ${deletedProducts.count} demo products.`);

    // 2. Clean Non-Admin Orders & Shipments
    console.log("2️⃣ Purging demo orders & payments...");
    await prisma.shipment.deleteMany({});
    await prisma.payment.deleteMany({});
    const deletedOrders = await prisma.order.deleteMany({});
    console.log(`   ✓ Removed ${deletedOrders.count} demo orders.`);

    // 3. Clean Non-Admin Users
    console.log("3️⃣ Purging test customer accounts and keeping Admins...");
    await prisma.couponUsage.deleteMany({});
    await prisma.cart.deleteMany({});

    const nonAdminUsers = await prisma.user.findMany({
      where: {
        AND: [
          { role: { not: Role.ADMIN } },
          { email: { notIn: ["admin@buyera.in", "sagar@buyera.in"] } },
        ],
      },
      select: { id: true },
    });

    const nonAdminIds = nonAdminUsers.map((u) => u.id);
    if (nonAdminIds.length > 0) {
      await prisma.address.deleteMany({
        where: { userId: { in: nonAdminIds } },
      });
      const deletedUsers = await prisma.user.deleteMany({
        where: { id: { in: nonAdminIds } },
      });
      console.log(`   ✓ Removed ${deletedUsers.count} non-admin test users.`);
    } else {
      console.log("   ✓ No non-admin test users to remove.");
    }

    // 4. Ensure Primary Admin Exists
    console.log("4️⃣ Ensuring primary admin account exists...");
    const adminPassword = await bcrypt.hash("Admin@BuyEra2026", 10);
    const admin = await prisma.user.upsert({
      where: { email: "admin@buyera.in" },
      update: {
        role: Role.ADMIN,
        name: "BUYERA Super Admin",
      },
      create: {
        name: "BUYERA Super Admin",
        email: "admin@buyera.in",
        password: adminPassword,
        role: Role.ADMIN,
        phone: "+91 98765 43210",
      },
    });
    console.log(`   ✓ Admin verified: ${admin.email} (Role: ${admin.role})`);

    // 5. Ensure Standard Categories are Seeded Cleanly
    console.log("5️⃣ Initializing fresh boutique categories...");
    const defaultCategories = [
      {
        name: "Luxury Abayas",
        slug: "abayas",
        description: "Pure Grade-A Korean Nida, Japanese Crepe, and Hand-Embroidered Zardozi Abayas.",
        imageUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
        order: 1,
      },
      {
        name: "Medina Silk Hijabs",
        slug: "hijabs",
        description: "Opaque, breathable Medina silk and modal cotton essential shaylas.",
        imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop",
        order: 2,
      },
      {
        name: "Pakistani Suits",
        slug: "pakistani-churidars",
        description: "Heavy embroidered lawn, organza, and velvet 3-piece formal ensembles.",
        imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
        order: 3,
      },
      {
        name: "Royal Kaftans",
        slug: "royal-kaftans",
        description: "Regal Moroccan kaftans with handcrafted sfifa gold braiding and cape drapes.",
        imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop",
        order: 4,
      },
      {
        name: "Islamic Dresses",
        slug: "islamic-dresses",
        description: "Modest maxi dresses, co-ord sets, and everyday contemporary silhouettes.",
        imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
        order: 5,
      },
    ];

    for (const cat of defaultCategories) {
      await prisma.category.upsert({
        where: { slug: cat.slug },
        update: {
          name: cat.name,
          description: cat.description,
          imageUrl: cat.imageUrl,
          isActive: true,
          order: cat.order,
        },
        create: {
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          imageUrl: cat.imageUrl,
          isActive: true,
          order: cat.order,
        },
      });
    }
    console.log("   ✓ Seeded 5 standard boutique categories.");

    console.log("=================================================");
    console.log("✨ Database cleanup & initialization completed successfully!");
    console.log("=================================================");
  } catch (error) {
    console.error("❌ Database cleanup failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
