"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message || "An error occurred during account registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-canvas">
      <div className="w-full max-w-md bg-white border border-canvas-border p-8 sm:p-10 shadow-luxury">
        <div className="text-center mb-8 space-y-3 flex flex-col items-center">
          <Link href="/">
            <Logo size="md" showTagline={true} />
          </Link>
          <span className="text-[10px] tracking-[0.25em] uppercase text-gold font-brand-badge font-semibold">
            THE PRIVÉ ATELIER
          </span>
          <h1 className="font-editorial-heading text-2xl text-charcoal font-normal">
            Create an Account
          </h1>
          <p className="text-xs text-charcoal/60">
            Join the BUYERA Privé Circle for exclusive previews and privileges.
          </p>
        </div>

        {error && (
          <div className="p-3 mb-6 bg-rose-50 border border-rose-200 text-rose-600 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Aisha Khan"
          />

          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@domain.com"
          />

          <Input
            label="Mobile Number (Optional)"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
          />

          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 6 characters"
          />

          <p className="text-[11px] text-charcoal/50 leading-relaxed pt-1">
            By creating an account, you agree to BUYERA's{" "}
            <Link href="/terms" className="underline hover:text-gold">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-gold">
              Privacy Policy
            </Link>
            .
          </p>

          <Button
            type="submit"
            variant="gold"
            size="lg"
            isLoading={loading}
            className="w-full mt-4"
          >
            CREATE ACCOUNT
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-canvas-border text-center text-xs text-charcoal/70">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-gold-dark hover:underline font-semibold"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
