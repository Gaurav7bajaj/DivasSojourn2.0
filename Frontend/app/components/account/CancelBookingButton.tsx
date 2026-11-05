"use client";

import Link from "next/link";
import { useState } from "react";
import { Loader2, X } from "lucide-react";
import {
  CANCELLATION_POLICY_NOTES,
  CANCELLATION_POLICY_SUMMARY,
  CANCELLATION_TERMS_HREF,
} from "../../data/cancellationPolicy";

type Props = {
  bookingId: string;
  tripTitle: string;
  onCancelled: () => void;
};

export default function CancelBookingButton({
  bookingId,
  tripTitle,
  onCancelled,
}: Props) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function confirmCancel() {
    setError("");
    setLoading(true);
    try {
      const response = await fetch(`/api/account/bookings/${bookingId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || "Unable to cancel this booking.");
      }
      setOpen(false);
      setReason("");
      onCancelled();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to cancel booking.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-full border border-white/20 px-4 font-[family-name:var(--font-dm-sans)] text-sm font-semibold text-[#C9C3B6] transition hover:border-white/40 hover:text-[#FBF8F1] sm:w-auto"
      >
        Cancel this trip
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-4 py-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-booking-title"
        >
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[24px] border border-white/10 bg-[#141417] p-6 shadow-2xl md:p-8">
            <button
              type="button"
              onClick={() => !loading && setOpen(false)}
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full text-[#C9C3B6] transition hover:bg-white/5 hover:text-[#FBF8F1]"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <h2
              id="cancel-booking-title"
              className="pr-10 font-[family-name:var(--font-playfair)] text-[1.6rem] font-semibold text-[#FBF8F1]"
            >
              Cancel {tripTitle}?
            </h2>
            <p className="mt-2 font-[family-name:var(--font-dm-sans)] text-[14px] leading-6 text-[#C9C3B6]">
              This stops future instalment payments for this booking. Any refund
              of amount already paid is handled manually as per our cancellation
              policy.
            </p>

            <div className="mt-5 rounded-2xl border border-white/[0.08] bg-[#0B0B0C] p-4">
              <p className="font-[family-name:var(--font-dm-sans)] text-[12px] font-bold uppercase tracking-[0.16em] text-[#D6AE3C]">
                Cancellation policy
              </p>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 font-[family-name:var(--font-dm-sans)] text-[14px] text-[#D9D3C6]">
                {CANCELLATION_POLICY_SUMMARY.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <ul className="mt-3 space-y-2 font-[family-name:var(--font-dm-sans)] text-[13px] leading-5 text-[#8F897D]">
                {CANCELLATION_POLICY_NOTES.map((note) => (
                  <li key={note}>• {note}</li>
                ))}
              </ul>
              <Link
                href={CANCELLATION_TERMS_HREF}
                target="_blank"
                className="mt-3 inline-block font-[family-name:var(--font-dm-sans)] text-[13px] font-semibold text-[#D6AE3C] hover:underline"
              >
                Read full terms →
              </Link>
            </div>

            <label className="mt-5 block font-[family-name:var(--font-dm-sans)] text-[13px] font-semibold text-[#8F897D]">
              Reason (optional)
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                disabled={loading}
                placeholder="Tell us why you need to cancel"
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0B0B0C] px-4 py-3 text-sm text-[#FBF8F1] outline-none focus:border-[#D6AE3C] disabled:opacity-60"
              />
            </label>

            {error ? (
              <p className="mt-3 font-[family-name:var(--font-dm-sans)] text-sm text-red-300">
                {error}
              </p>
            ) : null}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse">
              <button
                type="button"
                onClick={confirmCancel}
                disabled={loading}
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#B42318] px-4 font-[family-name:var(--font-dm-sans)] text-[15px] font-bold text-white transition hover:bg-[#912018] disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Cancelling…
                  </>
                ) : (
                  "Confirm cancellation"
                )}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={loading}
                className="inline-flex h-12 flex-1 items-center justify-center rounded-full border border-white/20 px-4 font-[family-name:var(--font-dm-sans)] text-[15px] font-semibold text-[#C9C3B6] transition hover:border-white/40 hover:text-[#FBF8F1] disabled:opacity-60"
              >
                Keep booking
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
