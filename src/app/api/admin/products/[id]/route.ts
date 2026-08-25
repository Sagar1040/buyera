import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
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

    // 1. Update core product attributes
    const updated = await prisma.product.update({
      where: { id: params.id },
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
          where: { productId: params.id },
        });

        await prisma.productImage.createMany({
          data: cleanImages.map((url, idx) => ({
            productId: params.id,
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
          await prisma.productVariant.update({
            where: { id: v.id },
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
              productId: params.id,
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
      where: { id: params.id },
      include: {
        category: true,
        images: { orderBy: { order: "asc" } },
        variants: true,
      },
    });

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

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const productId = params.id;

  try {
    // Wrap entire cascade cleanup inside a Prisma interactive transaction ($transaction)
    await prisma.$transaction(async (tx) => {
      // 1. Delete CartItems pointing to this product or any of its variants
      await tx.cartItem.deleteMany({
        where: {
          OR: [
            { productId },
            { variant: { productId } },
          ],
        },
      });

      // 2. Unlink OrderItems referencing any variant of this product (to preserve order receipts)
      await tx.orderItem.updateMany({
        where: {
          variant: { productId },
        },
        data: {
          variantId: null,
        },
      });

      // 3. Delete Wishlist items
      await tx.wishlistItem.deleteMany({
        where: { productId },
      });

      // 4. Delete Reviews
      await tx.review.deleteMany({
        where: { productId },
      });

      // 5. Delete Product Images
      await tx.productImage.deleteMany({
        where: { productId },
      });

      // 6. Delete Product Variants
      await tx.productVariant.deleteMany({
        where: { productId },
      });

      // 7. Delete the main Product record
      await tx.product.delete({
        where: { id: productId },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error: any) {
    console.error("Failed to delete product:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}
