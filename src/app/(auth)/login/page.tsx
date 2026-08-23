"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CheckCircle2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const callbackUrl = searchParams.get("callbackUrl") || "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <div className="w-full max-w-md bg-white border border-canvas-border p-8 sm:p-10 shadow-luxury">
      <div className="text-center mb-8 space-y-2">
        <span className="text-[10px] tracking-[0.25em] uppercase text-gold font-brand-badge font-semibold">
          THE PRIVÉ ATELIER
        </span>
        <h1 className="font-editorial-heading text-2xl sm:text-3xl text-charcoal font-normal">
          Sign In to BUYERA
        </h1>
        <p className="text-xs text-charcoal/60">
          Access your saved silhouettes, orders, and wishlist.
        </p>
      </div>

      {registered && (
        <div className="p-3 mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Account created successfully. Please sign in with your credentials.</span>
        </div>
      )}

      {error && (
        <div className="p-3 mb-6 bg-rose-50 border border-rose-200 text-rose-600 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@domain.com"
        />

        <Input
          label="Password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 text-charcoal/70 cursor-pointer">
            <input type="checkbox" className="accent-gold rounded-none" />
            Remember me
          </label>
          <Link
            href="/forgot-password"
            className="text-gold hover:underline text-xs"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={loading}
          className="w-full mt-4"
        >
          SIGN IN
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-canvas-border text-center text-xs text-charcoal/70">
        New to BUYERA?{" "}
        <Link
          href="/register"
          className="text-gold-dark hover:underline font-semibold"
        >
          Create an Account
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-canvas">
      <Suspense
        fallback={
          <div className="w-full max-w-md bg-white border border-canvas-border p-10 text-center text-xs text-charcoal/50">
            Loading authentication...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
