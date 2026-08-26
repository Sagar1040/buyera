import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("=================================================");
  console.log("🧹 Wiping ALL Demo Banners & Demo Categories...");
  console.log("=================================================");

  try {
    // 1. Delete all existing Banners
    console.log("1️⃣ Purging all banner records...");
    const deletedBanners = await prisma.banner.deleteMany({});
    console.log(`   ✓ Deleted ${deletedBanners.count} banner records.`);

    // 2. Unlink any remaining products before category deletion
    console.log("2️⃣ Checking and unlinking any products...");
    await prisma.cartItem.deleteMany({});
    await prisma.wishlistItem.deleteMany({});
    await prisma.review.deleteMany({});
    await prisma.productImage.deleteMany({});
    await prisma.productVariant.deleteMany({});
    await prisma.orderItem.deleteMany({});
    const deletedProducts = await prisma.product.deleteMany({});
    console.log(`   ✓ Removed ${deletedProducts.count} remaining product records.`);

    // 3. Delete all Categories
    console.log("3️⃣ Purging all category records...");
    const deletedCategories = await prisma.category.deleteMany({});
    console.log(`   ✓ Deleted ${deletedCategories.count} category records.`);

    console.log("=================================================");
    console.log("✨ All demo banners and categories wiped successfully!");
    console.log("🚀 Database is 100% clean and ready for real content via /admin.");
    console.log("=================================================");
  } catch (error) {
    console.error("❌ Cleanup failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
