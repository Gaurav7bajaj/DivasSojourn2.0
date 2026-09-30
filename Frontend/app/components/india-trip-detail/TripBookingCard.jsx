"use client";

import Link from "next/link";
import { ArrowRight, Check, X } from "lucide-react";
import { useMemo, useState } from "react";
import {
  formatInr,
  formatUsdApprox,
  getDepartures,
  getDisplayPrice,
} from "./tripDetailUtils";

export default function TripBookingCard({ trip }) {
  const departures = useMemo(() => getDepartures(trip), [trip]);
  const firstAvailable = departures.find((d) => !d.soldOut) || departures[0];
  const [selectedId, setSelectedId] = useState(firstAvailable?.id || "");
  const [callbackOpen, setCallbackOpen] = useState(false);

  const selected = departures.find((d) => d.id === selectedId) || firstAvailable;
  const price = getDisplayPrice(trip);
  const bookHref = `/payments?trip=${encodeURIComponent(trip.slug)}${
    selected?.startDate ? `&date=${encodeURIComponent(selected.startDate)}` : ""
  }`;
  const whatsappHref = `https://wa.me/919990022835?text=${encodeURIComponent(
    `Hi Divas Sojourn, I have a question about ${trip.title}${
      selected?.label ? ` (${selected.label})` : ""
    }.`,
  )}`;

  return (
    <>
      <aside className="space-y-5 lg:sticky lg:top-[152px]">
        <section className="rounded-[24px] border-[1.5px] border-[rgba(214,174,60,0.45)] bg-[#141417] p-7 shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
          <p className="font-[family-name:var(--font-dm-sans)] text-[13px] font-semibold text-[#8F897D]">
            Starting from
          </p>
          {price > 0 ? (
            <>
              <p className="mt-1 font-[family-name:var(--font-playfair)] text-[44px] font-semibold leading-none text-[#FBF8F1]">
                ₹{formatInr(price)}
              </p>
              <p className="mt-2 font-[family-name:var(--font-dm-sans)] text-[14px] text-[#C9C3B6]">
                per person
              </p>
              <p className="mt-1 font-[family-name:var(--font-dm-sans)] text-[13px] text-[#8F897D]">
                ≈ ${formatUsdApprox(price)} · twin sharing
              </p>
            </>
          ) : (
            <p className="mt-2 font-[family-name:var(--font-playfair)] text-[36px] font-semibold text-[#D6AE3C]">
              Coming soon
            </p>
          )}

          <div className="mt-7">
            <p className="font-[family-name:var(--font-dm-sans)] text-[12px] font-bold uppercase tracking-[0.16em] text-[#8F897D]">
              Choose a departure
            </p>
            <div role="radiogroup" aria-label="Departure dates" className="mt-3 space-y-2">
              {departures.map((dep) => {
                const checked = selected?.id === dep.id;
                const disabled = dep.soldOut;
                return (
                  <label
                    key={dep.id}
                    className={[
                      "flex h-14 cursor-pointer items-center gap-3 rounded-2xl border px-4 transition",
                      disabled
                        ? "cursor-not-allowed border-white/8 bg-[#121215] opacity-60"
                        : checked
                          ? "border-[rgba(214,174,60,0.7)] bg-[rgba(214,174,60,0.1)]"
                          : "border-white/8 bg-[#18181C] hover:border-white/16",
                    ].join(" ")}
                  >
                    <input
                      type="radio"
                      name="departure"
                      value={dep.id}
                      checked={checked}
                      disabled={disabled}
                      onChange={() => setSelectedId(dep.id)}
                      className="sr-only"
                    />
                    <span
                      className={[
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                        checked && !disabled
                          ? "border-[#D6AE3C]"
                          : "border-[#8F897D]",
                      ].join(" ")}
                      aria-hidden="true"
                    >
                      {checked && !disabled ? (
                        <span className="h-2.5 w-2.5 rounded-full bg-[#D6AE3C]" />
                      ) : null}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={[
                          "block font-[family-name:var(--font-dm-sans)] text-[14px] font-semibold",
                          disabled ? "text-[#8F897D] line-through" : "text-[#FBF8F1]",
                        ].join(" ")}
                      >
                        {dep.label}
                      </span>
                      {disabled ? (
                        <span className="font-[family-name:var(--font-dm-sans)] text-[12px] text-[#8F897D]">
                          Sold out
                        </span>
                      ) : dep.seatsLeft != null && dep.seatsLeft <= 10 ? (
                        <span className="font-[family-name:var(--font-dm-sans)] text-[12px] font-semibold text-[#D6AE3C]">
                          {dep.seatsLeft} seats left
                        </span>
                      ) : null}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <Link
            href={bookHref}
            className="mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#D6AE3C] font-[family-name:var(--font-dm-sans)] text-[16px] font-bold text-[#1A1405] transition hover:bg-[#E6BF4C]"
          >
            Book now
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>

          <button
            type="button"
            onClick={() => setCallbackOpen(true)}
            className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-full border border-[rgba(214,174,60,0.55)] font-[family-name:var(--font-dm-sans)] text-[14px] font-bold text-[#D6AE3C] transition hover:bg-[rgba(214,174,60,0.12)]"
          >
            Request a call back
          </button>

          <div className="mt-5 rounded-2xl border border-white/8 bg-[#121215] px-4 py-3">
            <p className="font-[family-name:var(--font-dm-sans)] text-[13px] leading-5 text-[#C9C3B6]">
              Pay a part now — partial payment is available on the final payment page.
            </p>
            <Link
              href="/payments#schedule"
              className="mt-2 inline-flex font-[family-name:var(--font-dm-sans)] text-[13px] font-bold text-[#D6AE3C] underline-offset-2 hover:underline"
            >
              See payment schedule
            </Link>
          </div>
        </section>

        <ul className="space-y-2.5 px-1">
          {[
            "Women-only small group",
            "100% in-house, no third parties",
            "Trip leader + 24/7 ground support",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#D6AE3C]" aria-hidden="true" />
              <span className="font-[family-name:var(--font-dm-sans)] text-[14px] text-[#C9C3B6]">
                {item}
              </span>
            </li>
          ))}
        </ul>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-1 font-[family-name:var(--font-dm-sans)] text-[14px] font-bold text-[#D6AE3C] transition hover:text-[#E6BF4C]"
        >
          Questions? WhatsApp us
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </aside>

      {callbackOpen ? (
        <CallbackModal
          trip={trip}
          departureLabel={selected?.label}
          onClose={() => setCallbackOpen(false)}
        />
      ) : null}
    </>
  );
}

function CallbackModal({ trip, departureLabel, onClose }) {
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [status, setStatus] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const phoneIsValid = /^[0-9]{10}$/.test(formData.phone);
    if (!formData.name.trim() || !phoneIsValid || !formData.email.includes("@")) {
      setStatus("Please enter a valid name, 10 digit phone number and email.");
      return;
    }

    setStatus("Sending...");
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          page: trip.shortName || trip.title || "Trip detail",
          interestedIn: trip.title || "",
          formType: "short",
          message: `Callback request for ${trip.title || "trip"}${
            departureLabel ? ` — ${departureLabel}` : ""
          }`,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setStatus(data.error || "Unable to submit. Please try again.");
        return;
      }
      setStatus("Thanks. Our team will call you back shortly.");
      setFormData({ name: "", phone: "", email: "" });
    } catch {
      setStatus("Unable to submit. Please try again.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/70 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="callback-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-[24px] border border-white/10 bg-[#141417] p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-[family-name:var(--font-dm-sans)] text-[12px] font-bold uppercase tracking-[0.18em] text-[#D6AE3C]">
              Enquiry
            </p>
            <h2
              id="callback-title"
              className="mt-1 font-[family-name:var(--font-playfair)] text-[1.6rem] font-semibold text-[#FBF8F1]"
            >
              Request a call back
            </h2>
            <p className="mt-1 font-[family-name:var(--font-dm-sans)] text-[13px] text-[#C9C3B6]">
              {trip.title}
              {departureLabel ? ` · ${departureLabel}` : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-[#C9C3B6] transition hover:text-[#FBF8F1]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <label className="block font-[family-name:var(--font-dm-sans)] text-[13px] font-semibold text-[#C9C3B6]">
            Full name*
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-[#0B0B0C] px-4 text-[#FBF8F1] outline-none focus:border-[#D6AE3C]"
            />
          </label>
          <label className="block font-[family-name:var(--font-dm-sans)] text-[13px] font-semibold text-[#C9C3B6]">
            Phone*
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              inputMode="numeric"
              maxLength={10}
              required
              className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-[#0B0B0C] px-4 text-[#FBF8F1] outline-none focus:border-[#D6AE3C]"
            />
          </label>
          <label className="block font-[family-name:var(--font-dm-sans)] text-[13px] font-semibold text-[#C9C3B6]">
            Email*
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-[#0B0B0C] px-4 text-[#FBF8F1] outline-none focus:border-[#D6AE3C]"
            />
          </label>
          <button
            type="submit"
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#D6AE3C] font-[family-name:var(--font-dm-sans)] text-[14px] font-bold text-[#1A1405] transition hover:bg-[#E6BF4C]"
          >
            Submit
          </button>
          {status ? (
            <p className="font-[family-name:var(--font-dm-sans)] text-[13px] text-[#C9C3B6]">{status}</p>
          ) : null}
        </form>
      </div>
    </div>
  );
}
