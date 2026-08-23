import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";
import { OrderStatus, PaymentStatus } from "@prisma/client";

export interface CreateOrderParams {
  userId: string;
  addressId: string;
  items: {
    productId: string;
    variantId?: string | null;
    quantity: number;
    price: number;
    name: string;
    size?: string | null;
    color?: string | null;
  }[];
  couponCode?: string | null;
  notes?: string | null;
}

export class OrderService {
  /**
   * Calculates subtotal, coupon discount, shipping, and total strictly server-side.
   */
  static async calculateOrderSummary(
    items: { productId: string; variantId?: string | null; quantity: number }[],
    couponCode?: string | null
  ) {
    let subtotal = 0;

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });
      if (!product) throw new Error(`Product not found: ${item.productId}`);

      let unitPrice = product.price;
      if (item.variantId) {
        const variant = await prisma.productVariant.findUnique({
          where: { id: item.variantId },
        });
        if (variant && variant.price) {
          unitPrice = variant.price;
        }
      }

      subtotal += unitPrice * item.quantity;
    }

    let discount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase() },
      });

      if (coupon && coupon.isActive && (!coupon.expiresAt || new Date(coupon.expiresAt) > new Date())) {
        if (subtotal >= coupon.minOrderValue) {
          if (coupon.discountType === "PERCENTAGE") {
            discount = (subtotal * coupon.discountValue) / 100;
            if (coupon.maxDiscount && discount > coupon.maxDiscount) {
              discount = coupon.maxDiscount;
            }
          } else {
            discount = coupon.discountValue;
          }
        }
      }
    }

    const freeShippingThreshold = 999;
    const shippingCost = subtotal >= freeShippingThreshold ? 0 : 99;
    const total = Math.max(0, subtotal - discount + shippingCost);

    return {
      subtotal,
      discount,
      shippingCost,
      total,
    };
  }

  /**
   * Creates an order with atomic stock auditing inside a transaction.
   */
  static async createOrder(params: CreateOrderParams) {
    const { userId, addressId, items, couponCode, notes } = params;

    const summary = await this.calculateOrderSummary(items, couponCode);
    const orderNumber = generateOrderNumber();

    return prisma.$transaction(async (tx) => {
      // 1. Audit stock for all variants
      for (const item of items) {
        if (item.variantId) {
          const variant = await tx.productVariant.findUnique({
            where: { id: item.variantId },
          });
          if (!variant || variant.stock < item.quantity) {
            throw new Error(`Insufficient stock for ${item.name} (${item.size || ""})`);
          }
        }
      }

      // 2. Create the order
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId,
          addressId,
          subtotal: summary.subtotal,
          discount: summary.discount,
          couponCode: couponCode || null,
          shippingCost: summary.shippingCost,
          total: summary.total,
          orderStatus: OrderStatus.PLACED,
          paymentStatus: PaymentStatus.PENDING,
          notes,
          items: {
            create: items.map((item) => ({
              variantId: item.variantId,
              name: item.name,
              size: item.size,
              color: item.color,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: true,
          shippingAddress: true,
        },
      });

      return order;
    });
  }

  /**
   * Finalizes order upon verified payment and decrements variant stock atomically.
   */
  static async finalizeOrderPayment(orderId: string, paymentId: string) {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      if (!order) throw new Error("Order not found");

      // Decrement inventory stock
      for (const item of order.items) {
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }

      // Update order & payment status
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          orderStatus: OrderStatus.CONFIRMED,
          paymentStatus: PaymentStatus.PAID,
          payment: {
            update: {
              status: PaymentStatus.PAID,
              razorpayPaymentId: paymentId,
            },
          },
        },
      });

      // Clear user cart
      await tx.cartItem.deleteMany({
        where: { cart: { userId: order.userId } },
      });

      return updatedOrder;
    });
  }
}
