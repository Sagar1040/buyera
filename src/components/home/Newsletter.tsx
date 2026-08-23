"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Subscription failed");
      }

      setSubmitted(true);
      setEmail("");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-charcoal text-cream relative overflow-hidden border-t border-gold/20">
      {/* Decorative Gold Glow Circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center max-w-2xl">
        <span className="text-[10px] tracking-[0.25em] uppercase text-gold font-brand-badge font-semibold">
          THE BUYERA PRIVÉ
        </span>
        <h2 className="font-editorial-heading text-2xl sm:text-4xl text-cream font-normal mt-2 mb-4">
          Join The Inner Circle
        </h2>
        <p className="text-xs sm:text-sm text-cream-300/80 font-light max-w-md mx-auto mb-8 leading-relaxed">
          Be the first to access limited-edition drops, private salon trunk shows, and receive 10% off your inaugural order.
        </p>

        {submitted ? (
          <div className="inline-flex items-center gap-2 p-4 bg-charcoal-200 border border-gold/40 text-gold text-xs tracking-wider animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-gold" />
            Thank you for subscribing. Your invitation code has been prepared.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address..."
              className="flex-1 px-4 py-3.5 bg-charcoal-200 border border-charcoal-100 text-cream text-xs placeholder:text-cream-300/40 focus:outline-none focus:border-gold transition-colors"
            />
            <Button
              type="submit"
              variant="gold"
              size="md"
              isLoading={loading}
              className="whitespace-nowrap"
            >
              SUBSCRIBE
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </form>
        )}

        {error && <p className="text-xs text-rose-400 mt-3">{error}</p>}
      </div>
    </section>
  );
}
