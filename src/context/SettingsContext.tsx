"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface SiteSettingsData {
  siteTitle: string;
  siteTagline: string;
  logoUrl: string;
  faviconUrl: string;
  announcementText: string;
  announcementActive: boolean;
  supportEmail: string;
  supportPhone: string;
  whatsappNumber: string;
  instagramUrl: string | null;
  facebookUrl: string | null;
  freeShippingThreshold: number;
  standardShippingFee: number;
  enableCOD: boolean;
  enableRazorpay: boolean;
  footerBio: string;
}

const DEFAULT_SETTINGS: SiteSettingsData = {
  siteTitle: "BUYERA",
  siteTagline: "Elegance. Modesty. You.",
  logoUrl: "/logo.svg",
  faviconUrl: "/favicon.ico",
  announcementText: "Free Shipping across India | Extra 10% Off on First Order: Code ARAMYA10",
  announcementActive: true,
  supportEmail: "support@buyera.in",
  supportPhone: "+91 98765 43210",
  whatsappNumber: "+91 98765 43210",
  instagramUrl: "https://instagram.com/buyera.official",
  facebookUrl: "https://facebook.com/buyera.official",
  freeShippingThreshold: 999.0,
  standardShippingFee: 99.0,
  enableCOD: true,
  enableRazorpay: true,
  footerBio:
    "BUYERA is dedicated to bringing you the finest modest and ethnic fashion crafted with certified pure fabrics and bespoke tailoring.",
};

interface SettingsContextType {
  settings: SiteSettingsData;
  loading: boolean;
  refreshSettings: () => Promise<void>;
  updateLocalSettings: (newSettings: Partial<SiteSettingsData>) => void;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: DEFAULT_SETTINGS,
  loading: true,
  refreshSettings: async () => {},
  updateLocalSettings: () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettingsData>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.settings) {
          setSettings((prev) => ({
            ...prev,
            ...data.settings,
          }));
        }
      }
    } catch (err) {
      console.warn("Could not load dynamic settings, using defaults:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateLocalSettings = (newSettings: Partial<SiteSettingsData>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        refreshSettings: fetchSettings,
        updateLocalSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
