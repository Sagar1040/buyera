"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Search, Heart, ShoppingBag, User, Menu, X, LogOut, Package, Shield, ChevronDown } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

export function Navbar() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { wishlistCount } = useWishlist();
  const { cartCount } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const categories = [
    { name: "Abayas", href: "/category/abayas" },
    { name: "Hijabs", href: "/category/hijabs" },
    { name: "Pakistani Churidars", href: "/category/pakistani-churidars" },
    { name: "Islamic Dresses", href: "/category/islamic-dresses" },
    { name: "New In", href: "/shop?sort=newest" },
    { name: "Bestsellers", href: "/shop?tag=bestseller" },
  ];

  // Close user dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setUserDropdownOpen(false);
    await signOut({ callbackUrl: "/" });
  };

  return (
    <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur-md border-b border-canvas-border transition-all duration-300">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-charcoal hover:text-gold transition-colors"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Desktop Category Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {categories.slice(0, 4).map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="text-xs uppercase tracking-widest text-charcoal/80 hover:text-charcoal hover:text-gold-dark font-medium transition-colors duration-200 relative group py-2"
              >
                {cat.name}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-gold transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Brand Logo */}
          <div className="text-center">
            <Link href="/" className="flex flex-col items-center group">
              <span className="font-editorial-heading text-2xl sm:text-3xl font-bold tracking-[0.22em] text-charcoal group-hover:text-gold transition-colors">
                BUYERA
              </span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-charcoal/60 font-sans -mt-1 font-light">
                Elegance • Modesty • You
              </span>
            </Link>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* Search Icon */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-charcoal hover:text-gold transition-colors"
              aria-label="Search Catalog"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist with Live Counter */}
            <Link
              href="/wishlist"
              className="p-2 text-charcoal hover:text-gold transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-gold text-charcoal text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-fadeIn">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Bag with Live Counter */}
            <Link
              href="/cart"
              className="p-2 text-charcoal hover:text-gold transition-colors relative"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-charcoal text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-fadeIn">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Profile & Auth Dropdown */}
            <div className="relative" ref={dropdownRef}>
              {status === "authenticated" && session?.user ? (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 p-1.5 border border-canvas-border hover:border-gold text-charcoal transition-colors rounded-none"
                  aria-label="User Account Menu"
                >
                  <div className="w-6 h-6 rounded-full bg-cream-200 text-gold-dark text-[10px] font-bold flex items-center justify-center uppercase">
                    {session.user.name?.charAt(0) || "U"}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-charcoal/60" />
                </button>
              ) : (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="p-2 text-charcoal hover:text-gold transition-colors"
                  aria-label="Account Login"
                >
                  <User className="w-5 h-5" />
                </button>
              )}

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-canvas-border shadow-luxury py-2 z-50 animate-fadeIn">
                  {status === "authenticated" && session?.user ? (
                    <>
                      <div className="px-4 py-3 border-b border-canvas-border">
                        <p className="text-xs font-semibold text-charcoal truncate">
                          {session.user.name}
                        </p>
                        <p className="text-[11px] text-charcoal/50 truncate font-mono">
                          {session.user.email}
                        </p>
                      </div>

                      <Link
                        href="/account"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-charcoal hover:bg-cream-50 hover:text-gold transition-colors"
                      >
                        <Package className="w-4 h-4 text-gold-dark" />
                        My Orders & Tracking
                      </Link>

                      {session.user.role === "ADMIN" && (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-charcoal hover:bg-cream-50 hover:text-gold transition-colors"
                        >
                          <Shield className="w-4 h-4 text-gold-dark" />
                          Admin Portal
                        </Link>
                      )}

                      <div className="border-t border-canvas-border my-1" />

                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-rose-600 hover:bg-rose-50 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 text-[10px] uppercase tracking-widest text-charcoal/50 font-semibold">
                        Welcome to BUYERA
                      </div>
                      <Link
                        href="/login"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center justify-between px-4 py-2.5 text-xs font-medium text-charcoal hover:bg-cream-50 hover:text-gold transition-colors"
                      >
                        <span>Sign In</span>
                        <span className="text-[10px] text-gold uppercase tracking-wider">Members</span>
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center justify-between px-4 py-2.5 text-xs text-charcoal/80 hover:bg-cream-50 hover:text-gold transition-colors"
                      >
                        <span>Create Account</span>
                        <span className="text-[10px] text-charcoal/40 uppercase tracking-wider">Join Privé</span>
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Search Drawer Bar */}
        {searchOpen && (
          <div className="py-4 border-t border-canvas-border animate-fadeIn">
            <form action="/shop" method="GET" className="relative max-w-xl mx-auto">
              <input
                type="text"
                name="search"
                placeholder="Search premium abayas, hijabs, silk dresses..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-canvas-border text-sm placeholder:text-charcoal/40 focus:outline-none focus:border-gold"
                autoFocus
              />
              <Search className="w-5 h-5 text-charcoal/40 absolute left-4 top-3.5" />
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-cream border-t border-canvas-border px-6 py-8 space-y-4 animate-fadeIn">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm uppercase tracking-widest text-charcoal font-medium py-2 border-b border-canvas-border/50"
            >
              {cat.name}
            </Link>
          ))}
          <div className="pt-4 space-y-2">
            {status === "authenticated" && session?.user ? (
              <>
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs uppercase tracking-widest text-gold-dark font-semibold py-1.5"
                >
                  My Account ({session.user.name})
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block text-xs uppercase tracking-widest text-rose-600 font-semibold py-1.5"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex items-center justify-between pt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs uppercase tracking-widest text-charcoal font-semibold"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs uppercase tracking-widest text-gold font-semibold"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
