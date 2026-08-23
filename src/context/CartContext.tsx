"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ProductType, ProductVariantType } from "@/types/product";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  mrp: number;
  image: string;
  size?: string;
  color?: string;
  variantId?: string | null;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (
    product: ProductType,
    options?: {
      variant?: ProductVariantType | null;
      size?: string;
      color?: string;
      quantity?: number;
    }
  ) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  discount: number;
  couponCode: string | null;
  shipping: number;
  total: number;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "buyera_cart_v1";
const COUPON_STORAGE_KEY = "buyera_coupon_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [discount, setDiscount] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
      const storedCoupon = localStorage.getItem(COUPON_STORAGE_KEY);
      if (storedCoupon) {
        setCouponCode(storedCoupon);
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [items, isLoaded]);

  // Recalculate discount whenever items or coupon change
  useEffect(() => {
    const sub = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    if (couponCode === "BUYERA10") {
      const disc = sub >= 1999 ? Math.min(1000, Math.round((sub * 10) / 100)) : 0;
      setDiscount(disc);
    } else if (couponCode === "ROYAL500") {
      const disc = sub >= 3999 ? 500 : 0;
      setDiscount(disc);
    } else {
      setDiscount(0);
    }
  }, [items, couponCode]);

  const addToCart = (
    product: ProductType,
    options?: {
      variant?: ProductVariantType | null;
      size?: string;
      color?: string;
      quantity?: number;
    }
  ) => {
    const quantity = options?.quantity || 1;
    const size = options?.size || options?.variant?.size || "Standard";
    const color = options?.color || options?.variant?.color || "Default";
    const variantId = options?.variant?.id || null;
    const price = options?.variant?.price || product.price;

    const primaryImage =
      product.images?.find((img) => img.isPrimary)?.url ||
      product.images?.[0]?.url ||
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop";

    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) =>
          i.productId === product.id &&
          i.size === size &&
          i.color === color &&
          i.variantId === variantId
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price,
        mrp: product.mrp,
        image: primaryImage,
        size,
        color,
        variantId,
        quantity,
      };

      return [...prev, newItem];
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode(null);
    setDiscount(0);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
      localStorage.removeItem(COUPON_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  const applyCoupon = async (code: string) => {
    const formatted = code.toUpperCase().trim();
    const sub = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    if (formatted === "BUYERA10") {
      if (sub < 1999) {
        return {
          success: false,
          message: "BUYERA10 requires a minimum order value of ₹1,999",
        };
      }
      setCouponCode(formatted);
      localStorage.setItem(COUPON_STORAGE_KEY, formatted);
      return { success: true, message: "Coupon applied: 10% Off!" };
    }

    if (formatted === "ROYAL500") {
      if (sub < 3999) {
        return {
          success: false,
          message: "ROYAL500 requires a minimum order value of ₹3,999",
        };
      }
      setCouponCode(formatted);
      localStorage.setItem(COUPON_STORAGE_KEY, formatted);
      return { success: true, message: "Coupon applied: ₹500 Flat Off!" };
    }

    return { success: false, message: "Invalid or expired promotional code" };
  };

  const removeCoupon = () => {
    setCouponCode(null);
    setDiscount(0);
    try {
      localStorage.removeItem(COUPON_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeShippingThreshold = 999;
  const shipping = subtotal === 0 || subtotal >= freeShippingThreshold ? 0 : 99;
  const total = Math.max(0, subtotal - discount + shipping);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        subtotal,
        discount,
        couponCode,
        shipping,
        total,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
