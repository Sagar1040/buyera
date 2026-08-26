"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ProductType, ProductVariantType } from "@/types/product";
import { useSettings } from "@/context/SettingsContext";

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
  const { settings } = useSettings();
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
    const sub = items.reduce((acc: number, item: CartItem) => acc + item.price * item.quantity, 0);

    if (couponCode === "ARAMYA10" || couponCode === "BUYERA10") {
      const disc = Math.round((sub * 10) / 100);
      setDiscount(disc);
    } else if (couponCode === "ROYAL500") {
      const disc = sub >= 3999 ? 500 : 0;
      setDiscount(disc);
    } else if (couponCode === "FESTIVE25" || couponCode === "ARAMYA25") {
      const disc = Math.round((sub * 25) / 100);
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
    const size = options?.size || "M";
    const color = options?.color || product.variants?.[0]?.color || "Standard";
    const quantity = options?.quantity || 1;
    const variantId = options?.variant?.id || null;

    const cartItemId = `${product.id}-${size}-${color}`;
    const image =
      product.images?.find((img: any) => img.isPrimary)?.url ||
      product.images?.[0]?.url ||
      "/placeholder.jpg";

    setItems((prev: CartItem[]) => {
      const existing = prev.find((i: CartItem) => i.id === cartItemId);
      if (existing) {
        return prev.map((i: CartItem) =>
          i.id === cartItemId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          productId: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          mrp: product.mrp,
          image,
          size,
          color,
          variantId,
          quantity,
        },
      ];
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prev: CartItem[]) =>
      prev.map((item: CartItem) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (id: string) => {
    setItems((prev: CartItem[]) => prev.filter((item: CartItem) => item.id !== id));
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

  const applyCoupon = async (
    code: string
  ): Promise<{ success: boolean; message: string }> => {
    const formatted = code.trim().toUpperCase();
    const sub = items.reduce((acc: number, item: CartItem) => acc + item.price * item.quantity, 0);

    if (formatted === "BUYERA10" || formatted === "ARAMYA10") {
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

    if (formatted === "FESTIVE25" || formatted === "ARAMYA25") {
      setCouponCode(formatted);
      localStorage.setItem(COUPON_STORAGE_KEY, formatted);
      return { success: true, message: "Coupon applied: 25% Off Festive Atelier!" };
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

  const cartCount = items.reduce((acc: number, item: CartItem) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc: number, item: CartItem) => acc + item.price * item.quantity, 0);
  const threshold = settings.freeShippingThreshold || 999;
  const standardFee = settings.standardShippingFee !== undefined ? settings.standardShippingFee : 99;
  const shipping = subtotal === 0 || subtotal >= threshold ? 0 : standardFee;
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
