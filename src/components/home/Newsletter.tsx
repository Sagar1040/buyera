"use client";

import React, { useState } from "react";
import { Mail, CheckCircle2, Sparkles, Copy, Check } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText("ARAMYA10");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="bg-charcoal text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-aramyaBorder/10 relative overflow-hidden">
      {/* Background Soft Blobs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-terracotta/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-olive/15 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto max-w-3xl text-center space-y-6 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-cream-100 text-[10px] uppercase tracking-[0.25em] font-semibold rounded-full">
          <Sparkles className="w-3 h-3 text-terracotta-300" />
          BUYERA PRIVÉ CLUB
        </div>

        <h2 className="font-editorial-heading text-3xl sm:text-5xl text-cream-50 font-normal leading-tight">
          Unlock 10% OFF Your First Order
        </h2>

        <p className="text-xs sm:text-sm text-cream-200/80 font-light max-w-lg mx-auto leading-relaxed">
          Subscribe for private drop announcements, bespoke trunk show previews, and styling concierge access.
        </p>

        {status === "success" ? (
          <div className="bg-white/10 backdrop-blur-md border border-terracotta/50 p-6 rounded-3xl max-w-md mx-auto space-y-3 animate-fadeIn">
            <div className="w-10 h-10 rounded-full bg-terracotta/20 text-terracotta-200 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-editorial-heading text-xl text-cream-50 font-normal">
              Welcome to the Privé Club
            </h3>
            <p className="text-xs text-cream-200/80 font-light">
              Your secret 10% off voucher code has been unlocked:
            </p>
            <div className="flex items-center justify-center gap-2 pt-1">
              <span className="font-mono text-base font-bold bg-charcoal px-4 py-1.5 rounded-full text-white border border-terracotta">
                ARAMYA10
              </span>
              <button
                onClick={handleCopyCode}
                className="px-4 py-1.5 bg-terracotta text-white text-xs font-bold uppercase rounded-full flex items-center gap-1 hover:bg-terracotta-600 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "COPIED" : "COPY CODE"}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
            <div className="relative flex-1">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full pl-11 pr-4 py-3.5 bg-white/10 backdrop-blur-md border border-white/25 rounded-full text-white placeholder:text-white/45 text-xs focus:outline-none focus:border-terracotta transition-colors"
              />
              <Mail className="w-4 h-4 text-white/40 absolute left-4 top-4" />
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="btn-aramya-terracotta whitespace-nowrap"
            >
              {status === "loading" ? "JOINING..." : "JOIN PRIVÉ"}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="text-xs text-rose-400 font-light">
            Something went wrong. Please check your email address and try again.
          </p>
        )}

        <p className="text-[10px] text-cream-200/50 font-light">
          By subscribing, you agree to BUYERA’s Privacy Policy. Instant one-click unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
