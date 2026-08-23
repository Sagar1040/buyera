import { razorpay, verifyRazorpaySignature } from "@/lib/razorpay";
import { prisma } from "@/lib/prisma";
import { PaymentStatus } from "@prisma/client";

export class PaymentService {
  /**
   * Initializes a Razorpay order
   */
  static async createRazorpayOrder(amountInRupees: number, receiptId: string) {
    const amountInPaise = Math.round(amountInRupees * 100);

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: receiptId,
      notes: {
        platform: "BUYERA",
      },
    };

    const razorpayOrder = await razorpay.orders.create(options);
    return razorpayOrder;
  }

  /**
   * Validates Razorpay signature and records payment in database
   */
  static async processPaymentVerification({
    orderId,
    razorpayOrderId,
    razorpayPaymentId,
    signature,
  }: {
    orderId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    signature: string;
  }) {
    const isValid = verifyRazorpaySignature({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature,
    });

    if (!isValid) {
      throw new Error("Invalid Razorpay payment signature");
    }

    const payment = await prisma.payment.upsert({
      where: { razorpayOrderId },
      update: {
        razorpayPaymentId,
        signature,
        status: PaymentStatus.PAID,
      },
      create: {
        orderId,
        razorpayOrderId,
        razorpayPaymentId,
        signature,
        status: PaymentStatus.PAID,
        amount: 0, // Will match order total
      },
    });

    return { success: true, payment };
  }
}
