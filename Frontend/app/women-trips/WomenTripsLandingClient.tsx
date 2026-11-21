"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CONTACT,
  WHATSAPP_LANDING_MESSAGE,
  WOMEN_TRIPS_SOURCE,
} from "./constants";
import type {
  LandingFaq,
  LandingReview,
  WomenTripCard,
} from "./lib/loadLandingData";
import {
  LEAD_TRIP_STORAGE_KEY,
  captureUtmParams,
  trackWomenTripsEvent,
} from "./lib/tracking";

type Stats = {
  womenTravelled: string;
  since: string;
  googleRating: number;
  googleCount: number;
  googleCountLabel: string;
  tripadvisorRating: number;
  tripadvisorCount: number;
  tripadvisorCountLabel: string;
};

type Props = {
  trips: WomenTripCard[];
  faqs: LandingFaq[];
  reviews: LandingReview[];
  stats: Stats;
};

const GOLD = "#D6AE3C";
const NOT_SURE = "__not_sure__";

const WHY_CARDS = [
  {
    title: "Exclusively for women",
    body: "Travel with like-minded women in a comfortable, judgement-free group.",
    icon: "shield",
  },
  {
    title: "Trip leader on every tour",
    body: "An experienced leader handles the logistics so you can simply enjoy.",
    icon: "leader",
  },
  {
    title: "Thoughtfully planned trips",
    body: "Itineraries designed for comfort, culture and memorable moments.",
    icon: "map",
  },
  {
    title: "Support from start to finish",
    body: "From planning and paperwork to on-ground help, we are with you.",
    icon: "support",
  },
  {
    title: "No companion needed",
    body: "Stop waiting for friends to be free. Come solo, leave with friends.",
    icon: "solo",
  },
  {
    title: "Friendships beyond travel",
    body: "Our travellers stay in touch long after the trip ends.",
    icon: "heart",
  },
] as const;

function formatInr(amount: number) {
  return `₹${new Intl.NumberFormat("en-IN").format(amount)}`;
}

function whyIcon(kind: (typeof WHY_CARDS)[number]["icon"]) {
  const common = "h-7 w-7";
  switch (kind) {
    case "shield":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3z"
            stroke={GOLD}
            strokeWidth="1.6"
          />
        </svg>
      );
    case "leader":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="8" r="3.2" stroke={GOLD} strokeWidth="1.6" />
          <path d="M5 19c1.5-3.2 4-5 7-5s5.5 1.8 7 5" stroke={GOLD} strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "map":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 4l6 2 5-2v14l-5 2-6-2-5 2V6l5-2z" stroke={GOLD} strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M9 4v14M15 6v14" stroke={GOLD} strokeWidth="1.6" />
        </svg>
      );
    case "support":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 21a9 9 0 100-18 9 9 0 000 18z" stroke={GOLD} strokeWidth="1.6" />
          <path d="M12 8v4l2.5 2.5" stroke={GOLD} strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "solo":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="7" r="3" stroke={GOLD} strokeWidth="1.6" />
          <path d="M6 20c1.2-3.5 3.4-5 6-5s4.8 1.5 6 5" stroke={GOLD} strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 20s-7-4.4-7-9.2A3.8 3.8 0 0112 7.5a3.8 3.8 0 017 3.3C19 15.6 12 20 12 20z"
            stroke={GOLD}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

function Stars({ count = 5 }: { count?: number }) {
  return (
    <span className="inline-flex gap-0.5 text-[#D6AE3C]" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i}>★</span>
      ))}
    </span>
  );
}

function scrollToEnquire() {
  document.getElementById("enquire")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function waLink(message: string) {
  return `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export default function WomenTripsLandingClient({ trips, faqs, reviews, stats }: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [tripSlug, setTripSlug] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [openFaq, setOpenFaq] = useState(faqs[0]?.id || "");
  const [utm, setUtm] = useState<Record<string, string>>({});

  useEffect(() => {
    setUtm(captureUtmParams());
  }, []);

  const tripOptions = useMemo(
    () => [
      ...trips.map((trip) => ({ value: trip.slug, label: trip.selectLabel })),
      { value: NOT_SURE, label: "Not sure yet – suggest a trip" },
    ],
    [trips],
  );

  const selectTripAndScroll = (slug: string) => {
    setTripSlug(slug);
    setErrors((prev) => ({ ...prev, trip: "" }));
    scrollToEnquire();
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Name is required.";
    else if (name.trim().length < 2) next.name = "Please enter your full name (at least 2 characters).";
    if (!phone.trim()) next.phone = "WhatsApp number is required.";
    else if (!/^[6-9]\d{9}$/.test(phone)) {
      next.phone = "Enter a valid 10-digit Indian mobile number starting with 6–9.";
    }
    if (!city.trim()) next.city = "City is required.";
    else if (city.trim().length < 2) next.city = "Please enter your city.";
    if (!tripSlug) next.trip = "Please select which trip interests you.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setFormError("");
    if (!validate()) return;

    const selected =
      tripSlug === NOT_SURE
        ? null
        : trips.find((trip) => trip.slug === tripSlug) || null;
    const interestedIn =
      tripSlug === NOT_SURE
        ? "Not sure yet – suggest a trip"
        : selected?.title || selected?.shortName || tripSlug;

    const utmLines = Object.entries(utm)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");

    const message = [
      `City: ${city.trim()}`,
      `Selected trip: ${interestedIn}`,
      utmLines ? `Campaign params:\n${utmLines}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    setSubmitting(true);
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone,
          message,
          page: WOMEN_TRIPS_SOURCE,
          source: WOMEN_TRIPS_SOURCE,
          interestedIn,
          travelers: city.trim(),
          travelDate: selected?.dates || "",
          formType: "short",
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setFormError(data.error || "Unable to submit enquiry. Please try again.");
        return;
      }

      try {
        sessionStorage.setItem(LEAD_TRIP_STORAGE_KEY, interestedIn);
      } catch {
        /* ignore */
      }

      router.push("/women-trips/thank-you");
    } catch {
      setFormError("Unable to submit enquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const year = new Date().getFullYear();

  return (
    <div className="bg-[#0B0B0C] pb-[5.5rem] font-[family-name:var(--font-dm-sans)] text-[#FBF8F1] min-[720px]:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B0B0C]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Image
              src="/divas-sojourn-logo.png"
              alt="Divas Sojourn"
              width={140}
              height={40}
              className="h-9 w-auto"
              priority
            />
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`tel:${CONTACT.phoneTel}`}
              onClick={() => trackWomenTripsEvent("women_trips_call_click", { location: "header" })}
              className="hidden text-sm font-semibold text-[#D6AE3C] hover:text-[#E6BF4C] sm:inline"
            >
              {CONTACT.phoneDisplay}
            </a>
            <button
              type="button"
              onClick={scrollToEnquire}
              className="inline-flex h-10 items-center justify-center rounded-full bg-[#D6AE3C] px-4 text-sm font-bold text-[#1A1405] transition hover:bg-[#E6BF4C]"
            >
              Get trip details
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:py-14">
        <div>
          <p className="inline-flex rounded-full border border-[rgba(214,174,60,0.45)] bg-[rgba(214,174,60,0.12)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#D6AE3C]">
            Women-only international group tours
          </p>
          <h1 className="mt-5 font-[family-name:var(--font-playfair)] text-[2.15rem] font-medium leading-[1.15] sm:text-[2.75rem] lg:text-[3.1rem]">
            Travel the World with{" "}
            <em className="not-italic italic text-[#D6AE3C]">Women</em> Like You
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[#C9C3B6] sm:text-[17px]">
            Dreaming of Japan, Russia or Sri Lanka but have no one to travel with? Join a Divas
            Sojourn women-only group: a trip leader, like-minded companions and every detail planned
            for you.
          </p>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              "Women-only groups, always",
              "Dedicated trip leader on every tour",
              "Join solo – no companion needed",
              "14,000+ women travelled since 2015",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-[15px] text-[#FBF8F1]">
                <span
                  className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[rgba(214,174,60,0.18)] text-[11px] font-bold text-[#D6AE3C]"
                  aria-hidden="true"
                >
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="relative mt-8 overflow-hidden rounded-[1.25rem] border border-white/10">
            <div className="relative h-[260px] sm:h-[340px] lg:h-[400px]">
              <Image
                src="/images/women-trips/hero-northern-lights.webp"
                alt="Divas Sojourn travellers under the Northern Lights"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-cover object-[center_62%]"
              />
            </div>
            <div className="absolute bottom-3 left-3 rounded-full border border-[rgba(214,174,60,0.5)] bg-[rgba(8,8,10,0.82)] px-3 py-1.5 text-xs font-semibold text-[#FBF8F1]">
              <span className="text-[#D6AE3C]">{stats.googleRating}</span>{" "}
              <Stars />{" "}
              <span className="text-[#C9C3B6]">{stats.googleCount}+ Google reviews</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div
          id="enquire"
          className="scroll-mt-24 rounded-[1.35rem] border border-[rgba(214,174,60,0.4)] bg-[#121212] p-5 sm:p-7"
        >
          <h2 className="font-[family-name:var(--font-playfair)] text-[1.85rem] font-medium leading-tight">
            Get the itinerary & <em className="italic text-[#D6AE3C]">price</em>
          </h2>
          <p className="mt-2 text-sm text-[#C9C3B6]">
            Our travel team will send you the full trip details on WhatsApp.
          </p>

          <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
            <div>
              <label htmlFor="wt-name" className="mb-1.5 block text-sm font-semibold">
                Your name <span className="text-[#D6AE3C]">*</span>
              </label>
              <input
                id="wt-name"
                name="name"
                required
                aria-required="true"
                autoComplete="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                }}
                className="h-12 w-full rounded-full border border-white/15 bg-[#0B0B0C] px-4 text-base text-[#FBF8F1] outline-none placeholder:text-[#8F897D] focus:border-[#D6AE3C]"
                placeholder="Full name"
              />
              {errors.name ? <p className="mt-1.5 text-sm text-red-400">{errors.name}</p> : null}
            </div>

            <div>
              <label htmlFor="wt-phone" className="mb-1.5 block text-sm font-semibold">
                WhatsApp number <span className="text-[#D6AE3C]">*</span>
              </label>
              <div className="flex overflow-hidden rounded-full border border-white/15 bg-[#0B0B0C] focus-within:border-[#D6AE3C]">
                <span className="inline-flex items-center border-r border-white/10 px-3 text-sm font-semibold text-[#C9C3B6]">
                  +91
                </span>
                <input
                  id="wt-phone"
                  name="phone"
                  required
                  aria-required="true"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
                  }}
                  className="h-12 w-full bg-transparent px-3 text-base text-[#FBF8F1] outline-none placeholder:text-[#8F897D]"
                  placeholder="10-digit mobile"
                />
              </div>
              {errors.phone ? <p className="mt-1.5 text-sm text-red-400">{errors.phone}</p> : null}
            </div>

            <div>
              <label htmlFor="wt-city" className="mb-1.5 block text-sm font-semibold">
                Your city <span className="text-[#D6AE3C]">*</span>
              </label>
              <input
                id="wt-city"
                name="city"
                required
                aria-required="true"
                autoComplete="address-level2"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  if (errors.city) setErrors((prev) => ({ ...prev, city: "" }));
                }}
                className="h-12 w-full rounded-full border border-white/15 bg-[#0B0B0C] px-4 text-base text-[#FBF8F1] outline-none placeholder:text-[#8F897D] focus:border-[#D6AE3C]"
                placeholder="City"
              />
              {errors.city ? <p className="mt-1.5 text-sm text-red-400">{errors.city}</p> : null}
            </div>

            <div>
              <label htmlFor="wt-trip" className="mb-1.5 block text-sm font-semibold">
                Which trip interests you? <span className="text-[#D6AE3C]">*</span>
              </label>
              <select
                id="wt-trip"
                name="trip"
                required
                aria-required="true"
                value={tripSlug}
                onChange={(e) => {
                  setTripSlug(e.target.value);
                  if (errors.trip) setErrors((prev) => ({ ...prev, trip: "" }));
                }}
                className="h-12 w-full appearance-none rounded-full border border-white/15 bg-[#0B0B0C] px-4 text-base text-[#FBF8F1] outline-none focus:border-[#D6AE3C]"
              >
                <option value="">Select a trip</option>
                {tripOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.trip ? <p className="mt-1.5 text-sm text-red-400">{errors.trip}</p> : null}
            </div>

            {formError ? (
              <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {formError}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#D6AE3C] text-[15px] font-bold text-[#1A1405] transition hover:bg-[#E6BF4C] disabled:opacity-60"
            >
              {submitting ? "Sending…" : "Send me the trip details"}
            </button>

            <p className="text-center text-xs leading-relaxed text-[#8F897D]">
              We&apos;ll only use your details to contact you about this enquiry.{" "}
              <Link href="/privacy-policy" className="text-[#D6AE3C] underline-offset-2 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-[#8F897D]">
            <span className="h-px flex-1 bg-white/10" />
            or talk to us now
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <a
              href={`tel:${CONTACT.phoneTel}`}
              onClick={() => trackWomenTripsEvent("women_trips_call_click", { location: "form" })}
              className="inline-flex h-11 items-center justify-center rounded-full border border-white/20 text-sm font-semibold text-[#FBF8F1] transition hover:border-[#D6AE3C] hover:text-[#D6AE3C]"
            >
              Call us
            </a>
            <a
              href={waLink(WHATSAPP_LANDING_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackWomenTripsEvent("women_trips_whatsapp_click", { location: "form" })
              }
              className="inline-flex h-11 items-center justify-center rounded-full border border-[#25D366]/50 bg-[#25D366]/15 text-sm font-semibold text-[#FBF8F1] transition hover:bg-[#25D366]/25"
            >
              WhatsApp us
            </a>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-y border-[#D6AE3C]/35 bg-[#161616]">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 sm:grid-cols-4 sm:px-6">
          {[
            { value: stats.womenTravelled, label: "women have travelled with us" },
            { value: `Since ${stats.since}`, label: "women-only group tours" },
            {
              value: `${stats.googleRating} ★`,
              label: `Google rating · ${stats.googleCount}+ reviews`,
            },
            {
              value: `${stats.tripadvisorRating} ★`,
              label: `Tripadvisor · ${stats.tripadvisorCount}+ reviews`,
            },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <p className="font-[family-name:var(--font-playfair)] text-2xl font-semibold text-[#D6AE3C] sm:text-[1.75rem]">
                {item.value}
              </p>
              <p className="mt-1 text-xs text-[#C9C3B6] sm:text-sm">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Departures */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="font-[family-name:var(--font-playfair)] text-[2rem] font-medium sm:text-[2.4rem]">
          Upcoming women-only <em className="italic text-[#D6AE3C]">departures</em>
        </h2>
        <p className="mt-2 max-w-2xl text-base text-[#C9C3B6]">
          Pick a trip and we&apos;ll send you the day-by-day itinerary on WhatsApp.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {trips.map((trip) => (
            <article
              key={trip.slug}
              className="overflow-hidden rounded-[1.15rem] border border-white/10 bg-[#161616]"
            >
              <div className="relative h-[180px]">
                <Image
                  src={trip.image}
                  alt={trip.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                  loading="lazy"
                />
                {trip.monthBadge ? (
                  <span className="absolute left-3 top-3 rounded-full border border-[rgba(214,174,60,0.55)] bg-[rgba(8,8,10,0.82)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#D6AE3C]">
                    {trip.monthBadge}
                  </span>
                ) : null}
              </div>
              <div className="p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#D6AE3C]">
                  {trip.country}
                </p>
                <h3 className="mt-1.5 font-[family-name:var(--font-playfair)] text-xl font-medium leading-snug">
                  {trip.title}
                </h3>
                <p className="mt-2 text-sm text-[#FBF8F1]">{trip.dates}</p>
                <p className="mt-1 text-sm text-[#8F897D]">{trip.route}</p>
                <p className="mt-3 text-lg font-semibold text-white">
                  from <span className="text-white">{formatInr(trip.priceFrom)}</span>{" "}
                  <span className="text-sm font-normal text-[#C9C3B6]">per person</span>
                </p>
                <button
                  type="button"
                  onClick={() => selectTripAndScroll(trip.slug)}
                  className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-full bg-[#D6AE3C] text-sm font-bold text-[#1A1405] transition hover:bg-[#E6BF4C]"
                >
                  Get itinerary & price
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#121212] px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-[family-name:var(--font-playfair)] text-[2rem] font-medium sm:text-[2.4rem]">
            How it <em className="italic text-[#D6AE3C]">works</em>
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              {
                n: "1",
                title: "Tell us your trip",
                body: "Fill the short form or WhatsApp us with the trip you are interested in.",
              },
              {
                n: "2",
                title: "Get the itinerary",
                body: "Our travel team shares the day-by-day plan and price, and answers every question.",
              },
              {
                n: "3",
                title: "Book & meet your tribe",
                body: "Confirm your seat, join the group chat and get ready to travel together.",
              },
            ].map((step) => (
              <div
                key={step.n}
                className="rounded-[1.15rem] border border-white/10 bg-[#0B0B0C] p-5"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#D6AE3C] text-sm font-black text-[#1A1405]">
                  {step.n}
                </span>
                <h3 className="mt-4 font-[family-name:var(--font-playfair)] text-xl font-medium">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#C9C3B6]">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="font-[family-name:var(--font-playfair)] text-[2rem] font-medium sm:text-[2.4rem]">
          Why women travel with <em className="italic text-[#D6AE3C]">Divas Sojourn</em>
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_CARDS.map((card) => (
            <div
              key={card.title}
              className="rounded-[1.15rem] border border-white/10 bg-[#121212] p-5"
            >
              <div className="text-[#D6AE3C]">{whyIcon(card.icon)}</div>
              <h3 className="mt-4 text-lg font-bold">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#C9C3B6]">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-[#121212] px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-[family-name:var(--font-playfair)] text-[2rem] font-medium sm:text-[2.4rem]">
            What our travellers <em className="italic text-[#D6AE3C]">say</em>
          </h2>
          <p className="mt-2 text-sm text-[#C9C3B6] sm:text-base">
            {stats.googleRating} on Google ({stats.googleCountLabel}) · {stats.tripadvisorRating} on
            Tripadvisor ({stats.tripadvisorCountLabel})
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-[1.15rem] border border-white/10 bg-[#0B0B0C] p-5"
              >
                <Stars count={review.rating} />
                <p className="mt-3 text-[15px] leading-relaxed text-[#FBF8F1]">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#D6AE3C] text-sm font-black text-[#1A1405]">
                    {review.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-bold">{review.name}</p>
                    {review.tripLabel ? (
                      <p className="text-xs text-[#8F897D]">{review.tripLabel}</p>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <h2 className="font-[family-name:var(--font-playfair)] text-[2rem] font-medium sm:text-[2.4rem]">
          Questions women <em className="italic text-[#D6AE3C]">ask us</em>
        </h2>
        <div className="mt-8 space-y-3">
          {faqs.map((faq) => {
            const open = openFaq === faq.id;
            return (
              <div key={faq.id} className="rounded-[1rem] border border-white/10 bg-[#121212]">
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenFaq(open ? "" : faq.id)}
                  className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left text-[15px] font-semibold sm:px-5"
                >
                  <span>{faq.question}</span>
                  <span className="text-xl text-[#D6AE3C]" aria-hidden="true">
                    {open ? "−" : "+"}
                  </span>
                </button>
                {open ? (
                  <div className="border-t border-white/10 px-4 pb-4 pt-3 text-sm leading-relaxed text-[#C9C3B6] sm:px-5">
                    {faq.answer}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-[rgba(214,174,60,0.35)] bg-[#0B0B0C] px-4 py-14 sm:px-6">
        <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-2">
          <div>
            <h2 className="font-[family-name:var(--font-playfair)] text-[2rem] font-medium leading-tight sm:text-[2.5rem]">
              Don&apos;t wait for the perfect travel companion. Find your{" "}
              <em className="italic text-[#D6AE3C]">travel tribe.</em>
            </h2>
            <p className="mt-3 text-base text-[#C9C3B6]">
              Get the itinerary for your next women-only trip in one message.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={scrollToEnquire}
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#D6AE3C] px-6 text-sm font-bold text-[#1A1405] transition hover:bg-[#E6BF4C]"
              >
                Get trip details
              </button>
              <a
                href={`tel:${CONTACT.phoneTel}`}
                onClick={() => trackWomenTripsEvent("women_trips_call_click", { location: "final_cta" })}
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/25 px-6 text-sm font-semibold text-[#FBF8F1] transition hover:border-[#D6AE3C] hover:text-[#D6AE3C]"
              >
                Call {CONTACT.phoneDisplay}
              </a>
            </div>
          </div>
          <div className="relative h-[280px] overflow-hidden rounded-[1.25rem] border border-white/10 sm:h-[340px]">
            <Image
              src="/images/women-trips/cta-city-viewpoint.webp"
              alt="Divas Sojourn travellers together at a city viewpoint"
              fill
              sizes="(max-width: 1024px) 100vw, 560px"
              className="object-cover object-center"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-4 py-6 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 text-sm text-[#8F897D] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} Divas Sojourn · {CONTACT.location} ·{" "}
            <a href={`mailto:${CONTACT.email}`} className="hover:text-[#D6AE3C]">
              {CONTACT.email}
            </a>{" "}
            ·{" "}
            <a
              href={`tel:${CONTACT.phoneTel}`}
              onClick={() => trackWomenTripsEvent("women_trips_call_click", { location: "footer" })}
              className="hover:text-[#D6AE3C]"
            >
              {CONTACT.phoneDisplay}
            </a>
          </p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="text-[#D6AE3C] underline-offset-2 hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms-condition" className="text-[#D6AE3C] underline-offset-2 hover:underline">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </footer>

      {/* Mobile sticky bar — under 720px only */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#0B0B0C]/96 p-3 backdrop-blur min-[720px]:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-3 gap-2">
          <a
            href={`tel:${CONTACT.phoneTel}`}
            onClick={() => trackWomenTripsEvent("women_trips_call_click", { location: "sticky" })}
            className="inline-flex h-11 items-center justify-center rounded-full border border-white/25 text-sm font-semibold"
          >
            Call
          </a>
          <a
            href={waLink(WHATSAPP_LANDING_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackWomenTripsEvent("women_trips_whatsapp_click", { location: "sticky" })
            }
            className="inline-flex h-11 items-center justify-center rounded-full bg-[#25D366] text-sm font-bold text-[#06260f]"
          >
            WhatsApp
          </a>
          <button
            type="button"
            onClick={scrollToEnquire}
            className="inline-flex h-11 items-center justify-center rounded-full bg-[#D6AE3C] text-sm font-bold text-[#1A1405]"
          >
            Get details
          </button>
        </div>
      </div>
    </div>
  );
}
