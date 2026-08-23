"use client";

import React, { useState } from "react";
import { Mail, CheckCircle2, Sparkles, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

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
    navigator.clipboard.writeText("BUYERA15");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="bg-charcoal text-white py-16 px-4 lg:px-8 border-t border-gold/20 relative overflow-hidden">
      <div className="container mx-auto max-w-4xl text-center space-y-6 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/20 border border-gold/40 text-gold-light text-[10px] uppercase tracking-[0.25em] font-semibold">
          <Sparkles className="w-3 h-3 text-gold" />
          BUYERA PRIVÉ CLUB
        </div>

        <h2 className="font-editorial-heading text-3xl sm:text-4xl text-cream-50 font-normal">
          Unlock 15% OFF Your First Haute Couture Order
        </h2>

        <p className="text-xs sm:text-sm text-cream-200/80 font-light max-w-lg mx-auto leading-relaxed">
          Subscribe to receive secret festive edits, bespoke trunk show invitations, and private VIP member previews.
        </p>

        {status === "success" ? (
          <div className="bg-white/10 backdrop-blur-md border border-gold p-6 max-w-md mx-auto space-y-3 animate-fadeIn">
            <div className="w-10 h-10 rounded-full bg-gold/20 text-gold flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-editorial-heading text-lg text-cream-50">
              Welcome to the Privé Circle
            </h3>
            <p className="text-xs text-cream-200/80 font-light">
              Your secret 15% off voucher code has been unlocked:
            </p>
            <div className="flex items-center justify-center gap-2 pt-1">
              <span className="font-mono text-base font-bold bg-charcoal px-3 py-1 text-gold border border-gold/40">
                BUYERA15
              </span>
              <button
                onClick={handleCopyCode}
                className="px-3 py-1 bg-gold text-charcoal text-xs font-semibold uppercase flex items-center gap-1 hover:bg-gold-light transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "COPIED" : "COPY CODE"}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <div className="relative flex-1">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-xs focus:outline-none focus:border-gold transition-colors"
              />
              <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-3.5" />
            </div>
            <Button
              type="submit"
              variant="gold"
              size="md"
              isLoading={status === "loading"}
              className="text-xs uppercase tracking-widest whitespace-nowrap"
            >
              JOIN PRIVÉ
            </Button>
          </form>
        )}

        {status === "error" && (
          <p className="text-xs text-rose-400 font-light">
            Something went wrong. Please check your email and try again.
          </p>
        )}

        <p className="text-[10px] text-cream-200/50 font-light">
          By signing up, you agree to BUYERA’s Privacy Policy. Instant unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
