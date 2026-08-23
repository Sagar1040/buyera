import { ProductType, ProductVariantType } from "./product";

export interface CartItemType {
  id: string;
  cartId?: string;
  productId: string;
  product: ProductType;
  variantId?: string | null;
  variant?: ProductVariantType | null;
  quantity: number;
}

export interface CartType {
  id: string;
  userId: string;
  items: CartItemType[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}
