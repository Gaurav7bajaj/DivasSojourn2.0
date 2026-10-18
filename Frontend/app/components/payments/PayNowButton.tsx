"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

type Props = {
  bookingId: string;
  installmentId?: string;
  label?: string;
  className?: string;
};

export default function PayNowButton({
  bookingId,
  installmentId,
  label = "Pay Now",
  className = "",
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onPay() {
    if (!bookingId || loading) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/payments/easebuzz/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          ...(installmentId ? { installmentId } : {}),
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.checkoutUrl) {
        throw new Error(data.error || "Unable to start checkout");
      }
      window.location.href = data.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed to start");
      setLoading(false);
    }
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={onPay}
        disabled={loading || !bookingId}
        className="inline-flex h-[54px] w-full items-center justify-center gap-2 rounded-full bg-[#D6AE3C] px-7 font-[family-name:var(--font-dm-sans)] text-[15px] font-bold text-[#1A1405] transition hover:bg-[#E6BF4C] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D6AE3C] md:w-auto"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Redirecting…
          </>
        ) : (
          label
        )}
      </button>
      {error ? (
        <p className="mt-3 font-[family-name:var(--font-dm-sans)] text-sm text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
