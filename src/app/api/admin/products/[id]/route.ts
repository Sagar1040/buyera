import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { deleteFromSupabase } from "@/lib/supabase-storage";

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

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: params.id }, { slug: params.id }],
      },
      include: {
        category: true,
        images: { orderBy: { order: "asc" } },
        variants: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("Failed to fetch product:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const {
      name,
      title,
      slug,
      sku,
      price,
      mrp,
      discountPrice,
      categoryId,
      description,
      shortDesc,
      fabricCare,
      tags,
      isActive,
      isFeatured,
      isNew,
      isBestSeller,
      images,
      variants,
    } = body;

    const productName = (name || title || "").trim();
    const parsedPrice = price !== undefined ? Number(price) : undefined;
    const parsedMrp =
      mrp !== undefined
        ? Number(mrp)
        : discountPrice !== undefined
        ? Number(discountPrice)
        : undefined;

    const parsedTags = Array.isArray(tags)
      ? tags
      : typeof tags === "string"
      ? tags.split(",").map((t: string) => t.trim()).filter(Boolean)
      : undefined;

    // Find actual product by ID or slug
    const existing = await prisma.product.findFirst({
      where: {
        OR: [{ id: params.id }, { slug: params.id }],
      },
    });

    const targetId = existing ? existing.id : params.id;

    // 1. Update core product attributes
    const updated = await prisma.product.update({
      where: { id: targetId },
      data: {
        ...(productName && { name: productName }),
        ...(slug && { slug: slug.trim() }),
        ...(sku && { sku: sku.trim() }),
        ...(parsedPrice !== undefined && { price: parsedPrice }),
        ...(parsedMrp !== undefined && { mrp: parsedMrp }),
        ...(categoryId && { categoryId }),
        ...(description !== undefined && { description }),
        ...(shortDesc !== undefined && { shortDesc }),
        ...(fabricCare !== undefined && { fabricCare }),
        ...(parsedTags !== undefined && { tags: parsedTags }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        ...(isFeatured !== undefined && { isFeatured: Boolean(isFeatured) }),
        ...(isNew !== undefined && { isNew: Boolean(isNew) }),
        ...(isBestSeller !== undefined && { isBestSeller: Boolean(isBestSeller) }),
      },
    });

    // 2. Sync Images if provided
    if (Array.isArray(images)) {
      const cleanImages = images
        .map((img) => (typeof img === "string" ? img.trim() : img?.url?.trim()))
        .filter((url) => Boolean(url && url.length > 0));

      if (cleanImages.length > 0) {
        // Remove existing images and re-insert in order
        await prisma.productImage.deleteMany({
          where: { productId: targetId },
        });

        await prisma.productImage.createMany({
          data: cleanImages.map((url, idx) => ({
            productId: targetId,
            url,
            order: idx,
            isPrimary: idx === 0,
          })),
        });
      }
    }

    // 3. Sync Variants if provided
    if (Array.isArray(variants) && variants.length > 0) {
      for (let idx = 0; idx < variants.length; idx++) {
        const v = variants[idx];
        const vSku = v.sku || `${updated.sku || "PROD"}-${v.size || "STD"}-${idx + 1}`;

        if (v.id && !v.id.startsWith("new-")) {
          // Update existing variant
          await prisma.productVariant.updateMany({
            where: { id: v.id, productId: targetId },
            data: {
              size: v.size || "Standard",
              color: v.color || "Default",
              colorHex: v.colorHex || "#121212",
              stock: Number(v.stock) || 0,
              sku: vSku,
              ...(v.price !== undefined && { price: Number(v.price) }),
            },
          });
        } else {
          // Create new variant
          await prisma.productVariant.create({
            data: {
              productId: targetId,
              size: v.size || "Standard",
              color: v.color || "Default",
              colorHex: v.colorHex || "#121212",
              stock: Number(v.stock) || 0,
              sku: `${vSku}-${Date.now().toString().slice(-4)}`,
              ...(v.price !== undefined && { price: Number(v.price) }),
            },
          });
        }
      }
    }

    // Fetch refreshed product with relations
    const finalProduct = await prisma.product.findUnique({
      where: { id: targetId },
      include: {
        category: true,
        images: { orderBy: { order: "asc" } },
        variants: true,
      },
    });

    triggerRevalidation(finalProduct?.slug);

    return NextResponse.json({
      success: true,
      message: "Product updated successfully.",
      product: finalProduct,
    });
  } catch (error: any) {
    console.error("Product update error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update product." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { isActive, isFeatured, isNew, isBestSeller, stock } = body;

    const existing = await prisma.product.findFirst({
      where: {
        OR: [{ id: params.id }, { slug: params.id }],
      },
      include: { variants: true },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    const updateData: any = {};
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);
    if (isFeatured !== undefined) updateData.isFeatured = Boolean(isFeatured);
    if (isNew !== undefined) updateData.isNew = Boolean(isNew);
    if (isBestSeller !== undefined) updateData.isBestSeller = Boolean(isBestSeller);

    const updated = await prisma.product.update({
      where: { id: existing.id },
      data: updateData,
    });

    // If stock override provided, update primary/all variants
    if (stock !== undefined && existing.variants.length > 0) {
      await prisma.productVariant.updateMany({
        where: { productId: existing.id },
        data: { stock: Number(stock) },
      });
    }

    triggerRevalidation(existing.slug);

    return NextResponse.json({
      success: true,
      message: "Product status updated successfully.",
      product: updated,
    });
  } catch (error: any) {
    console.error("Product quick PATCH error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update status." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const productId = params.id;

  try {
    try {
      await prisma.$transaction(async (tx) => {
        // Find existing product by ID or Slug
        const existing = await tx.product.findFirst({
          where: {
            OR: [{ id: productId }, { slug: productId }],
          },
          include: {
            variants: true,
            images: true,
          },
        });

        if (!existing) {
          // If not in DB, nothing further to delete
          return;
        }

        const realId = existing.id;
        const variantIds = existing.variants.map((v) => v.id);

        // Purge image files from Supabase Storage asynchronously
        if (existing.images && existing.images.length > 0) {
          for (const img of existing.images) {
            if (img.url) {
              await deleteFromSupabase(img.url).catch((e) =>
                console.warn("Storage purge warning:", e)
              );
            }
          }
        }

        // 1. Delete CartItems pointing to this product or any of its variants
        await tx.cartItem.deleteMany({
          where: {
            OR: [
              { productId: realId },
              ...(variantIds.length > 0 ? [{ variantId: { in: variantIds } }] : []),
            ],
          },
        });

        // 2. Unlink OrderItems referencing any variant of this product (to preserve historical order receipts)
        if (variantIds.length > 0) {
          await tx.orderItem.updateMany({
            where: {
              variantId: { in: variantIds },
            },
            data: {
              variantId: null,
            },
          });
        }

        // 3. Delete Wishlist items
        await tx.wishlistItem.deleteMany({
          where: { productId: realId },
        });

        // 4. Delete Reviews
        await tx.review.deleteMany({
          where: { productId: realId },
        });

        // 5. Delete Product Images
        await tx.productImage.deleteMany({
          where: { productId: realId },
        });

        // 6. Delete Product Variants
        await tx.productVariant.deleteMany({
          where: { productId: realId },
        });

        // 7. Delete the main Product record safely
        await tx.product.deleteMany({
          where: { id: realId },
        });
      });
    } catch (dbErr) {
      console.warn("Product DB delete warning:", dbErr);
    }

    triggerRevalidation();

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error: any) {
    console.error("Failed to delete product:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete product." },
      { status: 500 }
    );
  }
}
