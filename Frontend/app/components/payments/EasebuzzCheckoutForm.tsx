"use client";

import { FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import PayNowButton from "./PayNowButton";

type TripOption = {
  slug: string;
  title: string;
  shortName?: string;
  price: number;
  earlyBirdPrice?: number | null;
};

type Props = {
  trips: TripOption[];
};

export default function EasebuzzCheckoutForm({ trips }: Props) {
  const searchParams = useSearchParams();
  const tripFromQuery = searchParams.get("trip") || "";

  const [tripSlug, setTripSlug] = useState(tripFromQuery);
  const [firstname, setFirstname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [amountLabel, setAmountLabel] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selected = useMemo(
    () => trips.find((t) => t.slug === tripSlug) || null,
    [trips, tripSlug],
  );

  const displayAmount = selected
    ? selected.earlyBirdPrice ?? selected.price
    : null;

  async function onCreateBooking(event: FormEvent) {
    event.preventDefault();
    setError("");
    setBookingId("");
    setLoading(true);
    try {
      const response = await fetch("/api/payments/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripSlug, firstname, email, phone }),
      });
      const data = await response.json();
      if (!response.ok || !data.bookingId) {
        throw new Error(data.error || "Unable to create booking");
      }
      setBookingId(data.bookingId);
      setAmountLabel(data.amount);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="pay-online"
      className="scroll-mt-28 bg-[#0B0B0C] px-6 py-16 md:px-12 md:py-24 xl:px-24"
      aria-labelledby="easebuzz-pay-heading"
    >
      <div className="mx-auto max-w-[720px]">
        <div className="flex items-center gap-3">
          <span className="h-0.5 w-9 shrink-0 bg-[#D6AE3C]" aria-hidden="true" />
          <p className="font-[family-name:var(--font-dm-sans)] text-[13px] font-bold uppercase tracking-[0.24em] text-[#D6AE3C]">
            Online checkout
          </p>
        </div>
        <h2
          id="easebuzz-pay-heading"
          className="mt-4 font-[family-name:var(--font-playfair)] text-[36px] font-semibold leading-tight text-[#FBF8F1] md:text-[44px]"
        >
          Pay for your{" "}
          <em className="font-[family-name:var(--font-playfair)] font-medium italic text-[#E2BB4D]">
            trip
          </em>
        </h2>
        <p className="mt-3 font-[family-name:var(--font-dm-sans)] text-[15px] leading-relaxed text-[#C9C3B6]">
          Secure hosted checkout via Easebuzz. Amount is taken from the trip price in our
          system — not edited on this form.
        </p>

        <form
          onSubmit={onCreateBooking}
          className="mt-8 space-y-4 rounded-[24px] border border-white/[0.08] bg-[#141417] p-6 md:p-8"
        >
          <label className="block font-[family-name:var(--font-dm-sans)] text-xs font-semibold text-[#8F897D]">
            Trip
            <select
              required
              value={tripSlug}
              onChange={(e) => {
                setTripSlug(e.target.value);
                setBookingId("");
              }}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0B0B0C] px-4 py-3 text-sm text-[#FBF8F1]"
            >
              <option value="">Select a trip</option>
              {trips.map((trip) => (
                <option key={trip.slug} value={trip.slug}>
                  {trip.shortName || trip.title} — ₹
                  {(trip.earlyBirdPrice ?? trip.price).toLocaleString("en-IN")}
                </option>
              ))}
            </select>
          </label>

          <label className="block font-[family-name:var(--font-dm-sans)] text-xs font-semibold text-[#8F897D]">
            Full name
            <input
              required
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0B0B0C] px-4 py-3 text-sm text-[#FBF8F1]"
              autoComplete="name"
            />
          </label>

          <label className="block font-[family-name:var(--font-dm-sans)] text-xs font-semibold text-[#8F897D]">
            Email
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0B0B0C] px-4 py-3 text-sm text-[#FBF8F1]"
              autoComplete="email"
            />
          </label>

          <label className="block font-[family-name:var(--font-dm-sans)] text-xs font-semibold text-[#8F897D]">
            Phone (10 digits)
            <input
              required
              inputMode="numeric"
              pattern="[0-9]{10}"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0B0B0C] px-4 py-3 text-sm text-[#FBF8F1]"
              autoComplete="tel"
            />
          </label>

          {displayAmount != null ? (
            <p className="font-[family-name:var(--font-dm-sans)] text-sm text-[#FBF8F1]">
              Amount due:{" "}
              <span className="font-bold text-[#D6AE3C]">
                ₹{Number(displayAmount).toLocaleString("en-IN")}
              </span>
            </p>
          ) : null}

          {!bookingId ? (
            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-[54px] w-full items-center justify-center gap-2 rounded-full border-[1.5px] border-[#D6AE3C] px-7 font-[family-name:var(--font-dm-sans)] text-[15px] font-semibold text-[#D6AE3C] transition hover:bg-[rgba(214,174,60,0.12)] disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Creating booking…
                </>
              ) : (
                "Continue to Pay Now"
              )}
            </button>
          ) : (
            <div className="space-y-3 border-t border-white/10 pt-4">
              <p className="font-[family-name:var(--font-dm-sans)] text-sm text-[#C9C3B6]">
                Booking ready{amountLabel ? ` · ₹${amountLabel}` : ""}. Click Pay Now to open
                Easebuzz secure checkout.
              </p>
              <PayNowButton bookingId={bookingId} />
            </div>
          )}

          {error ? (
            <p className="font-[family-name:var(--font-dm-sans)] text-sm text-red-400" role="alert">
              {error}
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
