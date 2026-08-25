"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  FolderTree,
  TicketPercent,
  Users,
  Settings,
  ArrowUpRight,
  LogOut,
  Menu,
  X,
  Store,
  ShieldCheck,
  Lock,
  Plus,
  Search,
  Bell,
  BarChart3,
  Sliders,
  Image as ImageIcon,
  FileText,
  Truck,
  ChevronDown,
  Layers,
} from "lucide-react";

interface NavGroup {
  groupName: string;
  items: {
    label: string;
    href: string;
    icon: any;
    badge?: string;
  }[];
}

const navGroups: NavGroup[] = [
  {
    groupName: "OVERVIEW",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Income & Analytics", href: "/admin/analytics", icon: BarChart3 },
    ],
  },
  {
    groupName: "CATALOG & INVENTORY",
    items: [
      { label: "All Products", href: "/admin/products", icon: Package },
      { label: "Add Product", href: "/admin/products/new", icon: Plus },
      { label: "Categories", href: "/admin/categories", icon: FolderTree },
    ],
  },
  {
    groupName: "ORDERS & LOGISTICS",
    items: [
      { label: "Orders & Shipments", href: "/admin/orders", icon: ShoppingBag },
    ],
  },
  {
    groupName: "PATRONS & USERS",
    items: [
      { label: "Customer Registry", href: "/admin/customers", icon: Users },
    ],
  },
  {
    groupName: "MARKETING & CMS",
    items: [
      { label: "Discount Coupons", href: "/admin/coupons", icon: TicketPercent },
      { label: "Hero Sliders & Banners", href: "/admin/banners", icon: ImageIcon },
    ],
  },
  {
    groupName: "CONFIGURATION",
    items: [
      { label: "Store Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalSearch.trim()) return;
    router.push(`/admin/products?search=${encodeURIComponent(globalSearch.trim())}`);
  };

  // 1. Loading State
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest text-[#E5D7B7] font-mono">
            Verifying Admin Session...
          </p>
        </div>
      </div>
    );
  }

  // 2. Strict Role Gate: Hidden from public & non-admin users
  if (!session || session.user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 border border-canvas-border text-center space-y-5 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-gold-dark font-semibold">
              SECURITY ACCESS GATE
            </span>
            <h2 className="font-editorial-heading text-2xl text-charcoal mt-1">
              Restricted Admin Area
            </h2>
          </div>
          <p className="text-xs text-charcoal/70 leading-relaxed">
            This back-office suite is strictly confidential and restricted to authorized BUYERA administrators only.
          </p>
          <div className="pt-2 space-y-2.5">
            <Link
              href="/login?callbackUrl=/admin"
              className="block w-full py-3 bg-charcoal text-white text-xs uppercase tracking-widest font-bold hover:bg-black transition-colors"
            >
              Sign In as Administrator
            </Link>
            <Link
              href="/"
              className="block text-xs text-charcoal/60 hover:text-charcoal transition-colors underline pt-1"
            >
              Return to Public Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated Admin View
  return (
    <div className="min-h-screen bg-[#F7F5F0] flex flex-col lg:flex-row text-charcoal font-sans">
      {/* Mobile Topbar */}
      <div className="lg:hidden bg-[#121212] text-white px-4 py-3 flex items-center justify-between border-b border-white/10 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 text-white/80 hover:text-white"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <span className="font-editorial-heading text-lg tracking-widest text-[#E5D7B7]">
              BUYERA
            </span>
            <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 bg-[#C5A880]/20 text-[#E5D7B7] border border-[#C5A880]/30 font-semibold">
              ADMIN
            </span>
          </div>
        </div>

        <Link
          href="/"
          target="_blank"
          className="text-xs text-[#E5D7B7] hover:underline flex items-center gap-1"
        >
          <Store className="w-3.5 h-3.5" />
          Storefront
        </Link>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#111111] text-white flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 border-r border-white/10 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-sm bg-[#C5A880] text-black font-bold flex items-center justify-center font-editorial-heading text-lg shadow-sm">
                B
              </div>
              <div>
                <span className="text-[9px] tracking-[0.25em] uppercase text-[#C5A880] font-semibold block leading-none mb-1">
                  ATELIER BACK-OFFICE
                </span>
                <h1 className="font-editorial-heading text-xl tracking-wider text-white leading-none">
                  BUYERA
                </h1>
              </div>
            </Link>
            <span className="w-2 h-2 rounded-full bg-emerald-400 ring-4 ring-emerald-500/20" />
          </div>
        </div>

        {/* Grouped Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto custom-scrollbar">
          {navGroups.map((group) => (
            <div key={group.groupName} className="space-y-1">
              <span className="px-3 text-[9px] uppercase tracking-[0.2em] text-white/40 font-bold font-mono block">
                {group.groupName}
              </span>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 rounded-sm text-xs tracking-wider uppercase font-medium transition-all ${
                      isActive
                        ? "bg-[#C5A880] text-black font-bold shadow-md shadow-[#C5A880]/15"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-3.5 h-3.5 ${
                          isActive ? "text-black" : "text-[#C5A880]"
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 font-mono">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Admin Profile Footer Card */}
        <div className="p-3.5 border-t border-white/10 bg-black/50 space-y-2.5">
          <div className="flex items-center gap-2.5 px-1.5">
            <div className="w-7 h-7 rounded-full bg-[#C5A880] text-black font-bold flex items-center justify-center text-[11px] shrink-0">
              {session?.user?.name ? session.user.name[0].toUpperCase() : "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {session?.user?.name || "Admin"}
              </p>
              <p className="text-[10px] text-[#C5A880] truncate font-mono">
                {session?.user?.email || "admin@buyera.in"}
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-white/10 text-xs px-1">
            <Link
              href="/"
              target="_blank"
              className="text-white/60 hover:text-[#C5A880] transition-colors flex items-center gap-1 text-[10px] uppercase font-semibold"
            >
              <Store className="w-3 h-3" />
              Live Store
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1 text-[10px] uppercase font-semibold"
            >
              <LogOut className="w-3 h-3" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for Mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* Main App Canvas */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-canvas-border px-6 py-3.5 hidden lg:flex items-center justify-between shadow-xs sticky top-0 z-20">
          {/* Global Quick Search */}
          <form onSubmit={handleGlobalSearch} className="w-96 relative">
            <Search className="w-3.5 h-3.5 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products, orders, customers..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-cream-50 border border-canvas-border rounded-sm focus:outline-none focus:border-gold text-charcoal placeholder:text-charcoal/40"
            />
          </form>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3 relative">
            {/* Quick + Create Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCreateMenuOpen(!createMenuOpen)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-charcoal text-white text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-black transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Create</span>
                <ChevronDown className="w-3 h-3 text-white/60" />
              </button>

              {createMenuOpen && (
                <div
                  onMouseLeave={() => setCreateMenuOpen(false)}
                  className="absolute right-0 top-full mt-2 w-48 bg-white border border-canvas-border shadow-luxury rounded-sm py-1.5 z-50 text-xs divide-y divide-canvas-border"
                >
                  <Link
                    href="/admin/products/new"
                    onClick={() => setCreateMenuOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-charcoal hover:bg-cream-50 hover:text-gold transition-colors font-medium"
                  >
                    <Package className="w-3.5 h-3.5 text-gold-dark" />
                    New Product
                  </Link>
                  <Link
                    href="/admin/coupons"
                    onClick={() => setCreateMenuOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-charcoal hover:bg-cream-50 hover:text-gold transition-colors font-medium"
                  >
                    <TicketPercent className="w-3.5 h-3.5 text-gold-dark" />
                    New Coupon
                  </Link>
                  <Link
                    href="/admin/banners"
                    onClick={() => setCreateMenuOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-charcoal hover:bg-cream-50 hover:text-gold transition-colors font-medium"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-gold-dark" />
                    New Hero Slider
                  </Link>
                  <Link
                    href="/admin/categories"
                    onClick={() => setCreateMenuOpen(false)}
                    className="flex items-center gap-2 px-3.5 py-2 text-charcoal hover:bg-cream-50 hover:text-gold transition-colors font-medium"
                  >
                    <FolderTree className="w-3.5 h-3.5 text-gold-dark" />
                    New Category
                  </Link>
                </div>
              )}
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 text-charcoal/70 hover:text-charcoal hover:bg-cream-100 rounded-sm relative"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-1.5 right-1.5" />
              </button>

              {notificationsOpen && (
                <div
                  onMouseLeave={() => setNotificationsOpen(false)}
                  className="absolute right-0 top-full mt-2 w-72 bg-white border border-canvas-border shadow-luxury rounded-sm p-3 z-50 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between border-b border-canvas-border pb-1.5">
                    <span className="font-semibold text-charcoal uppercase tracking-wider text-[10px]">
                      Notifications
                    </span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 font-bold">
                      2 New
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2 bg-cream-50 text-[11px] space-y-0.5">
                      <p className="font-semibold text-charcoal">
                        📦 8 Orders Awaiting Shipment
                      </p>
                      <p className="text-charcoal/60 text-[10px]">
                        BlueDart manifest ready for dispatch.
                      </p>
                    </div>
                    <div className="p-2 bg-amber-50 text-[11px] space-y-0.5">
                      <p className="font-semibold text-amber-900">
                        ⚠️ 3 Variants Low on Inventory
                      </p>
                      <p className="text-amber-800/80 text-[10px]">
                        Emerald Abaya has 2 units remaining.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Live Storefront Link */}
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-charcoal bg-cream-100 hover:bg-cream-200 border border-canvas-border rounded-sm transition-colors font-medium"
            >
              <Store className="w-3.5 h-3.5 text-gold-dark" />
              Customer Site
              <ArrowUpRight className="w-3 h-3 text-charcoal/40" />
            </Link>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
