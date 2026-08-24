import Razorpay from "razorpay";
import crypto from "crypto";

export function getRazorpay(): Razorpay {
  const key_id =
    process.env.RAZORPAY_KEY_ID ||
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
    "rzp_live_TTYXQgDrOD0xtU";
  const key_secret =
    process.env.RAZORPAY_KEY_SECRET || "6eFjihpE3G22DZ3q9lzCpVCH";

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
  const keySecret =
    process.env.RAZORPAY_KEY_SECRET || "6eFjihpE3G22DZ3q9lzCpVCH";

  const payload = `${orderId}|${paymentId}`;
  const generatedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(payload)
    .digest("hex");

  return generatedSignature === signature;
}
