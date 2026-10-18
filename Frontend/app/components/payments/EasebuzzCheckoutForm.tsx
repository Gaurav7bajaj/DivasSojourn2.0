"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import PayNowButton from "./PayNowButton";

type TripOption = {
  slug: string;
  title: string;
  shortName?: string;
  price: number;
  earlyBirdPrice?: number | null;
  destination?: string;
};

type InstallmentPreview = {
  id: string;
  stage: string;
  label: string;
  amountDue: string;
  dueDate: string | null;
  status: string;
};

type Traveler = {
  id: string;
  fullName: string;
  phone: string;
  email: string;
};

type Props = {
  trips: TripOption[];
};

export default function EasebuzzCheckoutForm({ trips }: Props) {
  const searchParams = useSearchParams();
  const tripFromQuery = searchParams.get("trip") || "";
  const qs = searchParams.toString();
  const returnTo = `/payments${qs ? `?${qs}` : ""}#pay-online`;
  const loginHref = `/account?next=${encodeURIComponent(returnTo)}`;

  const [authLoading, setAuthLoading] = useState(true);
  const [traveler, setTraveler] = useState<Traveler | null>(null);
  const [tripSlug, setTripSlug] = useState(tripFromQuery);
  const [firstname, setFirstname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [payNowAmount, setPayNowAmount] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [installments, setInstallments] = useState<InstallmentPreview[]>([]);
  const [nextInstallmentId, setNextInstallmentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/account/me");
        if (!res.ok) {
          if (!cancelled) setTraveler(null);
          return;
        }
        const data = await res.json();
        if (cancelled) return;
        const t = data.traveler as Traveler;
        setTraveler(t);
        setFirstname(t.fullName || "");
        setEmail(t.email || "");
        setPhone(t.phone || "");
      } catch {
        if (!cancelled) setTraveler(null);
      } finally {
        if (!cancelled) setAuthLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const selected = useMemo(
    () => trips.find((t) => t.slug === tripSlug) || null,
    [trips, tripSlug],
  );

  const displayTotal = selected
    ? selected.earlyBirdPrice ?? selected.price
    : null;

  async function onCreateBooking(event: FormEvent) {
    event.preventDefault();
    if (!traveler) {
      setError("Please sign in to book a trip.");
      return;
    }
    setError("");
    setBookingId("");
    setInstallments([]);
    setLoading(true);
    try {
      const response = await fetch("/api/payments/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripSlug, firstname, email, phone }),
      });
      const data = await response.json();
      if (response.status === 401) {
        throw new Error("Please sign in to book a trip.");
      }
      if (!response.ok || !data.bookingId) {
        throw new Error(data.error || "Unable to create booking");
      }
      setBookingId(data.bookingId);
      setPayNowAmount(data.payNowAmount || data.amount);
      setTotalAmount(data.amount);
      const rows: InstallmentPreview[] = data.installments || [];
      setInstallments(rows);
      const nextDue =
        rows.find((row) => row.status === "DUE") || rows[0] || null;
      setNextInstallmentId(nextDue?.id || "");
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
          Sign in first, then pay the due installment for your schedule (advance
          first, then later stages).
        </p>

        {authLoading ? (
          <div className="mt-8 flex items-center justify-center rounded-[24px] border border-white/[0.08] bg-[#141417] py-16">
            <Loader2 className="h-7 w-7 animate-spin text-[#D6AE3C]" aria-hidden="true" />
            <span className="sr-only">Checking sign-in</span>
          </div>
        ) : !traveler ? (
          <div className="mt-8 space-y-5 rounded-[24px] border border-white/[0.08] bg-[#141417] p-6 md:p-8">
            <p className="font-[family-name:var(--font-dm-sans)] text-[15px] leading-relaxed text-[#C9C3B6]">
              You need to sign in with your full name and phone number before you
              can book or pay for a trip.
            </p>
            <Link
              href={loginHref}
              className="inline-flex h-[54px] w-full items-center justify-center rounded-full bg-[#D6AE3C] px-7 font-[family-name:var(--font-dm-sans)] text-[15px] font-bold text-[#1A1405] transition hover:bg-[#E6BF4C]"
            >
              Sign in to book
            </Link>
          </div>
        ) : (
          <form
            onSubmit={onCreateBooking}
            className="mt-8 space-y-4 rounded-[24px] border border-white/[0.08] bg-[#141417] p-6 md:p-8"
          >
            <p className="font-[family-name:var(--font-dm-sans)] text-[15px] font-semibold text-[#FBF8F1]">
              Enter the traveler&apos;s details
            </p>
            <p className="!mt-1 font-[family-name:var(--font-dm-sans)] text-sm text-[#8F897D]">
              Booking as{" "}
              <span className="font-semibold text-[#C9C3B6]">{traveler.fullName}</span>
              {" · "}
              {traveler.phone}
            </p>

            <label className="block font-[family-name:var(--font-dm-sans)] text-xs font-semibold text-[#8F897D]">
              Trip
              <select
                required
                value={tripSlug}
                onChange={(e) => {
                  setTripSlug(e.target.value);
                  setBookingId("");
                  setInstallments([]);
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
              Phone
              <input
                disabled
                value={phone}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0B0B0C] px-4 py-3 text-sm text-[#8F897D]"
              />
            </label>

            {displayTotal != null ? (
              <p className="font-[family-name:var(--font-dm-sans)] text-sm text-[#FBF8F1]">
                Trip total:{" "}
                <span className="font-bold text-[#D6AE3C]">
                  ₹{Number(displayTotal).toLocaleString("en-IN")}
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
                  "Create booking & see schedule"
                )}
              </button>
            ) : (
              <div className="space-y-4 border-t border-white/10 pt-4">
                {installments.length ? (
                  <ul className="space-y-2">
                    {installments.map((row) => (
                      <li
                        key={row.id}
                        className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-[#0B0B0C] px-4 py-3 font-[family-name:var(--font-dm-sans)] text-sm"
                      >
                        <span className="text-[#C9C3B6]">
                          {row.label}
                          <span className="mt-1 block text-[12px] uppercase tracking-wide text-[#8F897D]">
                            {row.status}
                            {row.dueDate
                              ? ` · due ${new Date(row.dueDate).toLocaleDateString("en-IN")}`
                              : ""}
                          </span>
                        </span>
                        <span className="shrink-0 font-semibold text-[#FBF8F1]">
                          ₹{Number(row.amountDue).toLocaleString("en-IN")}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                <p className="font-[family-name:var(--font-dm-sans)] text-sm text-[#C9C3B6]">
                  Trip total ₹{Number(totalAmount || 0).toLocaleString("en-IN")}. Pay now:{" "}
                  <span className="font-bold text-[#D6AE3C]">
                    ₹{Number(payNowAmount || 0).toLocaleString("en-IN")}
                  </span>
                </p>
                <PayNowButton
                  bookingId={bookingId}
                  installmentId={nextInstallmentId || undefined}
                  label={`Pay ₹${Number(payNowAmount || 0).toLocaleString("en-IN")} now`}
                />
              </div>
            )}

            {error ? (
              <p className="font-[family-name:var(--font-dm-sans)] text-sm text-red-400" role="alert">
                {error}
              </p>
            ) : null}
          </form>
        )}
      </div>
    </section>
  );
}
