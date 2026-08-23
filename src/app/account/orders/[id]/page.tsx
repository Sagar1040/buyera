"use client";

import React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Clock,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  CreditCard,
  Banknote,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";

export default function OrderTrackingPage({
  params,
}: {
  params: { id: string };
}) {
  const orderId = params.id;
  const isMock = orderId.startsWith("BUYERA-") || orderId.length < 30;

  // Mock order data with dynamic payment method
  const mockOrder = {
    orderNumber: isMock ? orderId : `BUYERA-20260824-${orderId.substring(0, 5).toUpperCase()}`,
    date: new Date().toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    status: "Order Confirmed & Manifested",
    paymentMethod: "COD" as "COD" | "RAZORPAY",
    paymentStatus: "PENDING" as "PENDING" | "PAID",
    paymentId: `pay_${Math.random().toString(36).substr(2, 9)}`,
    awbNumber: `SR${Math.floor(100000000 + Math.random() * 900000000)}`,
    courier: "BlueDart Express (Shiprocket)",
    estimatedDelivery: "3 - 5 Business Days",
    address: {
      fullName: "Aisha Khan",
      phone: "+91 98765 43210",
      houseFlat: "Flat 402, Royal Palms",
      street: "80 Feet Road, Koramangala",
      city: "Bengaluru",
      state: "Karnataka",
      pinCode: "560034",
    },
    items: [
      {
        name: "Royal Emerald Hand-Embroidered Abaya",
        size: "56 (M)",
        color: "Emerald Green",
        price: 4999,
        quantity: 1,
      },
    ],
    subtotal: 4999,
    discount: 500,
    shippingCost: 0,
    total: 4499,
  };

  const isCOD = mockOrder.paymentMethod === "COD";

  const timelineSteps = [
    {
      title: isCOD ? "Order Placed (Cash on Delivery)" : "Order Placed & Payment Verified",
      desc: isCOD
        ? "Your COD order has been confirmed. Payment will be collected at doorstep."
        : "Your payment was securely authorized via Razorpay HMAC SHA256.",
      done: true,
      time: "Just now",
    },
    {
      title: "Handpicked & Packaging Manifest",
      desc: "Our master tailors are inspecting and gift-boxing your silhouette in signature gold foil.",
      done: true,
      time: "Processing",
    },
    {
      title: "Shiprocket Courier Handover",
      desc: `Manifested with ${mockOrder.courier}. AWB: ${mockOrder.awbNumber}`,
      done: false,
      time: "Expected Today",
    },
    {
      title: "In Transit & Out for Delivery",
      desc: "Doorstep delivery to Koramangala, Bengaluru.",
      done: false,
      time: "Estimated 3-5 Days",
    },
  ];

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Success Banner */}
        <div className="bg-white border border-canvas-border p-8 text-center space-y-4 shadow-luxury flex flex-col items-center">
          <Link href="/" className="mb-2">
            <Logo size="md" showTagline={true} />
          </Link>
          <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-gold font-brand-badge font-semibold">
            ORDER COMMITTED
          </span>
          <h1 className="font-editorial-heading text-2xl sm:text-4xl text-charcoal">
            Thank You For Your Order
          </h1>
          <p className="text-xs sm:text-sm text-charcoal/60 max-w-md mx-auto leading-relaxed">
            Your modest couture order has been placed and confirmed. A confirmation receipt has been generated.
          </p>

          <div className="inline-flex flex-wrap items-center justify-center gap-4 pt-2 text-xs font-mono bg-cream-50 px-4 py-2 border border-canvas-border">
            <span>Order No: <strong className="text-charcoal">{mockOrder.orderNumber}</strong></span>
            <span>•</span>
            <span>Method: <strong className="text-charcoal">{isCOD ? "Cash on Delivery" : "Razorpay Online"}</strong></span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Vertical Tracking Timeline */}
          <div className="lg:col-span-2 bg-white border border-canvas-border p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-canvas-border pb-4">
              <h2 className="font-editorial-heading text-lg text-charcoal flex items-center gap-2">
                <Truck className="w-5 h-5 text-gold-dark" />
                Live Shipment Tracking
              </h2>
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 border border-emerald-200 font-semibold uppercase tracking-wider text-[10px]">
                {mockOrder.status}
              </span>
            </div>

            {/* Timeline */}
            <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-canvas-border">
              {timelineSteps.map((step, idx) => (
                <div key={idx} className="relative">
                  <div
                    className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                      step.done
                        ? "border-emerald-600 bg-emerald-600"
                        : "border-canvas-border"
                    }`}
                  >
                    {step.done && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-xs font-semibold uppercase tracking-wider ${
                          step.done ? "text-charcoal" : "text-charcoal/50"
                        }`}
                      >
                        {step.title}
                      </h4>
                      <span className="text-[10px] text-charcoal/50 font-mono">
                        {step.time}
                      </span>
                    </div>
                    <p className="text-xs text-charcoal/60 mt-1 font-light leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Shiprocket Courier Banner */}
            <div className="p-4 bg-cream-50 border border-gold/30 flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-charcoal">Courier Partner: {mockOrder.courier}</p>
                <p className="text-charcoal/60 text-[11px]">AWB Tracking Code: <strong className="font-mono">{mockOrder.awbNumber}</strong></p>
              </div>
              <a
                href={`https://shiprocket.co/tracking/${mockOrder.awbNumber}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-gold-dark hover:underline font-semibold text-xs"
              >
                Track Live <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Delivery Address & Order Receipt Breakdown */}
          <div className="space-y-6">
            {/* Payment Method Notice Card */}
            <div className="bg-white border border-canvas-border p-6 shadow-sm space-y-3">
              <h3 className="font-editorial-heading text-base text-charcoal border-b border-canvas-border pb-2 flex items-center gap-2">
                {isCOD ? (
                  <Banknote className="w-4 h-4 text-emerald-700" />
                ) : (
                  <CreditCard className="w-4 h-4 text-gold-dark" />
                )}
                Payment Method
              </h3>
              <div className="text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-charcoal">
                    {isCOD ? "Cash on Delivery (COD)" : "Razorpay Online"}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 border ${
                      isCOD
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : "bg-emerald-50 text-emerald-800 border-emerald-200"
                    }`}
                  >
                    {isCOD ? "PAY ON DELIVERY" : "PAID ONLINE"}
                  </span>
                </div>
                <p className="text-charcoal/60 leading-relaxed font-light">
                  {isCOD
                    ? `Please keep ${formatPrice(mockOrder.total)} cash ready upon arrival of the delivery executive.`
                    : `Payment verified via Razorpay ID: ${mockOrder.paymentId}`}
                </p>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white border border-canvas-border p-6 shadow-sm space-y-3">
              <h3 className="font-editorial-heading text-base text-charcoal border-b border-canvas-border pb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold-dark" />
                Shipping Destination
              </h3>
              <div className="text-xs text-charcoal/80 leading-relaxed font-light">
                <p className="font-semibold text-charcoal">{mockOrder.address.fullName}</p>
                <p>{mockOrder.address.houseFlat}, {mockOrder.address.street}</p>
                <p>{mockOrder.address.city}, {mockOrder.address.state} - {mockOrder.address.pinCode}</p>
                <p className="pt-1 text-charcoal/60">Contact: {mockOrder.address.phone}</p>
              </div>
            </div>

            {/* Receipt Breakdown */}
            <div className="bg-white border border-canvas-border p-6 shadow-sm space-y-4">
              <h3 className="font-editorial-heading text-base text-charcoal border-b border-canvas-border pb-2">
                Payment Summary
              </h3>

              <div className="space-y-2 text-xs text-charcoal/70">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-charcoal">{formatPrice(mockOrder.subtotal)}</span>
                </div>
                {mockOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span>-{formatPrice(mockOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium text-charcoal">
                    {mockOrder.shippingCost === 0 ? "FREE" : formatPrice(mockOrder.shippingCost)}
                  </span>
                </div>
                <div className="pt-2 border-t border-canvas-border flex justify-between font-bold text-sm text-charcoal">
                  <span>{isCOD ? "Payable on Delivery" : "Amount Paid"}</span>
                  <span>{formatPrice(mockOrder.total)}</span>
                </div>
              </div>
            </div>

            <Link href="/shop" className="block w-full">
              <Button variant="outline" size="md" className="w-full">
                CONTINUE SHOPPING
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
