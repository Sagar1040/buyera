"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  User,
  Package,
  MapPin,
  LogOut,
  ChevronRight,
  Truck,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  X,
  Phone,
  Mail,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatPrice } from "@/lib/utils";

interface Address {
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

interface OrderItem {
  id: string;
  name: string;
  size?: string | null;
  color?: string | null;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  total: number;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  items: OrderItem[];
  shipment?: {
    awbNumber?: string | null;
    courierName?: string | null;
    status?: string | null;
  } | null;
}

export default function AccountPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "addresses" | "profile">("overview");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Address Modal State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    houseFlat: "",
    street: "",
    area: "",
    city: "",
    district: "",
    state: "",
    pinCode: "",
    isDefault: false,
  });
  const [submittingAddress, setSubmittingAddress] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);

  // Fallback demo data if no database records exist
  const fallbackOrders: Order[] = [
    {
      id: "BUYERA-20260823-9K2L1",
      orderNumber: "BUYERA-20260823-9K2L1",
      createdAt: new Date().toISOString(),
      total: 4999,
      orderStatus: "PROCESSING",
      paymentStatus: "PAID",
      paymentMethod: "RAZORPAY",
      items: [
        {
          id: "item-1",
          name: "Royal Emerald Hand-Embroidered Abaya",
          size: "56 (M)",
          color: "Emerald Green",
          quantity: 1,
          price: 4999,
        },
      ],
      shipment: {
        awbNumber: "SR109283746",
        courierName: "BlueDart Express",
        status: "In Transit",
      },
    },
  ];

  const fallbackAddresses: Address[] = [
    {
      id: "default-addr-1",
      fullName: session?.user?.name || "Aisha Khan",
      phone: "+91 9811223344",
      houseFlat: "Flat 402, Royal Palms Residency",
      street: "80 Feet Road, 4th Block",
      area: "Koramangala",
      city: "Bengaluru",
      district: "Bengaluru Urban",
      state: "Karnataka",
      pinCode: "560034",
      isDefault: true,
    },
  ];

  // Auth redirect
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/account");
    }
  }, [status, router]);

  // Load user data
  useEffect(() => {
    if (status === "authenticated") {
      fetchUserData();
    }
  }, [status]);

  const fetchUserData = async () => {
    setLoadingData(true);
    try {
      // Fetch addresses
      const addrRes = await fetch("/api/user/addresses");
      if (addrRes.ok) {
        const addrData = await addrRes.json();
        if (addrData.addresses && addrData.addresses.length > 0) {
          setAddresses(addrData.addresses);
        } else {
          setAddresses(fallbackAddresses);
        }
      } else {
        setAddresses(fallbackAddresses);
      }

      // Fetch orders
      const orderRes = await fetch("/api/user/orders");
      if (orderRes.ok) {
        const orderData = await orderRes.json();
        if (orderData.orders && orderData.orders.length > 0) {
          setOrders(orderData.orders);
        } else {
          setOrders(fallbackOrders);
        }
      } else {
        setOrders(fallbackOrders);
      }
    } catch (err) {
      console.error("Error loading account data:", err);
      setAddresses(fallbackAddresses);
      setOrders(fallbackOrders);
    } finally {
      setLoadingData(false);
    }
  };

  const openAddAddressModal = () => {
    setEditingAddressId(null);
    setAddressForm({
      fullName: session?.user?.name || "",
      phone: "",
      houseFlat: "",
      street: "",
      area: "",
      city: "",
      district: "",
      state: "",
      pinCode: "",
      isDefault: addresses.length === 0,
    });
    setAddressError(null);
    setIsAddressModalOpen(true);
  };

  const openEditAddressModal = (addr: Address) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      fullName: addr.fullName,
      phone: addr.phone,
      houseFlat: addr.houseFlat,
      street: addr.street,
      area: addr.area || "",
      city: addr.city,
      district: addr.district || "",
      state: addr.state,
      pinCode: addr.pinCode,
      isDefault: addr.isDefault,
    });
    setAddressError(null);
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingAddress(true);
    setAddressError(null);

    try {
      if (editingAddressId && !editingAddressId.startsWith("default-addr")) {
        // Update via API
        const res = await fetch("/api/user/addresses", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingAddressId, ...addressForm }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to update address");
        }
      } else if (!editingAddressId) {
        // Create via API
        const res = await fetch("/api/user/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(addressForm),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to save address");
        }
      }

      // Optimistically update or re-fetch
      if (editingAddressId) {
        setAddresses((prev) =>
          prev.map((a) =>
            a.id === editingAddressId
              ? {
                  ...a,
                  ...addressForm,
                  isDefault: addressForm.isDefault,
                }
              : addressForm.isDefault
              ? { ...a, isDefault: false }
              : a
          )
        );
      } else {
        const newAddr: Address = {
          id: `addr-${Date.now()}`,
          ...addressForm,
        };
        setAddresses((prev) => {
          if (addressForm.isDefault) {
            return [newAddr, ...prev.map((a) => ({ ...a, isDefault: false }))];
          }
          return [...prev, newAddr];
        });
      }

      setIsAddressModalOpen(false);
      fetchUserData();
    } catch (err: any) {
      setAddressError(err?.message || "An error occurred while saving address.");
    } finally {
      setSubmittingAddress(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Are you sure you want to remove this address?")) return;
    try {
      if (!id.startsWith("default-addr") && !id.startsWith("addr-")) {
        await fetch(`/api/user/addresses?id=${id}`, { method: "DELETE" });
      }
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Error deleting address:", err);
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    try {
      if (!id.startsWith("default-addr") && !id.startsWith("addr-")) {
        await fetch("/api/user/addresses", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, isDefault: true }),
        });
      }
      setAddresses((prev) =>
        prev.map((a) => ({
          ...a,
          isDefault: a.id === id,
        }))
      );
    } catch (err) {
      console.error("Error setting default address:", err);
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
        <p className="text-xs uppercase tracking-widest text-charcoal/60 font-medium">
          Loading your BUYERA Privé portal...
        </p>
      </div>
    );
  }

  const userInitials =
    session?.user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "U";

  return (
    <div className="container mx-auto px-4 lg:px-8 py-10 lg:py-14">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Profile Banner */}
        <div className="bg-white border border-canvas-border p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-cream-100 border-2 border-gold/40 text-gold flex items-center justify-center font-bold text-xl sm:text-2xl shadow-inner uppercase">
              {userInitials}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-brand-badge tracking-[0.25em] uppercase text-gold font-semibold bg-cream-50 px-2 py-0.5 border border-gold/20">
                  {session?.user?.role === "ADMIN" ? "ADMINISTRATOR" : "PRIVÉ MEMBER"}
                </span>
              </div>
              <h1 className="font-editorial-heading text-2xl sm:text-3xl text-charcoal font-normal">
                {session?.user?.name || "Valued Patron"}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-charcoal/60">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-gold" />
                  {session?.user?.email}
                </span>
                {session?.user?.role === "ADMIN" && (
                  <Link
                    href="/admin/orders"
                    className="text-gold-dark hover:underline font-semibold flex items-center gap-1"
                  >
                    Admin Portal <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto border-t md:border-t-0 pt-4 md:pt-0 border-canvas-border w-full md:w-auto justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300"
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-canvas-border bg-cream-50/50 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-6 py-3.5 text-xs uppercase tracking-widest font-semibold transition-all border-b-2 whitespace-nowrap ${
              activeTab === "overview"
                ? "border-gold text-charcoal bg-white shadow-sm"
                : "border-transparent text-charcoal/60 hover:text-gold"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-6 py-3.5 text-xs uppercase tracking-widest font-semibold transition-all border-b-2 whitespace-nowrap ${
              activeTab === "orders"
                ? "border-gold text-charcoal bg-white shadow-sm"
                : "border-transparent text-charcoal/60 hover:text-gold"
            }`}
          >
            Orders & Tracking ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("addresses")}
            className={`px-6 py-3.5 text-xs uppercase tracking-widest font-semibold transition-all border-b-2 whitespace-nowrap ${
              activeTab === "addresses"
                ? "border-gold text-charcoal bg-white shadow-sm"
                : "border-transparent text-charcoal/60 hover:text-gold"
            }`}
          >
            Saved Addresses ({addresses.length})
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-6 py-3.5 text-xs uppercase tracking-widest font-semibold transition-all border-b-2 whitespace-nowrap ${
              activeTab === "profile"
                ? "border-gold text-charcoal bg-white shadow-sm"
                : "border-transparent text-charcoal/60 hover:text-gold"
            }`}
          >
            Profile Settings
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Recent Orders Summary */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between border-b border-canvas-border pb-3">
                <h2 className="font-editorial-heading text-xl text-charcoal flex items-center gap-2">
                  <Package className="w-5 h-5 text-gold" />
                  Recent Orders
                </h2>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="text-xs text-gold-dark hover:underline font-medium"
                >
                  View All ({orders.length})
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="bg-white border border-canvas-border p-8 text-center space-y-3">
                  <Package className="w-10 h-10 text-charcoal/30 mx-auto" />
                  <p className="text-xs text-charcoal/60">You have no previous orders.</p>
                  <Link href="/shop">
                    <Button variant="primary" size="sm">
                      Explore Collections
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 2).map((order) => (
                    <div
                      key={order.id}
                      className="bg-white border border-canvas-border p-6 shadow-sm space-y-4 transition-all hover:border-gold/50"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-canvas-border pb-3">
                        <div>
                          <span className="text-xs font-mono font-semibold text-charcoal">
                            {order.orderNumber || order.id}
                          </span>
                          <p className="text-[11px] text-charcoal/50">
                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-semibold text-charcoal font-editorial-heading">
                            {formatPrice(order.total)}
                          </span>
                          <span className="block text-[10px] uppercase tracking-wider text-emerald-600 font-semibold">
                            {order.orderStatus}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs space-y-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-charcoal/80">
                            <span>
                              {item.name} {item.size && `(${item.size})`} × {item.quantity}
                            </span>
                            <span className="font-mono text-charcoal/60">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-canvas-border/60">
                        {order.shipment?.awbNumber ? (
                          <div className="flex items-center gap-1.5 text-xs text-charcoal/70">
                            <Truck className="w-4 h-4 text-gold" />
                            <span>AWB: <strong className="font-mono">{order.shipment.awbNumber}</strong></span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-charcoal/50">Processing shipment</span>
                        )}
                        <Link
                          href={`/account/orders/${order.id}`}
                          className="inline-flex items-center gap-1 text-xs text-gold-dark hover:underline font-semibold uppercase tracking-wider text-[10px]"
                        >
                          Order Details & Tracking <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Default Address & Privé Concierge */}
            <div className="space-y-6">
              <div className="bg-white border border-canvas-border p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-canvas-border pb-2">
                  <h3 className="font-editorial-heading text-base text-charcoal flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gold" />
                    Default Shipping Address
                  </h3>
                  <button
                    onClick={() => setActiveTab("addresses")}
                    className="text-xs text-gold-dark hover:underline font-medium"
                  >
                    Manage
                  </button>
                </div>

                {addresses.length > 0 ? (
                  <div className="text-xs text-charcoal/80 leading-relaxed font-light space-y-1">
                    <div className="flex items-center justify-between">
                      <strong className="font-semibold text-charcoal">{addresses[0].fullName}</strong>
                      <span className="text-[9px] bg-gold/10 text-gold-dark px-2 py-0.5 uppercase tracking-wider font-semibold">
                        Default
                      </span>
                    </div>
                    <p>{addresses[0].houseFlat}</p>
                    <p>{addresses[0].street}, {addresses[0].area}</p>
                    <p>{addresses[0].city}, {addresses[0].state} - {addresses[0].pinCode}</p>
                    <p className="pt-1 text-charcoal/60 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-gold" />
                      {addresses[0].phone}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-4 space-y-2">
                    <p className="text-xs text-charcoal/50">No saved addresses yet.</p>
                    <Button variant="outline" size="sm" onClick={openAddAddressModal}>
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add Address
                    </Button>
                  </div>
                )}
              </div>

              {/* Privé Concierge Box */}
              <div className="bg-charcoal text-cream p-6 border border-gold/30 space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gold/10 rounded-full blur-xl pointer-events-none" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-gold font-brand-badge font-semibold">
                  PRIVÉ CONCIERGE
                </span>
                <h4 className="font-editorial-heading text-lg text-white">
                  Bespoke Sizing & Styling
                </h4>
                <p className="text-xs text-cream-200/80 font-light leading-relaxed">
                  Need customized length alterations, bridal fittings, or personal styling assistance?
                </p>
                <div className="pt-2">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1.5 text-xs text-gold hover:text-white uppercase tracking-wider font-semibold transition-colors"
                  >
                    Contact Stylist <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Orders List */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-canvas-border pb-3">
              <div>
                <h2 className="font-editorial-heading text-2xl text-charcoal">
                  My Orders & Live Courier Tracking
                </h2>
                <p className="text-xs text-charcoal/60">
                  Track real-time shipment status, view invoices, and manage past purchases.
                </p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white border border-canvas-border p-12 text-center space-y-4">
                <Package className="w-12 h-12 text-charcoal/30 mx-auto" />
                <h3 className="font-editorial-heading text-lg text-charcoal">No orders found</h3>
                <p className="text-xs text-charcoal/60 max-w-sm mx-auto">
                  When you place an order, it will appear here with live tracking updates.
                </p>
                <Link href="/shop">
                  <Button variant="primary" size="md">
                    Start Shopping
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white border border-canvas-border p-6 shadow-sm space-y-4 transition-all hover:border-gold/40"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-canvas-border pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-charcoal">
                            {order.orderNumber || order.id}
                          </span>
                          <span className="text-[10px] bg-cream-100 text-charcoal px-2 py-0.5 font-mono">
                            {order.paymentMethod}
                          </span>
                        </div>
                        <p className="text-xs text-charcoal/50 mt-0.5">
                          Placed on{" "}
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-base font-bold text-charcoal font-editorial-heading">
                            {formatPrice(order.total)}
                          </span>
                          <span className="block text-[10px] uppercase tracking-wider text-emerald-600 font-semibold">
                            {order.orderStatus}
                          </span>
                        </div>

                        <Link href={`/account/orders/${order.id}`}>
                          <Button variant="outline" size="sm">
                            View Order & Tracking
                          </Button>
                        </Link>
                      </div>
                    </div>

                    <div className="divide-y divide-canvas-border/50">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-medium text-charcoal">{item.name}</p>
                            <p className="text-[11px] text-charcoal/60">
                              {item.size && `Size: ${item.size}`} {item.color && `• Color: ${item.color}`} • Qty: {item.quantity}
                            </p>
                          </div>
                          <span className="font-mono font-semibold text-charcoal">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {order.shipment?.awbNumber && (
                      <div className="p-3.5 bg-cream-50 border border-canvas-border flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 text-charcoal/80">
                          <Truck className="w-4 h-4 text-gold" />
                          <span>
                            Courier: <strong>{order.shipment.courierName || "BlueDart (Shiprocket)"}</strong>
                          </span>
                          <span>•</span>
                          <span>
                            AWB: <strong className="font-mono">{order.shipment.awbNumber}</strong>
                          </span>
                        </div>
                        <Link
                          href={`/account/orders/${order.id}`}
                          className="text-gold-dark font-medium underline flex items-center gap-1 text-[11px]"
                        >
                          Open Live Tracking <ChevronRight className="w-3 h-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Saved Addresses */}
        {activeTab === "addresses" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-canvas-border pb-3">
              <div>
                <h2 className="font-editorial-heading text-2xl text-charcoal">
                  Saved Shipping Addresses
                </h2>
                <p className="text-xs text-charcoal/60">
                  Manage your delivery destinations for rapid, seamless checkout.
                </p>
              </div>
              <Button variant="primary" size="sm" onClick={openAddAddressModal}>
                <Plus className="w-3.5 h-3.5 mr-1" /> Add New Address
              </Button>
            </div>

            {addresses.length === 0 ? (
              <div className="bg-white border border-canvas-border p-12 text-center space-y-4">
                <MapPin className="w-12 h-12 text-charcoal/30 mx-auto" />
                <h3 className="font-editorial-heading text-lg text-charcoal">No saved addresses</h3>
                <p className="text-xs text-charcoal/60 max-w-sm mx-auto">
                  Add your primary delivery address for faster orders.
                </p>
                <Button variant="primary" size="md" onClick={openAddAddressModal}>
                  <Plus className="w-4 h-4 mr-1" /> Add Address
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`bg-white border p-6 shadow-sm flex flex-col justify-between space-y-4 transition-all ${
                      addr.isDefault ? "border-gold ring-1 ring-gold/20" : "border-canvas-border"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-charcoal text-sm">{addr.fullName}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] bg-gold/10 text-gold-dark font-bold px-2 py-0.5 uppercase tracking-wider">
                            Default
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-charcoal/80 space-y-0.5 leading-relaxed font-light">
                        <p>{addr.houseFlat}</p>
                        <p>{addr.street}</p>
                        {addr.area && <p>{addr.area}</p>}
                        <p>
                          {addr.city}, {addr.state} - <span className="font-mono font-medium">{addr.pinCode}</span>
                        </p>
                        <p className="pt-2 text-charcoal/60 flex items-center gap-1 font-mono">
                          <Phone className="w-3.5 h-3.5 text-gold" />
                          {addr.phone}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-canvas-border/60 text-xs">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => openEditAddressModal(addr)}
                          className="text-charcoal hover:text-gold flex items-center gap-1 font-medium transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>

                      {!addr.isDefault && (
                        <button
                          onClick={() => handleSetDefaultAddress(addr.id)}
                          className="text-gold-dark hover:underline text-[11px] font-semibold uppercase tracking-wider"
                        >
                          Set as Default
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Profile Settings */}
        {activeTab === "profile" && (
          <div className="max-w-2xl bg-white border border-canvas-border p-8 shadow-sm space-y-6">
            <div>
              <h2 className="font-editorial-heading text-xl text-charcoal">
                Account & Security Settings
              </h2>
              <p className="text-xs text-charcoal/60">
                Your authenticated BUYERA Privé member credentials.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <Input
                label="Full Name"
                value={session?.user?.name || ""}
                disabled
                className="bg-cream-50 text-charcoal/80 cursor-not-allowed"
              />

              <Input
                label="Email Address"
                value={session?.user?.email || ""}
                disabled
                className="bg-cream-50 text-charcoal/80 cursor-not-allowed"
              />

              <div>
                <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
                  Membership Role
                </label>
                <div className="p-3 bg-cream-50 border border-canvas-border font-mono text-xs text-charcoal font-semibold">
                  {session?.user?.role || "CUSTOMER"}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-canvas-border flex items-center justify-between">
              <span className="text-xs text-charcoal/50">
                Want to update credentials or password? Contact customer care.
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="text-rose-600 border-rose-200 hover:bg-rose-50"
              >
                <LogOut className="w-3.5 h-3.5 mr-1" /> Sign Out
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Address Add / Edit Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-canvas-border w-full max-w-lg shadow-luxury p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-canvas-border pb-3">
              <h3 className="font-editorial-heading text-xl text-charcoal">
                {editingAddressId ? "Edit Shipping Address" : "Add New Shipping Address"}
              </h3>
              <button
                onClick={() => setIsAddressModalOpen(false)}
                className="p-1 text-charcoal/50 hover:text-charcoal transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {addressError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs">
                {addressError}
              </div>
            )}

            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  required
                  value={addressForm.fullName}
                  onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                  placeholder="e.g. Aisha Khan"
                />
                <Input
                  label="Phone Number"
                  required
                  type="tel"
                  value={addressForm.phone}
                  onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                  placeholder="+91 9876543210"
                />
              </div>

              <Input
                label="Flat, House no., Building"
                required
                value={addressForm.houseFlat}
                onChange={(e) => setAddressForm({ ...addressForm, houseFlat: e.target.value })}
                placeholder="Flat 402, Royal Palms"
              />

              <Input
                label="Area, Street, Sector, Village"
                required
                value={addressForm.street}
                onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                placeholder="80 Feet Road, 4th Block"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Town / City"
                  required
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                  placeholder="Bengaluru"
                />
                <Input
                  label="PIN Code"
                  required
                  value={addressForm.pinCode}
                  onChange={(e) => setAddressForm({ ...addressForm, pinCode: e.target.value })}
                  placeholder="560034"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="State"
                  required
                  value={addressForm.state}
                  onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                  placeholder="Karnataka"
                />
                <Input
                  label="District / Landmark"
                  value={addressForm.district}
                  onChange={(e) => setAddressForm({ ...addressForm, district: e.target.value })}
                  placeholder="Bengaluru Urban"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs text-charcoal cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addressForm.isDefault}
                    onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                    className="accent-gold rounded-none"
                  />
                  <span>Make this my default shipping address</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-canvas-border">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setIsAddressModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={submittingAddress}
                >
                  {editingAddressId ? "Save Changes" : "Add Address"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
