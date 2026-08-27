"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Settings,
  Truck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Store,
  Mail,
  Phone,
  Megaphone,
  CreditCard,
  Banknote,
  Globe,
  Share2,
  FileText,
  Sparkles,
  ShieldCheck,
  Save,
  MessageSquare,
  Check,
  Layers,
  Award,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { useSettings } from "@/context/SettingsContext";

type TabKey = "general" | "announcement" | "story" | "shipping" | "contact" | "footer";

export default function AdminSettingsPage() {
  const { refreshSettings } = useSettings();
  const [activeTab, setActiveTab] = useState<TabKey>("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [form, setForm] = useState({
    siteTitle: "BUYERA",
    siteTagline: "Elegance. Modesty. You.",
    logoUrl: "/logo.svg",
    faviconUrl: "/favicon.ico",
    announcementText:
      "Free Shipping across India | Extra 10% Off on First Order: Code ARAMYA10",
    announcementActive: true,
    supportEmail: "support@buyera.in",
    supportPhone: "+91 98765 43210",
    whatsappNumber: "+91 98765 43210",
    instagramUrl: "https://instagram.com/buyera.official",
    facebookUrl: "https://facebook.com/buyera.official",
    freeShippingThreshold: 999,
    standardShippingFee: 99,
    enableCOD: true,
    enableRazorpay: true,
    footerBio:
      "BUYERA is dedicated to bringing you the finest modest and ethnic fashion crafted with certified pure fabrics and bespoke tailoring.",
    storyBadge: "THE BUYERA PHILOSOPHY",
    storyTitle: "Modest Luxury Envisioned for Every Day",
    storyDescription:
      "Handcrafted premium modest fashion designed for everyday elegance.",
    storyImageUrl: "/story-image.jpg",
    storyStat1Number: "10,000+",
    storyStat1Label: "Happy Customers",
    storyStat2Number: "100%",
    storyStat2Label: "Pure Breathable Fabrics",
  });

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.success && data.settings) {
        setForm({
          siteTitle: data.settings.siteTitle || "BUYERA",
          siteTagline: data.settings.siteTagline || "Elegance. Modesty. You.",
          logoUrl: data.settings.logoUrl || "/logo.png",
          faviconUrl: data.settings.faviconUrl || "/favicon.ico",
          announcementText: data.settings.announcementText || "",
          announcementActive: data.settings.announcementActive !== false,
          supportEmail: data.settings.supportEmail || "support@buyera.in",
          supportPhone: data.settings.supportPhone || "+91 98765 43210",
          whatsappNumber: data.settings.whatsappNumber || "+91 98765 43210",
          instagramUrl: data.settings.instagramUrl || "",
          facebookUrl: data.settings.facebookUrl || "",
          freeShippingThreshold:
            data.settings.freeShippingThreshold !== undefined
              ? Number(data.settings.freeShippingThreshold)
              : 999,
          standardShippingFee:
            data.settings.standardShippingFee !== undefined
              ? Number(data.settings.standardShippingFee)
              : 99,
          enableCOD: data.settings.enableCOD !== false,
          enableRazorpay: data.settings.enableRazorpay !== false,
          footerBio:
            data.settings.footerBio ||
            "BUYERA is dedicated to bringing you the finest modest and ethnic fashion crafted with certified pure fabrics and bespoke tailoring.",
          storyBadge: data.settings.storyBadge || "THE BUYERA PHILOSOPHY",
          storyTitle:
            data.settings.storyTitle ||
            "Modest Luxury Envisioned for Every Day",
          storyDescription:
            data.settings.storyDescription ||
            "Handcrafted premium modest fashion designed for everyday elegance.",
          storyImageUrl: data.settings.storyImageUrl || "/story-image.jpg",
          storyStat1Number: data.settings.storyStat1Number || "10,000+",
          storyStat1Label: data.settings.storyStat1Label || "Happy Customers",
          storyStat2Number: data.settings.storyStat2Number || "100%",
          storyStat2Label:
            data.settings.storyStat2Label || "Pure Breathable Fabrics",
        });
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update store settings.");
      }

      await refreshSettings();
      setSuccessMsg("Store configuration saved and applied across storefront!");
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const tabs: { id: TabKey; label: string; icon: any; desc: string }[] = [
    {
      id: "general",
      label: "General & Branding",
      icon: Store,
      desc: "Brand identity, titles & logos",
    },
    {
      id: "announcement",
      label: "Topbar & Tickers",
      icon: Megaphone,
      desc: "Announcement bar & promotions",
    },
    {
      id: "shipping",
      label: "Store & Shipping",
      icon: Truck,
      desc: "Delivery thresholds & payment gateways",
    },
    {
      id: "contact",
      label: "Contact & Social",
      icon: MessageSquare,
      desc: "Helpline, WhatsApp chat & socials",
    },
    {
      id: "footer",
      label: "Footer & Policies",
      icon: FileText,
      desc: "Brand bio and copyright notice",
    },
  ];

  if (loading) {
    return (
      <div className="py-20 text-center text-charcoal/50">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-terracotta" />
        <p className="text-xs uppercase tracking-widest font-semibold">Loading CMS Configuration...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-aramyaBorder pb-6">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-terracotta font-brand-badge font-bold">
            STOREFRONT CONTROLLER & CMS
          </span>
          <h1 className="font-editorial-heading text-2xl sm:text-3xl text-charcoal font-normal">
            Dynamic Site Settings
          </h1>
          <p className="text-xs text-charcoal/60 font-light pt-1">
            Manage your global store identity, shipping rates, payment gateways, and live announcement bars.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={fetchSettings}
            variant="outline"
            size="sm"
            className="text-xs uppercase tracking-wider self-start sm:self-auto rounded-full"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Reload
          </Button>
        </div>
      </div>

      {/* Alert Notices */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 rounded-2xl shadow-xs animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-medium">{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 rounded-2xl shadow-xs animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 5 Tab Navigation */}
      <div className="flex border-b border-aramyaBorder gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
                isActive
                  ? "border-terracotta text-terracotta bg-white shadow-xs"
                  : "border-transparent text-charcoal/60 hover:text-charcoal hover:bg-cream-100/50"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-terracotta" : "text-charcoal/40"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* TAB 1: General & Branding */}
        {activeTab === "general" && (
          <div className="bg-white border border-aramyaBorder p-6 sm:p-8 rounded-3xl shadow-card space-y-6 animate-fadeIn">
            <div className="flex items-center gap-2.5 border-b border-aramyaBorder pb-3">
              <Store className="w-5 h-5 text-terracotta" />
              <div>
                <h2 className="font-editorial-heading text-lg text-charcoal font-normal">
                  Brand Identity & Metadata
                </h2>
                <p className="text-[11px] text-charcoal/50">
                  Global store name, tagline, and brand assets shown across headers, footers, and invoices.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Store Brand Title *"
                required
                value={form.siteTitle}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, siteTitle: e.target.value }))
                }
                helperText="Appears in browser titles, navbar, and email receipts."
              />
              <Input
                label="Brand Tagline"
                value={form.siteTagline}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, siteTagline: e.target.value }))
                }
                helperText="Displayed beneath the logo on desktop screens."
              />
            </div>

            <div className="space-y-4 pt-2">
              <ImageUpload
                type="brand"
                label="Store Brand Logo (SVG or PNG)"
                value={form.logoUrl}
                onChange={(url) => setForm((prev) => ({ ...prev, logoUrl: url }))}
                folder="branding"
              />

              <Input
                label="Favicon Image URL"
                value={form.faviconUrl}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, faviconUrl: e.target.value }))
                }
                helperText="Path to .ico or .png favicon image."
              />
            </div>
          </div>
        )}

        {/* TAB 2: Topbar & Announcements */}
        {activeTab === "announcement" && (
          <div className="bg-white border border-aramyaBorder p-6 sm:p-8 rounded-3xl shadow-card space-y-6 animate-fadeIn">
            <div className="flex items-center gap-2.5 border-b border-aramyaBorder pb-3">
              <Megaphone className="w-5 h-5 text-terracotta" />
              <div>
                <h2 className="font-editorial-heading text-lg text-charcoal font-normal">
                  Storefront Announcement Ticker
                </h2>
                <p className="text-[11px] text-charcoal/50">
                  Topmost promo ribbon highlighting discounts, free delivery, or flash vouchers.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-cream-50 border border-aramyaBorder rounded-2xl space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.announcementActive}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        announcementActive: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 accent-terracotta rounded"
                  />
                  <div>
                    <p className="text-xs font-bold text-charcoal">Enable Announcement Bar</p>
                    <p className="text-[11px] text-charcoal/60 font-light">
                      Toggle whether the top ticker strip is visible to storefront visitors.
                    </p>
                  </div>
                </label>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal">
                  Announcement Message
                </label>
                <textarea
                  rows={3}
                  value={form.announcementText}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      announcementText: e.target.value,
                    }))
                  }
                  placeholder="e.g. Free Shipping across India | Extra 10% Off on First Order: Code ARAMYA10"
                  className="w-full border border-aramyaBorder p-3 rounded-xl text-xs text-charcoal focus:outline-none focus:border-terracotta leading-relaxed"
                />
              </div>

              {/* Live Preview Box */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] uppercase font-bold text-charcoal/50 tracking-widest">
                  Live Ticker Preview:
                </span>
                <div className="bg-charcoal text-cream-100 text-xs py-2.5 px-4 rounded-xl flex items-center justify-between">
                  <span className="truncate">
                    {form.announcementActive
                      ? form.announcementText || "No announcement text entered"
                      : "(Announcement Bar is currently disabled)"}
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-terracotta-200 font-bold bg-white/10 px-2 py-0.5 rounded-full">
                    PREVIEW
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Brand Story / About Section */}
        {activeTab === "story" && (
          <div className="bg-white border border-aramyaBorder p-6 sm:p-8 rounded-3xl shadow-card space-y-6 animate-fadeIn">
            <div className="flex items-center gap-2.5 border-b border-aramyaBorder pb-3">
              <Sparkles className="w-5 h-5 text-terracotta" />
              <div>
                <h2 className="font-editorial-heading text-lg text-charcoal font-normal">
                  Brand Story & Philosophy Section
                </h2>
                <p className="text-[11px] text-charcoal/50">
                  Customize the homepage brand philosophy narrative, atelier showcase photo, and trust metrics.
                </p>
              </div>
            </div>

            {/* Badges & Titles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Story Eyebrow Badge *"
                required
                value={form.storyBadge}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, storyBadge: e.target.value }))
                }
                helperText="e.g. THE BUYERA PHILOSOPHY"
              />
              <Input
                label="Story Main Headline *"
                required
                value={form.storyTitle}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, storyTitle: e.target.value }))
                }
                helperText="e.g. Modest Luxury Envisioned for Every Day"
              />
            </div>

            {/* Narrative / Description */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal">
                Story Narrative / Description *
              </label>
              <textarea
                rows={4}
                required
                value={form.storyDescription}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    storyDescription: e.target.value,
                  }))
                }
                placeholder="Handcrafted premium modest fashion designed for everyday elegance..."
                className="w-full border border-aramyaBorder p-3.5 rounded-2xl text-xs text-charcoal focus:outline-none focus:border-terracotta leading-relaxed"
              />
              <p className="text-[11px] text-charcoal/50 font-light">
                Main editorial paragraph explaining your brand heritage and quality craftsmanship.
              </p>
            </div>

            {/* Story Showcase Image Upload */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-charcoal">
                Atelier Showcase Image
              </h3>
              <ImageUpload
                type="banner"
                label="Story Showcase Image (JPG, PNG, WebP)"
                value={form.storyImageUrl}
                onChange={(url) =>
                  setForm((prev) => ({ ...prev, storyImageUrl: url }))
                }
                folder="story"
              />
              <Input
                label="Custom Image URL (Optional Direct Override)"
                value={form.storyImageUrl}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, storyImageUrl: e.target.value }))
                }
                helperText="Enter a direct image URL or upload above via Supabase storage."
              />
            </div>

            {/* Trust Metrics / Statistics */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-charcoal">
                Key Metrics & Brand Statistics
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Metric 1 */}
                <div className="p-4 border border-aramyaBorder rounded-2xl bg-cream-50/50 space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta">
                    Metric #1
                  </span>
                  <Input
                    label="Stat 1 Value *"
                    required
                    value={form.storyStat1Number}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        storyStat1Number: e.target.value,
                      }))
                    }
                    placeholder="10,000+"
                  />
                  <Input
                    label="Stat 1 Label *"
                    required
                    value={form.storyStat1Label}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        storyStat1Label: e.target.value,
                      }))
                    }
                    placeholder="Happy Customers"
                  />
                </div>

                {/* Metric 2 */}
                <div className="p-4 border border-aramyaBorder rounded-2xl bg-cream-50/50 space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta">
                    Metric #2
                  </span>
                  <Input
                    label="Stat 2 Value *"
                    required
                    value={form.storyStat2Number}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        storyStat2Number: e.target.value,
                      }))
                    }
                    placeholder="100%"
                  />
                  <Input
                    label="Stat 2 Label *"
                    required
                    value={form.storyStat2Label}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        storyStat2Label: e.target.value,
                      }))
                    }
                    placeholder="Pure Breathable Fabrics"
                  />
                </div>
              </div>
            </div>

            {/* Live Card Preview */}
            <div className="space-y-2 pt-4 border-t border-aramyaBorder">
              <span className="text-[10px] uppercase font-bold text-charcoal/50 tracking-widest">
                Live Brand Story Preview:
              </span>
              <div className="bg-cream-50 border border-aramyaBorder rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-white text-[9px] tracking-[0.2em] uppercase text-terracotta font-bold rounded-full border border-aramyaBorder shadow-xs">
                    <Layers className="w-3 h-3 text-terracotta" />
                    {form.storyBadge || "THE BUYERA PHILOSOPHY"}
                  </span>
                </div>
                <h4 className="font-editorial-heading text-xl text-charcoal">
                  {form.storyTitle || "Modest Luxury Envisioned for Every Day"}
                </h4>
                <p className="text-xs text-charcoal/70 font-light leading-relaxed">
                  {form.storyDescription ||
                    "Handcrafted premium modest fashion designed for everyday elegance."}
                </p>
                <div className="grid grid-cols-2 gap-4 border-t border-aramyaBorder pt-3 text-xs">
                  <div>
                    <p className="font-bold text-base text-charcoal">
                      {form.storyStat1Number || "10,000+"}
                    </p>
                    <p className="text-charcoal/60 text-[10px]">
                      {form.storyStat1Label || "Happy Customers"}
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-base text-charcoal">
                      {form.storyStat2Number || "100%"}
                    </p>
                    <p className="text-charcoal/60 text-[10px]">
                      {form.storyStat2Label || "Pure Breathable Fabrics"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Store & Shipping */}
        {activeTab === "shipping" && (
          <div className="bg-white border border-aramyaBorder p-6 sm:p-8 rounded-3xl shadow-card space-y-6 animate-fadeIn">
            <div className="flex items-center gap-2.5 border-b border-aramyaBorder pb-3">
              <Truck className="w-5 h-5 text-terracotta" />
              <div>
                <h2 className="font-editorial-heading text-lg text-charcoal font-normal">
                  Shipping Rates & Payment Gateways
                </h2>
                <p className="text-[11px] text-charcoal/50">
                  Control free shipping thresholds and toggle COD vs Razorpay availability on checkout.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Free Shipping Cart Value (₹) *"
                type="number"
                required
                value={form.freeShippingThreshold}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    freeShippingThreshold: Number(e.target.value),
                  }))
                }
                helperText="Orders at or above this amount receive free shipping."
              />
              <Input
                label="Standard Shipping Fee (₹) *"
                type="number"
                required
                value={form.standardShippingFee}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    standardShippingFee: Number(e.target.value),
                  }))
                }
                helperText="Charged on cart orders below the free shipping threshold."
              />
            </div>

            {/* Payment Gateways Toggles */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-charcoal">
                Checkout Payment Gateways
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Razorpay Toggle */}
                <div className="p-4 border border-aramyaBorder rounded-2xl bg-cream-50/50 space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.enableRazorpay}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          enableRazorpay: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 accent-terracotta rounded"
                    />
                    <div>
                      <span className="text-xs font-bold text-charcoal flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-terracotta" />
                        Enable Razorpay (UPI & Cards)
                      </span>
                      <p className="text-[11px] text-charcoal/60 font-light">
                        Allow online instant payments via UPI, Google Pay, Cards, and NetBanking.
                      </p>
                    </div>
                  </label>
                </div>

                {/* COD Toggle */}
                <div className="p-4 border border-aramyaBorder rounded-2xl bg-cream-50/50 space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.enableCOD}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          enableCOD: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 accent-terracotta rounded"
                    />
                    <div>
                      <span className="text-xs font-bold text-charcoal flex items-center gap-1.5">
                        <Banknote className="w-3.5 h-3.5 text-olive-600" />
                        Enable Cash on Delivery (COD)
                      </span>
                      <p className="text-[11px] text-charcoal/60 font-light">
                        Allow customers to pay in cash upon doorstep delivery.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Contact & Social Links */}
        {activeTab === "contact" && (
          <div className="bg-white border border-aramyaBorder p-6 sm:p-8 rounded-3xl shadow-card space-y-6 animate-fadeIn">
            <div className="flex items-center gap-2.5 border-b border-aramyaBorder pb-3">
              <MessageSquare className="w-5 h-5 text-terracotta" />
              <div>
                <h2 className="font-editorial-heading text-lg text-charcoal font-normal">
                  Support Helpline & Social Media
                </h2>
                <p className="text-[11px] text-charcoal/50">
                  Customer service numbers, WhatsApp concierge links, and official social channels.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Customer Support Email *"
                type="email"
                required
                value={form.supportEmail}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, supportEmail: e.target.value }))
                }
                helperText="Displayed in invoices, order receipts, and footer."
              />
              <Input
                label="Helpline Phone Number"
                value={form.supportPhone}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, supportPhone: e.target.value }))
                }
                helperText="Direct calling support line."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <Input
                label="WhatsApp Concierge Number"
                value={form.whatsappNumber}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    whatsappNumber: e.target.value,
                  }))
                }
                helperText="Triggers direct WhatsApp chat widget."
              />
              <Input
                label="Instagram Profile URL"
                value={form.instagramUrl}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, instagramUrl: e.target.value }))
                }
                helperText="e.g. https://instagram.com/buyera.official"
              />
              <Input
                label="Facebook Page URL"
                value={form.facebookUrl}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, facebookUrl: e.target.value }))
                }
                helperText="e.g. https://facebook.com/buyera.official"
              />
            </div>
          </div>
        )}

        {/* TAB 5: Footer & Custom Text */}
        {activeTab === "footer" && (
          <div className="bg-white border border-aramyaBorder p-6 sm:p-8 rounded-3xl shadow-card space-y-6 animate-fadeIn">
            <div className="flex items-center gap-2.5 border-b border-aramyaBorder pb-3">
              <FileText className="w-5 h-5 text-terracotta" />
              <div>
                <h2 className="font-editorial-heading text-lg text-charcoal font-normal">
                  Footer Brand Bio & Legal Policies
                </h2>
                <p className="text-[11px] text-charcoal/50">
                  Custom narrative paragraph displayed in the global footer.
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal">
                Footer Brand Bio Narrative
              </label>
              <textarea
                rows={4}
                value={form.footerBio}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, footerBio: e.target.value }))
                }
                className="w-full border border-aramyaBorder p-3.5 rounded-2xl text-xs text-charcoal focus:outline-none focus:border-terracotta leading-relaxed"
              />
              <p className="text-[11px] text-charcoal/50 font-light">
                Displayed in the bottom footer column next to your logo.
              </p>
            </div>
          </div>
        )}

        {/* Direct Sticky Save Button */}
        <div className="flex items-center justify-between pt-4 border-t border-aramyaBorder">
          <span className="text-[11px] text-charcoal/60 font-light">
            All updates sync immediately with the live storefront.
          </span>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={saving}
            className="btn-aramya-terracotta text-xs tracking-widest font-bold px-8 shadow-md"
          >
            <Save className="w-4 h-4 mr-2" />
            SAVE STOREFRONT CONFIGURATION
          </Button>
        </div>
      </form>
    </div>
  );
}
