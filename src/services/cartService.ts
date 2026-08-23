import { prisma } from "@/lib/prisma";

export class CartService {
  /**
   * Get or create active cart for user
   */
  static async getOrCreateCart(userId: string) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: { images: true },
            },
            variant: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: { include: { images: true } },
              variant: true,
            },
          },
        },
      });
    }

    return cart;
  }

  /**
   * Add or increment item in cart
   */
  static async addItem(
    userId: string,
    productId: string,
    variantId?: string | null,
    quantity: number = 1
  ) {
    const cart = await this.getOrCreateCart(userId);

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
        variantId: variantId || null,
      },
    });

    if (existingItem) {
      return prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    }

    return prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        variantId: variantId || null,
        quantity,
      },
    });
  }

  /**
   * Update item quantity
   */
  static async updateQuantity(cartItemId: string, quantity: number) {
    if (quantity <= 0) {
      return prisma.cartItem.delete({ where: { id: cartItemId } });
    }

    return prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });
  }

  /**
   * Remove item from cart
   */
  static async removeItem(cartItemId: string) {
    return prisma.cartItem.delete({ where: { id: cartItemId } });
  }

  /**
   * Synchronize guest localStorage cart with server database upon customer login
   */
  static async syncGuestCart(
    userId: string,
    guestItems: { productId: string; variantId?: string | null; quantity: number }[]
  ) {
    const cart = await this.getOrCreateCart(userId);

    for (const item of guestItems) {
      const existing = await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId: item.productId,
          variantId: item.variantId || null,
        },
      });

      if (existing) {
        await prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: Math.max(existing.quantity, item.quantity) },
        });
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: item.productId,
            variantId: item.variantId || null,
            quantity: item.quantity,
          },
        });
      }
    }

    return this.getOrCreateCart(userId);
  }
}
