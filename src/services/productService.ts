import { prisma } from "@/lib/prisma";
import { ProductFilterParams } from "@/types/product";
import { Prisma } from "@prisma/client";

export class ProductService {
  /**
   * Fetch products with faceted filtering, search, and sorting
   */
  static async getProducts(params: ProductFilterParams = {}) {
    const {
      category,
      minPrice,
      maxPrice,
      sizes,
      colors,
      sort = "newest",
      search,
      page = 1,
      limit = 12,
      tag,
    } = params;

    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
    };

    if (category) {
      where.category = {
        slug: category,
      };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {
        ...(minPrice !== undefined ? { gte: minPrice } : {}),
        ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
      };
    }

    if (tag) {
      where.tags = {
        has: tag,
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ];
    }

    if (sizes && sizes.length > 0) {
      where.variants = {
        some: {
          size: { in: sizes },
          stock: { gt: 0 },
        },
      };
    }

    if (colors && colors.length > 0) {
      where.variants = {
        ...where.variants,
        some: {
          ...(where.variants?.some || {}),
          color: { in: colors },
        },
      };
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };

    switch (sort) {
      case "price_asc":
        orderBy = { price: "asc" };
        break;
      case "price_desc":
        orderBy = { price: "desc" };
        break;
      case "popularity":
        orderBy = { isBestSeller: "desc" };
        break;
      default:
        orderBy = { createdAt: "desc" };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: true,
          images: {
            orderBy: { order: "asc" },
          },
          variants: true,
          reviews: {
            where: { isApproved: true },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Fetch single product by slug with all relations
   */
  static async getProductBySlug(slug: string) {
    return prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: {
          orderBy: { order: "asc" },
        },
        variants: true,
        reviews: {
          where: { isApproved: true },
          include: {
            user: {
              select: { name: true, avatar: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  /**
   * Fetch featured & trending collections for homepage showcases
   */
  static async getHomeShowcases() {
    const [featured, newArrivals, bestSellers, categories, banners] =
      await Promise.all([
        prisma.product.findMany({
          where: { isActive: true },
          orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
          take: 8,
          include: {
            images: { orderBy: { order: "asc" } },
            category: true,
            variants: true,
          },
        }),
        prisma.product.findMany({
          where: { isActive: true },
          orderBy: { createdAt: "desc" },
          take: 8,
          include: {
            images: { orderBy: { order: "asc" } },
            category: true,
            variants: true,
          },
        }),
        prisma.product.findMany({
          where: { isActive: true },
          orderBy: [{ isBestSeller: "desc" }, { createdAt: "desc" }],
          take: 8,
          include: {
            images: { orderBy: { order: "asc" } },
            category: true,
            variants: true,
          },
        }),
        prisma.category.findMany({
          where: { isActive: true },
          orderBy: { order: "asc" },
        }),
        prisma.banner.findMany({
          where: { isActive: true },
          orderBy: { order: "asc" },
        }),
      ]);

    return {
      featured,
      newArrivals,
      bestSellers,
      categories,
      banners,
    };
  }
}
