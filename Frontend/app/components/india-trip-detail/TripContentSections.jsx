"use client";

import { useId, useState } from "react";
import { Check, ChevronDown, ChevronUp, Lock, Star, Users, X } from "lucide-react";

function Eyebrow({ children }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="h-[2px] w-9 shrink-0 bg-[#D6AE3C]" aria-hidden="true" />
      <p className="font-[family-name:var(--font-dm-sans)] text-[13px] font-bold uppercase tracking-[0.24em] text-[#D6AE3C]">
        {children}
      </p>
    </div>
  );
}

export function TripOverviewSection({ trip }) {
  const highlights = Array.isArray(trip.highlights) ? trip.highlights.filter(Boolean) : [];

  return (
    <section id="overview" className="scroll-mt-40">
      <Eyebrow>Overview</Eyebrow>
      <h2 className="font-[family-name:var(--font-playfair)] text-[clamp(1.85rem,3vw,2.6rem)] font-semibold leading-tight text-[#FBF8F1]">
        Your journey <em className="italic text-[#E2BB4D]">at a glance</em>
      </h2>
      {trip.overview ? (
        <p className="mt-5 max-w-3xl font-[family-name:var(--font-dm-sans)] text-[18px] leading-[1.7] text-[#D9D3C6]">
          {trip.overview}
        </p>
      ) : null}

      {highlights.length ? (
        <div className="mt-8">
          <p className="font-[family-name:var(--font-dm-sans)] text-[12px] font-bold uppercase tracking-[0.18em] text-[#8F897D]">
            Highlights
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-[14px] bg-[#18181C] px-4 py-3.5"
              >
                <Star className="mt-0.5 h-4 w-4 shrink-0 fill-[#D6AE3C] text-[#D6AE3C]" aria-hidden="true" />
                <span className="font-[family-name:var(--font-dm-sans)] text-[15px] font-semibold leading-snug text-[#FBF8F1]">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

export function TripItinerarySection({ trip, locked = false, onRequestUnlock }) {
  const days = Array.isArray(trip.itinerary) ? trip.itinerary : [];
  const baseId = useId();
  const [openDays, setOpenDays] = useState(() => new Set(days.length ? [days[0].day || 1] : []));

  if (!days.length && !locked) return null;

  if (locked) {
    return (
      <section id="itinerary" className="scroll-mt-40">
        <Eyebrow>Itinerary</Eyebrow>
        <h2 className="font-[family-name:var(--font-playfair)] text-[clamp(1.85rem,3vw,2.6rem)] font-semibold leading-tight text-[#FBF8F1]">
          Day <em className="italic text-[#E2BB4D]">by day</em>
        </h2>

        <div className="relative mt-8 overflow-hidden rounded-[24px] border border-[rgba(214,174,60,0.35)] bg-[#121215]">
          <div
            className="pointer-events-none select-none px-6 py-8 blur-[2px] opacity-40"
            aria-hidden="true"
          >
            <div className="space-y-3">
              {(days.length ? days : [{ day: 1 }, { day: 2 }, { day: 3 }]).slice(0, 3).map((day, index) => (
                <div
                  key={day.day || index}
                  className="rounded-2xl border border-white/8 bg-[#141417] px-5 py-4"
                >
                  <p className="font-[family-name:var(--font-dm-sans)] text-[12px] font-bold uppercase tracking-[0.14em] text-[#D6AE3C]">
                    Day {day.day || index + 1}
                  </p>
                  <p className="mt-1 font-[family-name:var(--font-dm-sans)] text-[17px] font-bold text-[#FBF8F1]">
                    Detailed plan locked
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center bg-[rgba(8,8,10,0.72)] px-6 py-10 text-center">
            <div className="max-w-md">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(214,174,60,0.45)] text-[#D6AE3C]">
                <Lock className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-[family-name:var(--font-playfair)] text-[1.6rem] font-semibold text-[#FBF8F1]">
                Verify your phone to view
              </h3>
              <p className="mt-2 font-[family-name:var(--font-dm-sans)] text-[15px] leading-6 text-[#D9D3C6]">
                We&apos;ll send a one-time code to unlock the full day-by-day itinerary for this trip.
              </p>
              <button
                type="button"
                onClick={() => onRequestUnlock?.()}
                className="mt-6 inline-flex h-12 min-h-11 items-center justify-center rounded-full bg-[#D6AE3C] px-7 font-[family-name:var(--font-dm-sans)] text-[15px] font-bold text-[#1A1405] transition hover:bg-[#E6BF4C]"
              >
                Verify phone number
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const allOpen = openDays.size >= days.length;

  const toggle = (dayNum) => {
    setOpenDays((prev) => {
      const next = new Set(prev);
      if (next.has(dayNum)) next.delete(dayNum);
      else next.add(dayNum);
      return next;
    });
  };

  const expandAll = () => {
    setOpenDays(new Set(days.map((d, i) => d.day || i + 1)));
  };

  const collapseAll = () => {
    setOpenDays(new Set());
  };

  return (
    <section id="itinerary" className="scroll-mt-40">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>Itinerary</Eyebrow>
          <h2 className="font-[family-name:var(--font-playfair)] text-[clamp(1.85rem,3vw,2.6rem)] font-semibold leading-tight text-[#FBF8F1]">
            Day <em className="italic text-[#E2BB4D]">by day</em>
          </h2>
        </div>
        <button
          type="button"
          onClick={allOpen ? collapseAll : expandAll}
          className="font-[family-name:var(--font-dm-sans)] text-[14px] font-semibold text-[#D6AE3C] transition hover:text-[#E6BF4C]"
        >
          {allOpen ? "Collapse all days" : "Expand all days"}
        </button>
      </div>

      <ol className="relative mt-8 space-y-4">
        {days.map((day, index) => {
          const dayNum = day.day || index + 1;
          const isOpen = openDays.has(dayNum);
          const panelId = `${baseId}-day-${dayNum}`;
          const title = day.title?.trim() || `Day ${dayNum}`;
          const tags = [day.meals, day.hotel].filter(Boolean);

          return (
            <li key={`${dayNum}-${title}`} className="relative grid grid-cols-[44px_minmax(0,1fr)] gap-4">
              {index < days.length - 1 ? (
                <span
                  className="absolute left-[21px] top-12 bottom-[-16px] w-0.5 bg-[#D6AE3C]/55"
                  aria-hidden="true"
                />
              ) : null}
              <div
                className={[
                  "relative z-10 flex h-11 w-11 items-center justify-center rounded-full border-2 font-[family-name:var(--font-dm-sans)] text-[14px] font-bold",
                  isOpen
                    ? "border-[#D6AE3C] bg-[#D6AE3C] text-[#1A1405]"
                    : "border-[#D6AE3C] bg-[#0B0B0C] text-[#D6AE3C]",
                ].join(" ")}
                aria-hidden="true"
              >
                {dayNum}
              </div>

              <div className="rounded-2xl border border-white/8 bg-[#141417]">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(dayNum)}
                    className="flex w-full items-start justify-between gap-3 px-5 py-4 text-left"
                  >
                    <span className="min-w-0">
                      <span className="block font-[family-name:var(--font-dm-sans)] text-[12px] font-bold uppercase tracking-[0.14em] text-[#D6AE3C]">
                        Day {dayNum}
                        {day.date ? ` · ${day.date}` : ""}
                      </span>
                      <span className="mt-1 block font-[family-name:var(--font-dm-sans)] text-[17px] font-bold text-[#FBF8F1]">
                        {title}
                      </span>
                      {day.location ? (
                        <span className="mt-1 block font-[family-name:var(--font-dm-sans)] text-[13px] text-[#8F897D]">
                          {day.location}
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-1 text-[#D6AE3C]" aria-hidden="true">
                      {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </span>
                  </button>
                </h3>

                {isOpen ? (
                  <div id={panelId} className="border-t border-white/8 px-5 pb-5 pt-4">
                    {day.description ? (
                      <p className="font-[family-name:var(--font-dm-sans)] text-[15px] leading-7 text-[#D9D3C6]">
                        {day.description}
                      </p>
                    ) : null}
                    {tags.length ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-white/10 bg-[#18181C] px-3 py-1 font-[family-name:var(--font-dm-sans)] text-[12px] font-semibold text-[#C9C3B6]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export function TripInclusionsSection({ trip }) {
  const inclusions = Array.isArray(trip.inclusions) ? trip.inclusions.filter(Boolean) : [];
  const exclusions = Array.isArray(trip.exclusions) ? trip.exclusions.filter(Boolean) : [];
  if (!inclusions.length && !exclusions.length) return null;

  return (
    <section id="inclusions" className="scroll-mt-40">
      <Eyebrow>What&apos;s included</Eyebrow>
      <h2 className="font-[family-name:var(--font-playfair)] text-[clamp(1.85rem,3vw,2.6rem)] font-semibold leading-tight text-[#FBF8F1]">
        Inclusions <em className="italic text-[#E2BB4D]">&amp; exclusions</em>
      </h2>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <article className="rounded-2xl border border-[rgba(127,212,154,0.3)] bg-[#141417] p-6">
          <h3 className="font-[family-name:var(--font-dm-sans)] text-[13px] font-bold uppercase tracking-[0.16em] text-[#7FD49A]">
            Included
          </h3>
          <ul className="mt-4 space-y-3">
            {inclusions.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#7FD49A]" aria-hidden="true" />
                <span className="font-[family-name:var(--font-dm-sans)] text-[15px] leading-6 text-[#D9D3C6]">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-white/8 bg-[#141417] p-6">
          <h3 className="font-[family-name:var(--font-dm-sans)] text-[13px] font-bold uppercase tracking-[0.16em] text-[#8F897D]">
            Not included
          </h3>
          <ul className="mt-4 space-y-3">
            {exclusions.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-[#8F897D]" aria-hidden="true" />
                <span className="font-[family-name:var(--font-dm-sans)] text-[15px] leading-6 text-[#C9C3B6]">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}

export function TripWhoGoingSection({ trip }) {
  const women = Array.isArray(trip.womenJoiningFrom)
    ? trip.womenJoiningFrom.filter((w) => w?.name || w?.location)
    : [];
  if (!women.length) return null;

  const cities = [
    ...new Set(
      women
        .map((w) => (w.location || w.name || "").trim())
        .filter(Boolean),
    ),
  ];

  return (
    <section id="who" className="scroll-mt-40">
      <div className="rounded-[20px] border border-[rgba(214,174,60,0.28)] bg-[#121215] px-6 py-7 md:px-8">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[rgba(214,174,60,0.45)] text-[#D6AE3C]">
            <Users className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 className="font-[family-name:var(--font-playfair)] text-[1.6rem] font-semibold text-[#FBF8F1]">
              Women joining this trip from
            </h2>
            <p className="mt-1 font-[family-name:var(--font-dm-sans)] text-[14px] text-[#C9C3B6]">
              A snapshot of cities already represented in this departure.
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {cities.map((city) => (
                <li
                  key={city}
                  className="rounded-full border border-white/10 bg-[#18181C] px-3.5 py-1.5 font-[family-name:var(--font-dm-sans)] text-[13px] font-semibold text-[#FBF8F1]"
                >
                  {city}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
