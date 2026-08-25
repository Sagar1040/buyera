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
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Orders & Shipments", href: "/admin/orders", icon: ShoppingBag },
  { label: "Products & Stock", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "Discount Coupons", href: "/admin/coupons", icon: TicketPercent },
  { label: "Customers & Users", href: "/admin/users", icon: Users },
  { label: "Store Settings", href: "/admin/settings", icon: Settings },
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

  // 1. Loading State
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-widest text-[#E5D7B7] font-mono">
            Verifying Admin Privileges...
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
    <div className="min-h-screen bg-[#FBF9F5] flex flex-col lg:flex-row text-charcoal">
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
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#121212] text-white flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#C5A880] font-semibold block mb-1">
                EXECUTIVE CONTROL
              </span>
              <h1 className="font-editorial-heading text-2xl tracking-wider text-white">
                BUYERA
              </h1>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20 animate-pulse" />
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
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
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-sm text-xs tracking-wider uppercase font-medium transition-all ${
                  isActive
                    ? "bg-[#C5A880] text-black font-bold shadow-md shadow-[#C5A880]/20"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-black" : "text-[#C5A880]"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Admin User Footer Profile & Quick Links */}
        <div className="p-4 border-t border-white/10 bg-black/40 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-[#C5A880] text-black font-bold flex items-center justify-center text-xs">
              {session?.user?.name ? session.user.name[0].toUpperCase() : "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {session?.user?.name || "Admin User"}
              </p>
              <p className="text-[10px] text-[#C5A880] truncate">
                {session?.user?.email || "admin@buyera.in"}
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-white/10 text-xs">
            <Link
              href="/"
              target="_blank"
              className="text-white/60 hover:text-[#C5A880] transition-colors flex items-center gap-1 text-[11px]"
            >
              <Store className="w-3.5 h-3.5" />
              Live Site
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1 text-[11px]"
            >
              <LogOut className="w-3.5 h-3.5" />
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

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white border-b border-canvas-border px-6 py-4 hidden lg:flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-xs text-charcoal/50 uppercase tracking-widest font-mono">
              Admin Portal
            </span>
            <span className="text-charcoal/30">/</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal">
              {navItems.find((n) =>
                n.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(n.href)
              )?.label || "Dashboard"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-charcoal bg-cream-100 hover:bg-cream-200 border border-canvas-border transition-colors font-medium"
            >
              <Store className="w-3.5 h-3.5 text-gold-dark" />
              View Customer Storefront
              <ArrowUpRight className="w-3 h-3 text-charcoal/50" />
            </Link>
          </div>
        </header>

        {/* Page Children Container */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
