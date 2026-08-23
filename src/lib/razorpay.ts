import Razorpay from "razorpay";
import crypto from "crypto";

export function getRazorpay(): Razorpay {
  const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder";
  const key_secret = process.env.RAZORPAY_KEY_SECRET || "rzp_secret_placeholder";

  return new Razorpay({
    key_id,
    key_secret,
  });
}

/**
 * Server-side HMAC SHA256 signature verification preventing client-side spoofing.
 */
export function verifyRazorpaySignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const keySecret = process.env.RAZORPAY_KEY_SECRET || "rzp_secret_placeholder";

  const payload = `${orderId}|${paymentId}`;
  const generatedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(payload)
    .digest("hex");

  return generatedSignature === signature;
}
