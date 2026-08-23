"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Heart, ShoppingBag, User, Menu, X } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const categories = [
    { name: "Abayas", href: "/category/abayas" },
    { name: "Hijabs", href: "/category/hijabs" },
    { name: "Pakistani Churidars", href: "/category/pakistani-churidars" },
    { name: "Islamic Dresses", href: "/category/islamic-dresses" },
    { name: "New In", href: "/shop?sort=newest" },
    { name: "Bestsellers", href: "/shop?tag=bestseller" },
  ];

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
          <div className="flex items-center space-x-4 sm:space-x-6">
            {/* Search Icon */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-charcoal hover:text-gold transition-colors"
              aria-label="Search Catalog"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="p-2 text-charcoal hover:text-gold transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              <span className="absolute top-1 right-1 bg-gold text-charcoal text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                0
              </span>
            </Link>

            {/* User Profile */}
            <Link
              href="/account"
              className="p-2 text-charcoal hover:text-gold transition-colors hidden sm:inline-block"
              aria-label="Account"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Shopping Bag / Cart */}
            <Link
              href="/cart"
              className="p-2 text-charcoal hover:text-gold transition-colors relative"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute top-1 right-1 bg-charcoal text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                0
              </span>
            </Link>
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
          <div className="pt-4 flex items-center justify-between">
            <Link
              href="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs uppercase tracking-widest text-gold-dark font-semibold"
            >
              My Account
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs uppercase tracking-widest text-charcoal/60"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
