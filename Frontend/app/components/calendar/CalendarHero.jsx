"use client";

import Image from "next/image";
import Link from "next/link";
import { calendarHeroImages } from "../../data/heroImages";

function stripCacheBust(src) {
  return String(src || "").split("?")[0];
}

export default function CalendarHero() {
  const hero = calendarHeroImages[1] || calendarHeroImages[0];
  const imageSrc = stripCacheBust(hero?.src) || "/heroes/calendar/calendarHero2.webp";
  const imageAlt = hero?.alt || "Women travelers planning a trip";

  return (
    <section
      className="relative isolate overflow-hidden bg-[#0B0B0C] md:h-[420px]"
      aria-label="Trip calendar"
    >
      {/* Photo — right ~70% on desktop; full width strip on mobile */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[220px] md:inset-y-0 md:left-auto md:right-0 md:h-auto md:w-[70%]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 70vw"
          className="object-cover"
          style={{ objectPosition: "center 35%" }}
        />
      </div>

      {/* Horizontal fade into photo (desktop) */}
      <div
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={{
          background:
            "linear-gradient(90deg, #0B0B0C 0%, #0B0B0C 30%, rgba(11,11,12,.7) 48%, transparent 78%)",
        }}
        aria-hidden="true"
      />
      {/* Mobile image scrim */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[220px] bg-gradient-to-b from-black/35 to-[#0B0B0C] md:hidden"
        aria-hidden="true"
      />
      {/* Bottom fade */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[140px]"
        style={{
          background: "linear-gradient(0deg, #0B0B0C, transparent)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-[1] flex flex-col px-5 pb-10 pt-[236px] md:left-0 md:top-0 md:h-[420px] md:w-[580px] md:justify-start md:px-0 md:pb-0 md:pl-24 md:pt-14">
        <div className="flex flex-col gap-[18px]">
          <nav
            className="font-[family-name:var(--font-dm-sans)] text-[14px] text-[#C9C3B6]"
            aria-label="Breadcrumb"
          >
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="transition hover:text-[#D6AE3C]">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="font-semibold text-[#D6AE3C]">Calendar</li>
            </ol>
          </nav>

          <div className="flex items-center gap-3">
            <span className="h-0.5 w-9 shrink-0 bg-[#D6AE3C]" aria-hidden="true" />
            <p className="font-[family-name:var(--font-dm-sans)] text-[13px] font-bold uppercase tracking-[0.24em] text-[#D6AE3C]">
              Plan ahead
            </p>
          </div>

          <h1 className="font-[family-name:var(--font-playfair)] text-[clamp(3rem,6vw,5rem)] font-semibold leading-none tracking-[-0.015em] text-[#FBF8F1]">
            Trip{" "}
            <em className="font-[family-name:var(--font-playfair)] font-medium italic text-[#E2BB4D]">
              calendar
            </em>
          </h1>

          <p className="max-w-[520px] font-[family-name:var(--font-dm-sans)] text-[16px] leading-[1.55] text-[#D9D3C6] md:text-[18px]">
            Find the dates that fit your life. Every women-only departure, month by month — all you
            have to do is pick one and pack.
          </p>
        </div>
      </div>
    </section>
  );
}
