"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ShieldCheck,
  Lock,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Banknote,
  Check,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { Logo } from "@/components/ui/Logo";

// 1. Dynamic Script Injection Helper
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && (window as any).Razorpay) {
      return resolve(true);
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

interface SavedAddress {
  id: string;
  fullName: string;
  phone: string;
  houseFlat: string;
  street: string;
  area?: string;
  city: string;
  district?: string;
  state: string;
  pinCode: string;
  isDefault: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, subtotal, discount, shipping, total, couponCode, clearCart } =
    useCart();

  // Form State
  const [address, setAddress] = useState({
    fullName: "",
    email: "",
    phone: "",
    houseFlat: "",
    street: "",
    area: "",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    state: "Karnataka",
    pinCode: "560034",
  });

  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [paymentChoice, setPaymentChoice] = useState<"RAZORPAY" | "COD">("RAZORPAY");
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Preload script on mount
  useEffect(() => {
    loadRazorpayScript();
  }, []);

  // Fetch saved user addresses if authenticated
  useEffect(() => {
    if (session?.user) {
      setAddress((prev) => ({
        ...prev,
        fullName: prev.fullName || session.user.name || "",
        email: prev.email || session.user.email || "",
      }));

      fetch("/api/user/addresses")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.addresses && data.addresses.length > 0) {
            setSavedAddresses(data.addresses);
            const defaultAddr =
              data.addresses.find((a: SavedAddress) => a.isDefault) ||
              data.addresses[0];
            if (defaultAddr) {
              setSelectedAddressId(defaultAddr.id);
              setAddress({
                fullName: defaultAddr.fullName,
                email: session?.user?.email || "",
                phone: defaultAddr.phone,
                houseFlat: defaultAddr.houseFlat,
                street: defaultAddr.street,
                area: defaultAddr.area || "",
                city: defaultAddr.city,
                district: defaultAddr.district || "",
                state: defaultAddr.state,
                pinCode: defaultAddr.pinCode,
              });
            }
          }
        })
        .catch((err) => console.error("Error loading user addresses:", err));
    }
  }, [session]);

  const handleSelectSavedAddress = (saved: SavedAddress) => {
    setSelectedAddressId(saved.id);
    setAddress({
      fullName: saved.fullName,
      email: session?.user?.email || address.email,
      phone: saved.phone,
      houseFlat: saved.houseFlat,
      street: saved.street,
      area: saved.area || "",
      city: saved.city,
      district: saved.district || "",
      state: saved.state,
      pinCode: saved.pinCode,
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setSelectedAddressId(null);
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !address.fullName.trim() ||
      !address.phone.trim() ||
      !address.pinCode.trim() ||
      !address.houseFlat.trim() ||
      !address.street.trim() ||
      !address.city.trim() ||
      !address.state.trim()
    ) {
      setError("Please fill in all mandatory shipping address fields marked with *.");
      return;
    }
    setError(null);
    setStep(2);
  };

  // 2. Robust Checkout Handler
  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      setError("Your shopping bag is empty.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (paymentChoice === "COD") {
        // Cash on Delivery Flow
        const res = await fetch("/api/checkout/cod/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items,
            couponCode,
            shippingAddress: address,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(
            data.error || "Failed to process Cash on Delivery order."
          );
        }

        clearCart();
        window.location.href = `/account/orders/${data.orderId || data.orderNumber}`;
        return;
      }

      // Online Razorpay Payment Flow
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert("Failed to load Razorpay SDK. Please check your internet connection.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/checkout/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          couponCode,
          shippingAddress: address,
        }),
      });

      const orderData = await res.json();

      if (!res.ok || !orderData.success) {
        const errorMsg = orderData.error || "Failed to initialize Razorpay order.";
        alert(errorMsg);
        setError(errorMsg);
        setLoading(false);
        return;
      }

      const { orderId, amount, currency, key, orderNumber } = orderData;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || key,
        amount: amount, // in paise
        currency: currency || "INR",
        name: "BUYERA",
        description: `Modest Fashion Purchase - Order #${orderNumber || ""}`,
        image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=200",
        order_id: orderId,
        handler: async function (response: any) {
          try {
            setLoading(true);
            const verifyRes = await fetch("/api/checkout/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                orderData: {
                  orderNumber,
                  items,
                  subtotal,
                  discount,
                  shippingCost: shipping,
                  total,
                  couponCode,
                  shippingAddress: address,
                },
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success !== false) {
              clearCart();
              window.location.href = `/account/orders/${verifyData.orderId || verifyData.orderNumber || ""}`;
            } else {
              const errMsg = verifyData.error || "Payment verification failed";
              alert(errMsg);
              setError(errMsg);
              setLoading(false);
            }
          } catch (err: any) {
            const errMsg = err.message || "Error verifying payment.";
            alert(errMsg);
            setError(errMsg);
            setLoading(false);
          }
        },
        prefill: {
          name: address.fullName || session?.user?.name || "",
          email: address.email || session?.user?.email || "",
          contact: address.phone || "",
        },
        theme: { color: "#121212" },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const paymentObject = new (window as any).Razorpay(options);

      paymentObject.on("payment.failed", function (resp: any) {
        alert(resp?.error?.description || "Payment Failed");
        setLoading(false);
      });

      paymentObject.open();
    } catch (err: any) {
      console.error("Checkout payment error:", err);
      const errMsg = err.message || "An unexpected error occurred during checkout.";
      alert(errMsg);
      setError(errMsg);
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <h1 className="font-editorial-heading text-2xl text-charcoal mb-4">
          Your Shopping Bag Is Empty
        </h1>
        <p className="text-xs text-charcoal/60 mb-6">
          Add some luxury silhouettes before proceeding to checkout.
        </p>
        <Link href="/shop">
          <Button variant="gold" size="md">
            EXPLORE COLLECTIONS
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 lg:px-8 py-10 lg:py-14">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-canvas-border pb-4">
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-xs text-charcoal/60 hover:text-charcoal transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Shopping Bag
          </Link>
          <Link href="/">
            <Logo size="sm" />
          </Link>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Checkout Steps */}
          <div className="lg:col-span-2 space-y-8">
            {/* Step 1: Shipping Address */}
            <div className="bg-white border border-canvas-border p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-canvas-border pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-charcoal text-white text-xs flex items-center justify-center font-bold">
                    1
                  </span>
                  <h2 className="font-editorial-heading text-xl text-charcoal">
                    Shipping & Delivery Destination
                  </h2>
                </div>
                {step === 2 && (
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs text-gold-dark underline uppercase tracking-wider font-semibold"
                  >
                    Edit Address
                  </button>
                )}
              </div>

              {step === 1 ? (
                <div className="space-y-6">
                  {/* Saved Address Quick Selector */}
                  {savedAddresses.length > 0 && (
                    <div className="space-y-3 pb-4 border-b border-canvas-border">
                      <p className="text-xs font-semibold uppercase tracking-wider text-charcoal flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-gold" />
                        Select From Saved Addresses
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {savedAddresses.map((sa) => (
                          <div
                            key={sa.id}
                            onClick={() => handleSelectSavedAddress(sa)}
                            className={`p-3.5 border text-xs cursor-pointer transition-all space-y-1 ${
                              selectedAddressId === sa.id
                                ? "border-gold bg-cream-50 ring-1 ring-gold"
                                : "border-canvas-border hover:border-gold/50 bg-white"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-charcoal">
                                {sa.fullName}
                              </span>
                              {sa.isDefault && (
                                <span className="text-[9px] bg-gold/10 text-gold-dark px-1.5 py-0.2 uppercase font-semibold">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-charcoal/70 text-[11px] truncate">
                              {sa.houseFlat}, {sa.street}
                            </p>
                            <p className="text-charcoal/60 text-[11px]">
                              {sa.city}, {sa.state} - {sa.pinCode}
                            </p>
                            <p className="text-charcoal/50 text-[10px] font-mono">
                              {sa.phone}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleProceedToPayment} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Full Name *"
                        required
                        value={address.fullName}
                        onChange={(e) =>
                          handleInputChange("fullName", e.target.value)
                        }
                        placeholder="e.g. Aisha Khan"
                      />
                      <Input
                        label="Mobile Number *"
                        type="tel"
                        required
                        value={address.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    <Input
                      label="Email Address (for Order Receipt & Tracking)"
                      type="email"
                      value={address.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="aisha@example.com"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Flat / House / Building *"
                        required
                        value={address.houseFlat}
                        onChange={(e) =>
                          handleInputChange("houseFlat", e.target.value)
                        }
                        placeholder="Flat 402, Royal Palms"
                      />
                      <Input
                        label="Street Address / Sector *"
                        required
                        value={address.street}
                        onChange={(e) =>
                          handleInputChange("street", e.target.value)
                        }
                        placeholder="80 Feet Road, 4th Block"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Input
                        label="City *"
                        required
                        value={address.city}
                        onChange={(e) =>
                          handleInputChange("city", e.target.value)
                        }
                        placeholder="Bengaluru"
                      />
                      <Input
                        label="State *"
                        required
                        value={address.state}
                        onChange={(e) =>
                          handleInputChange("state", e.target.value)
                        }
                        placeholder="Karnataka"
                      />
                      <Input
                        label="PIN Code *"
                        required
                        value={address.pinCode}
                        onChange={(e) =>
                          handleInputChange("pinCode", e.target.value)
                        }
                        placeholder="560034"
                      />
                    </div>

                    <div className="pt-2">
                      <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        className="w-full tracking-wider uppercase text-xs"
                      >
                        CONTINUE TO PAYMENT SELECTION
                      </Button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="text-xs text-charcoal/80 space-y-1 bg-cream-50 p-4 border border-canvas-border">
                  <p className="font-semibold text-charcoal">
                    {address.fullName} ({address.phone})
                  </p>
                  <p>
                    {address.houseFlat}, {address.street}
                  </p>
                  <p>
                    {address.city}, {address.state} - {address.pinCode}
                  </p>
                  {address.email && (
                    <p className="text-charcoal/60 pt-1 font-mono">
                      {address.email}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Step 2: Payment Method Selection */}
            <div
              className={`bg-white border border-canvas-border p-6 sm:p-8 shadow-sm space-y-6 ${
                step === 1 ? "opacity-60 pointer-events-none" : ""
              }`}
            >
              <div className="flex items-center gap-3 border-b border-canvas-border pb-4">
                <span className="w-6 h-6 rounded-full bg-charcoal text-white text-xs flex items-center justify-center font-bold">
                  2
                </span>
                <h2 className="font-editorial-heading text-xl text-charcoal">
                  Select Payment Gateway
                </h2>
              </div>

              {/* Dual Payment Options */}
              <div className="space-y-4">
                {/* Option 1: Razorpay Online */}
                <div
                  onClick={() => setPaymentChoice("RAZORPAY")}
                  className={`cursor-pointer p-5 border transition-all flex items-start justify-between ${
                    paymentChoice === "RAZORPAY"
                      ? "border-charcoal bg-cream-50/70 shadow-sm"
                      : "border-canvas-border bg-white hover:border-gold/50"
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 ${
                        paymentChoice === "RAZORPAY"
                          ? "border-charcoal bg-charcoal text-white"
                          : "border-charcoal/40"
                      }`}
                    >
                      {paymentChoice === "RAZORPAY" && (
                        <Check className="w-3 h-3 stroke-[3]" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gold-dark" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-charcoal">
                          Pay Online via Razorpay
                        </span>
                        <span className="text-[9px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                          RECOMMENDED
                        </span>
                      </div>
                      <p className="text-xs text-charcoal/60 font-light">
                        Instant confirmation via UPI (Google Pay, PhonePe, Paytm, CRED), NetBanking, or Debit/Credit Cards.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Option 2: Cash on Delivery */}
                <div
                  onClick={() => setPaymentChoice("COD")}
                  className={`cursor-pointer p-5 border transition-all flex items-start justify-between ${
                    paymentChoice === "COD"
                      ? "border-charcoal bg-cream-50/70 shadow-sm"
                      : "border-canvas-border bg-white hover:border-gold/50"
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 ${
                        paymentChoice === "COD"
                          ? "border-charcoal bg-charcoal text-white"
                          : "border-charcoal/40"
                      }`}
                    >
                      {paymentChoice === "COD" && (
                        <Check className="w-3 h-3 stroke-[3]" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-emerald-700" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-charcoal">
                          Cash on Delivery (COD)
                        </span>
                      </div>
                      <p className="text-xs text-charcoal/60 font-light">
                        Pay with cash upon delivery at your doorstep. Please keep exact cash ready during delivery.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {step === 2 && (
                <div className="pt-2">
                  <Button
                    onClick={handlePlaceOrder}
                    variant={paymentChoice === "RAZORPAY" ? "gold" : "primary"}
                    size="lg"
                    isLoading={loading}
                    className="w-full text-xs tracking-widest uppercase py-4"
                  >
                    {paymentChoice === "RAZORPAY" ? (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        PAY {formatPrice(total)} WITH RAZORPAY
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        CONFIRM COD ORDER ({formatPrice(total)})
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Order Summary */}
          <div className="bg-white border border-canvas-border p-6 shadow-luxury space-y-6 self-start">
            <h2 className="font-editorial-heading text-lg text-charcoal border-b border-canvas-border pb-3">
              Order Review ({items.length} Items)
            </h2>

            {/* Compact Item List */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 text-xs">
                  <div className="relative w-12 h-14 bg-cream-100 shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-charcoal truncate">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-charcoal/50">
                      Qty: {item.quantity} • {item.size}
                    </p>
                    <p className="font-semibold text-charcoal mt-1">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-2.5 text-xs text-charcoal/70 border-t border-canvas-border pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-charcoal">
                  {formatPrice(subtotal)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Coupon Discount ({couponCode})</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-medium text-charcoal">
                  {shipping === 0 ? "FREE" : formatPrice(shipping)}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-canvas-border flex justify-between items-baseline">
              <span className="text-sm font-semibold text-charcoal">
                Total Amount
              </span>
              <span className="text-xl font-bold text-charcoal">
                {formatPrice(total)}
              </span>
            </div>

            <div className="pt-2 flex items-center justify-center gap-1.5 text-[10px] text-charcoal/60 uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-gold" />
              100% Encrypted & Authenticated
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
