"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  LogOut,
  Package,
  Shield,
  ChevronDown,
  Sparkles,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

export function Navbar() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { wishlistCount } = useWishlist();
  const { cartCount } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setUserDropdownOpen(false);
    await signOut({ callbackUrl: "/" });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchFocused(false);
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Cbazaar Mega Menu Categories Data
  const megaMenuData: Record<
    string,
    {
      title: string;
      href: string;
      badge?: string;
      columns: { heading: string; items: { name: string; href: string }[] }[];
      promo: { title: string; subtitle: string; image: string; href: string };
    }
  > = {
    abayas: {
      title: "Abayas",
      href: "/category/abayas",
      columns: [
        {
          heading: "Style & Silhouette",
          items: [
            { name: "Dubai Hand-Embroidered", href: "/category/abayas?style=dubai" },
            { name: "Open Front Kimono Abayas", href: "/category/abayas?style=open" },
            { name: "Classic Closed Front", href: "/category/abayas?style=closed" },
            { name: "Butterfly & Farasha Cuts", href: "/category/abayas?style=farasha" },
            { name: "Festive Velvet Abayas", href: "/category/abayas?style=velvet" },
          ],
        },
        {
          heading: "Fabric & Occasion",
          items: [
            { name: "Grade-A Korean Nida", href: "/category/abayas?fabric=nida" },
            { name: "Medina Silk Luxury", href: "/category/abayas?fabric=silk" },
            { name: "Bridal & Wedding Abayas", href: "/category/abayas?tag=bridal" },
            { name: "Daily Workwear Abayas", href: "/category/abayas?tag=daily" },
            { name: "Ready to Ship Abayas", href: "/category/abayas?tag=ready-to-ship" },
          ],
        },
      ],
      promo: {
        title: "Royal Emerald Velvet Edit",
        subtitle: "Hand-stitched Zardozi metallic accents",
        image:
          "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop",
        href: "/category/abayas",
      },
    },
    hijabs: {
      title: "Hijabs",
      href: "/category/hijabs",
      columns: [
        {
          heading: "Premium Fabrics",
          items: [
            { name: "Pure Medina Silk", href: "/category/hijabs?fabric=medina-silk" },
            { name: "Luxury Chiffon Shaylas", href: "/category/hijabs?fabric=chiffon" },
            { name: "Premium Modal Cotton", href: "/category/hijabs?fabric=modal" },
            { name: "Ribbed & Bamboo Jersey", href: "/category/hijabs?fabric=jersey" },
            { name: "Crinkle Shimmer Hijabs", href: "/category/hijabs?fabric=crinkle" },
          ],
        },
        {
          heading: "Essential Sets",
          items: [
            { name: "Hijab & Shayla Combos", href: "/category/hijabs?tag=combos" },
            { name: "Silk Undercaps & Pins", href: "/category/hijabs?tag=accessories" },
            { name: "Festive Satin Prints", href: "/category/hijabs?tag=prints" },
            { name: "Bestseller Neutrals (Box of 4)", href: "/category/hijabs?tag=box-set" },
          ],
        },
      ],
      promo: {
        title: "Medina Silk Heritage Collection",
        subtitle: "Non-slip breathable luxury weaves",
        image:
          "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600&auto=format&fit=crop",
        href: "/category/hijabs",
      },
    },
    pakistani: {
      title: "Pakistani Suits",
      href: "/category/pakistani-churidars",
      columns: [
        {
          heading: "Designer Silhouettes",
          items: [
            { name: "Embroidered Lawn Suits", href: "/category/pakistani-churidars?type=lawn" },
            { name: "Churidar & Straight Pants", href: "/category/pakistani-churidars?type=churidar" },
            { name: "Palazzo & Gharara Sets", href: "/category/pakistani-churidars?type=gharara" },
            { name: "Festive Organza Dupattas", href: "/category/pakistani-churidars?type=organza" },
          ],
        },
        {
          heading: "Curated Edits",
          items: [
            { name: "Eid 2026 Festive Drops", href: "/shop?tag=eid" },
            { name: "Semi-Stitched & Custom Tailored", href: "/shop?tag=custom" },
            { name: "Pastel Velvet Ensembles", href: "/shop?tag=pastel" },
          ],
        },
      ],
      promo: {
        title: "Lahore Couture Edit",
        subtitle: "Heavy threadwork & organza drapes",
        image:
          "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop",
        href: "/category/pakistani-churidars",
      },
    },
    anarkalis: {
      title: "Anarkalis & Gowns",
      href: "/category/islamic-dresses",
      columns: [
        {
          heading: "Haute Couture Dresses",
          items: [
            { name: "Floor Length Anarkalis", href: "/category/islamic-dresses?type=anarkali" },
            { name: "Modest Wedding Gowns", href: "/category/islamic-dresses?type=gown" },
            { name: "Embellished Kaftans", href: "/category/islamic-dresses?type=kaftan" },
            { name: "Layered Tiered Maxi Dresses", href: "/category/islamic-dresses?type=maxi" },
          ],
        },
        {
          heading: "Festive Specials",
          items: [
            { name: "Zari & Sequins Party Wear", href: "/category/islamic-dresses?tag=party" },
            { name: "Bridal Reception Wear", href: "/category/islamic-dresses?tag=bridal" },
            { name: "Ready to Ship Gowns", href: "/category/islamic-dresses?tag=ready" },
          ],
        },
      ],
      promo: {
        title: "Bespoke Modest Gowns",
        subtitle: "Full-coverage royal embroidery",
        image:
          "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=600&auto=format&fit=crop",
        href: "/category/islamic-dresses",
      },
    },
    modest: {
      title: "Modest Wear",
      href: "/shop?cat=modest-wear",
      columns: [
        {
          heading: "Daily Modesty",
          items: [
            { name: "Co-ord Modest Sets", href: "/shop?style=coord" },
            { name: "Longline Tunics & Kurtis", href: "/shop?style=tunic" },
            { name: "Modest Outerwear & Cardigans", href: "/shop?style=outerwear" },
            { name: "Wide Leg Linen Trousers", href: "/shop?style=pants" },
          ],
        },
        {
          heading: "Trending Highlights",
          items: [
            { name: "Monochrome Minimalist Sets", href: "/shop?tag=monochrome" },
            { name: "Summer Breathable Cottons", href: "/shop?tag=cotton" },
            { name: "Everyday Essentials", href: "/shop?tag=essentials" },
          ],
        },
      ],
      promo: {
        title: "Modern Modesty",
        subtitle: "Contemporary cuts with graceful drape",
        image:
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
        href: "/shop",
      },
    },
  };

  const trendingSearches = [
    "Royal Emerald Abaya",
    "Pakistani Lawn Suit",
    "Medina Silk Hijab",
    "Velvet Anarkali Gown",
    "Kimono Open Abaya",
    "Eid Collection 2026",
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-canvas-border transition-all duration-300">
      {/* Middle Bar: Logo & Search & User Actions */}
      <div className="container mx-auto px-4 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4 lg:gap-8">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-charcoal hover:text-gold transition-colors"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Centered Brand Identity */}
          <div className="flex items-center">
            <Link href="/" className="flex flex-col items-start group">
              <span className="font-editorial-heading text-2xl sm:text-3xl font-bold tracking-[0.24em] text-charcoal group-hover:text-gold transition-colors">
                BUYERA
              </span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.35em] text-charcoal/60 font-sans font-light -mt-1">
                Elegance • Modesty • You
              </span>
            </Link>
          </div>

          {/* Cbazaar-Style Search Bar with Auto-Suggestions */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4 relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search luxury abayas, silk hijabs, pakistani suits, anarkalis..."
                className="w-full pl-10 pr-24 py-2.5 bg-cream-50 border border-canvas-border text-xs placeholder:text-charcoal/40 focus:outline-none focus:border-charcoal focus:bg-white transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-3" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-charcoal text-white hover:bg-gold transition-colors text-[10px] uppercase font-semibold tracking-wider"
              >
                Search
              </button>
            </form>

            {/* Trending Suggestions Dropdown */}
            {searchFocused && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-canvas-border shadow-luxury p-4 z-50 animate-fadeIn">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-charcoal/50 font-bold mb-2.5">
                  <TrendingUp className="w-3.5 h-3.5 text-gold" />
                  Trending Searches
                </div>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        setSearchQuery(item);
                        setSearchFocused(false);
                        router.push(`/shop?search=${encodeURIComponent(item)}`);
                      }}
                      className="text-xs px-3 py-1.5 bg-cream-50 hover:bg-charcoal hover:text-white border border-canvas-border transition-all text-charcoal/80"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Action Icons (Wishlist, Cart, Account) */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* Wishlist with Live Counter */}
            <Link
              href="/wishlist"
              className="p-2 text-charcoal hover:text-gold transition-colors relative flex items-center gap-1"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              <span className="hidden sm:inline text-xs uppercase tracking-wider font-medium text-charcoal/70">
                Wishlist
              </span>
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 right-0.5 sm:-top-1 sm:right-auto sm:left-4 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-fadeIn shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Bag with Live Counter */}
            <Link
              href="/cart"
              className="p-2 text-charcoal hover:text-gold transition-colors relative flex items-center gap-1"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline text-xs uppercase tracking-wider font-medium text-charcoal/70">
                Bag
              </span>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 right-0.5 sm:-top-1 sm:right-auto sm:left-4 bg-charcoal text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-fadeIn shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Account Flyout */}
            <div className="relative" ref={dropdownRef}>
              {status === "authenticated" && session?.user ? (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 p-1 border border-canvas-border hover:border-gold text-charcoal transition-colors bg-cream-50"
                  aria-label="User Account Menu"
                >
                  <div className="w-6 h-6 rounded-full bg-charcoal text-white text-[10px] font-bold flex items-center justify-center uppercase">
                    {session.user.name?.charAt(0) || "U"}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-charcoal/60" />
                </button>
              ) : (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="p-2 text-charcoal hover:text-gold transition-colors flex items-center gap-1"
                  aria-label="Account Login"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline text-xs uppercase tracking-wider font-medium text-charcoal/70">
                    Sign In
                  </span>
                </button>
              )}

              {/* Flyout Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white border border-canvas-border shadow-luxury py-2 z-50 animate-fadeIn">
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
                        My Orders & Live Tracking
                      </Link>

                      {session.user.role === "ADMIN" && (
                        <Link
                          href="/admin/orders"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-charcoal hover:bg-cream-50 hover:text-gold transition-colors"
                        >
                          <Shield className="w-4 h-4 text-gold-dark" />
                          Admin Orders Portal
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
                        <span className="text-[10px] text-gold uppercase tracking-wider font-semibold">Members</span>
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
      </div>

      {/* Cbazaar Mega Menu Desktop Navigation Bar */}
      <nav
        className="hidden lg:block border-t border-canvas-border bg-cream-50/80 relative"
        onMouseLeave={() => setActiveMegaMenu(null)}
      >
        <div className="container mx-auto px-8">
          <ul className="flex items-center justify-center space-x-10">
            {Object.keys(megaMenuData).map((key) => {
              const menu = megaMenuData[key];
              const isActive = activeMegaMenu === key;
              return (
                <li
                  key={key}
                  onMouseEnter={() => setActiveMegaMenu(key)}
                  className="py-3"
                >
                  <Link
                    href={menu.href}
                    className={`text-xs uppercase tracking-widest font-semibold transition-colors duration-200 relative group flex items-center gap-1 ${
                      isActive ? "text-gold-dark font-bold" : "text-charcoal/90 hover:text-gold"
                    }`}
                  >
                    {menu.title}
                    <ChevronDown
                      className={`w-3 h-3 transition-transform ${
                        isActive ? "rotate-180 text-gold-dark" : "opacity-40"
                      }`}
                    />
                    <span
                      className={`absolute bottom-0 left-0 h-[2px] bg-gold transition-all duration-300 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}

            {/* Static Highlight Links */}
            <li className="py-3">
              <Link
                href="/shop?sort=newest"
                className="text-xs uppercase tracking-widest font-semibold text-charcoal/90 hover:text-gold transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-gold" />
                New In
              </Link>
            </li>

            <li className="py-3">
              <Link
                href="/shop?tag=sale"
                className="text-xs uppercase tracking-widest font-bold text-rose-600 hover:text-rose-700 transition-colors flex items-center gap-1"
              >
                Sale
                <span className="text-[9px] bg-rose-600 text-white px-1.5 py-0.2 rounded-none uppercase font-mono">
                  -30%
                </span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Mega Menu Dropdown Container */}
        {activeMegaMenu && megaMenuData[activeMegaMenu] && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-canvas-border shadow-luxury py-8 z-50 animate-fadeIn">
            <div className="container mx-auto px-12 grid grid-cols-4 gap-8">
              {/* Category Columns */}
              {megaMenuData[activeMegaMenu].columns.map((col, idx) => (
                <div key={idx} className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-charcoal border-b border-canvas-border pb-2">
                    {col.heading}
                  </h4>
                  <ul className="space-y-2">
                    {col.items.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          onClick={() => setActiveMegaMenu(null)}
                          className="text-xs text-charcoal/70 hover:text-gold transition-colors block py-0.5"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Promotional Banner Card */}
              <div className="col-span-2 relative aspect-[16/9] overflow-hidden bg-cream-100 border border-canvas-border group">
                <Image
                  src={megaMenuData[activeMegaMenu].promo.image}
                  alt={megaMenuData[activeMegaMenu].promo.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent p-6 flex flex-col justify-end text-white">
                  <span className="text-[9px] uppercase tracking-widest text-gold font-bold">
                    FEATURED EDIT
                  </span>
                  <h3 className="font-editorial-heading text-lg font-normal text-white">
                    {megaMenuData[activeMegaMenu].promo.title}
                  </h3>
                  <p className="text-xs text-cream-200 font-light mt-0.5">
                    {megaMenuData[activeMegaMenu].promo.subtitle}
                  </p>
                  <Link
                    href={megaMenuData[activeMegaMenu].promo.href}
                    onClick={() => setActiveMegaMenu(null)}
                    className="inline-flex items-center gap-1.5 text-xs text-gold uppercase tracking-wider font-semibold mt-3 hover:underline"
                  >
                    SHOP THIS COLLECTION <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-cream border-t border-canvas-border px-6 py-6 space-y-4 animate-fadeIn max-h-[85vh] overflow-y-auto">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative pb-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search modest collections..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-canvas-border text-xs"
            />
            <Search className="w-4 h-4 text-charcoal/40 absolute left-3 top-3" />
          </form>

          {Object.keys(megaMenuData).map((key) => {
            const menu = megaMenuData[key];
            return (
              <div key={key} className="border-b border-canvas-border/60 pb-3">
                <Link
                  href={menu.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs uppercase tracking-widest text-charcoal font-bold py-1"
                >
                  {menu.title}
                </Link>
                <div className="pl-3 pt-1 space-y-1.5">
                  {menu.columns[0].items.slice(0, 3).map((sub) => (
                    <Link
                      key={sub.name}
                      href={sub.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-[11px] text-charcoal/70 hover:text-gold"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}

          <div className="pt-2 space-y-2">
            {status === "authenticated" && session?.user ? (
              <>
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs uppercase tracking-widest text-gold-dark font-semibold py-1"
                >
                  My Account ({session.user.name})
                </Link>
                <button
                  onClick={handleSignOut}
                  className="block text-xs uppercase tracking-widest text-rose-600 font-semibold py-1"
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
