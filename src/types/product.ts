export interface CategoryType {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  bannerUrl?: string | null;
  isActive: boolean;
  order: number;
}

export interface ProductImageType {
  id: string;
  url: string;
  altText?: string | null;
  order: number;
  isPrimary: boolean;
}

export interface ProductVariantType {
  id: string;
  productId: string;
  size: string;
  color: string;
  colorHex?: string | null;
  stock: number;
  sku: string;
  price?: number | null;
}

export interface ReviewType {
  id: string;
  userId: string;
  userName?: string;
  productId: string;
  rating: number;
  title: string;
  comment: string;
  isApproved: boolean;
  createdAt: string | Date;
}

export interface ProductType {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDesc?: string | null;
  fabricCare?: string | null;
  mrp: number;
  price: number;
  sku: string;
  isFeatured: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  isActive: boolean;
  tags: string[];
  categoryId: string;
  category?: CategoryType;
  images: ProductImageType[];
  variants: ProductVariantType[];
  reviews?: ReviewType[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ProductFilterParams {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  sort?: "newest" | "price_asc" | "price_desc" | "popularity" | "rating";
  search?: string;
  page?: number;
  limit?: number;
  tag?: string;
}
