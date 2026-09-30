"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock3, Download, MapPinned, Route } from "lucide-react";
import ShareButton from "./ShareButton";
import {
  formatDepartureRange,
  getTripCategoryLabel,
  getTripPlaceLabel,
  splitTitleForHighlight,
} from "./tripDetailUtils";

export default function TripDetailHero({ trip, basePath, baseLabel }) {
  const { lead, emphasis } = splitTitleForHighlight(
    trip.title,
    trip.titleHighlightWords,
  );
  const category = getTripCategoryLabel(trip);
  const place = getTripPlaceLabel(trip);
  const seatsLeft =
    typeof trip.seatsLeft === "number"
      ? trip.seatsLeft
      : typeof trip.seatsRemaining === "number"
        ? trip.seatsRemaining
        : null;
  const objectPosition = trip.heroObjectPosition || trip.imageFocus || "center";
  const routeValue =
    trip.route ||
    [trip.pickupLocation, trip.dropLocation].filter(Boolean).join(" → ") ||
    "To be announced";
  const durationValue =
    trip.nights || trip.days
      ? `${trip.nights || 0}N / ${trip.days || 0}D`
      : trip.duration || "—";
  const datesValue = formatDepartureRange(
    trip.startDate,
    trip.endDate,
    trip.dates,
  );

  return (
    <section className="relative h-[560px] min-h-[420px] w-full overflow-hidden bg-[#0B0B0C]">
      {trip.image ? (
        <Image
          src={trip.image}
          alt={`${trip.title} trip hero`}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition }}
        />
      ) : null}

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(0deg, rgba(8,8,10,.96) 0%, rgba(8,8,10,.55) 42%, rgba(8,8,10,.1) 75%), linear-gradient(90deg, rgba(8,8,10,.72) 0%, rgba(8,8,10,.28) 48%, transparent 78%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-full flex-col justify-between px-5 pb-11 pt-8 md:px-12 xl:px-24">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <nav aria-label="Breadcrumb" className="min-w-0">
            <ol className="flex flex-wrap items-center gap-2 font-[family-name:var(--font-dm-sans)] text-[13px] text-[#C9C3B6]">
              <li>
                <Link href="/" className="transition hover:text-[#D6AE3C]">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={basePath} className="transition hover:text-[#D6AE3C]">
                  {baseLabel}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="truncate font-semibold text-[#FBF8F1]">{trip.shortName || trip.title}</li>
            </ol>
          </nav>

          <div className="flex flex-wrap items-center gap-2">
            {trip.pdfPath ? (
              <a
                href={trip.pdfPath}
                download
                className="inline-flex h-11 items-center gap-2 rounded-full border border-white/20 bg-[rgba(8,8,10,0.55)] px-4 font-[family-name:var(--font-dm-sans)] text-[13px] font-bold text-[#FBF8F1] backdrop-blur transition hover:border-[#D6AE3C] hover:text-[#D6AE3C]"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Itinerary PDF
              </a>
            ) : null}
            <ShareButton title={trip.title} variant="hero" />
          </div>
        </div>

        <div className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-[rgba(214,174,60,0.55)] bg-[rgba(8,8,10,0.72)] px-3 py-1.5 font-[family-name:var(--font-dm-sans)] text-[11px] font-bold uppercase tracking-[0.14em] text-[#D6AE3C]">
              {category} · {place}
            </span>
            {seatsLeft != null && seatsLeft > 0 && seatsLeft <= 10 ? (
              <span className="inline-flex items-center rounded-full bg-[#D6AE3C] px-3 py-1.5 font-[family-name:var(--font-dm-sans)] text-[11px] font-bold uppercase tracking-[0.12em] text-[#1A1405]">
                {seatsLeft} seats left
              </span>
            ) : null}
          </div>

          <h1 className="mt-4 font-[family-name:var(--font-playfair)] text-[clamp(2.75rem,5.5vw,4.75rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-[#FBF8F1]">
            {lead ? <>{lead} </> : null}
            <em className="not-italic text-[#E2BB4D] italic">{emphasis}</em>
          </h1>

          <div className="mt-7 flex flex-wrap gap-x-7 gap-y-4">
            <Fact icon={Route} label="Route" value={routeValue} />
            <Fact icon={Clock3} label="Duration" value={durationValue} />
            <Fact icon={CalendarDays} label="Dates" value={datesValue} />
            <Fact
              icon={MapPinned}
              label="Starts from"
              value={trip.pickupLocation || "To be announced"}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Fact({ icon: Icon, label, value }) {
  return (
    <div className="flex min-w-[140px] max-w-[280px] items-start gap-3">
      <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full border border-[rgba(214,174,60,0.55)] bg-[rgba(8,8,10,0.55)] text-[#D6AE3C]">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block font-[family-name:var(--font-dm-sans)] text-[11px] font-bold uppercase tracking-[0.14em] text-[#8F897D]">
          {label}
        </span>
        <span className="mt-1 block font-[family-name:var(--font-dm-sans)] text-[15px] font-bold leading-snug text-[#FBF8F1]">
          {value}
        </span>
      </span>
    </div>
  );
}
