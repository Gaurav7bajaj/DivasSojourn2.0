"use client";

import Image from "next/image";
import { FormEvent, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed.");
        return;
      }

      router.replace(redirectTo);
      router.refresh();
    } catch {
      setError("Unable to log in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-16 max-w-md rounded-2xl bg-white p-8 shadow">
      <div className="mb-6 flex justify-center rounded-xl bg-[#000000] px-4 py-4">
        <Image
          src="/divas-sojourn-logo.png"
          alt="Divas Sojourn"
          width={220}
          height={54}
          priority
          className="h-12 w-auto object-contain"
        />
      </div>
      <p className="text-xs font-black uppercase tracking-[0.25em] text-[#0F9B9B]">Admin</p>
      <h1 className="mt-2 text-3xl font-black">Sign in</h1>
      <p className="mt-2 text-sm text-[#555555]">Use your admin email and password to continue.</p>

      <label className="mt-6 block text-sm font-bold">
        Email
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#0F9B9B]"
        />
      </label>

      <label className="mt-4 block text-sm font-bold">
        Password
        <input
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#0F9B9B]"
        />
      </label>

      {error ? <p className="mt-4 text-sm font-semibold text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-full bg-[#0F9B9B] px-5 py-3 text-sm font-black text-white transition hover:bg-[#0d8585] disabled:opacity-60"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="mt-16 text-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
