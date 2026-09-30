"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useMemo, useRef } from "react";
import UpcomingTripCard from "../upcoming/UpcomingTripCard";
import { formatDepartureRange } from "./tripDetailUtils";

export default function SimilarTrips({ trips = [], basePath = "/india-trips", currentTrip }) {
  const scrollerRef = useRef(null);

  const cards = useMemo(() => {
    const currentStart = currentTrip?.startDate || "";
    const sorted = [...trips].sort((a, b) => {
      const aTime = new Date(a.startDate).getTime() || 0;
      const bTime = new Date(b.startDate).getTime() || 0;
      const currentTime = new Date(currentStart).getTime() || 0;
      return Math.abs(aTime - currentTime) - Math.abs(bTime - currentTime);
    });

    return sorted.slice(0, 8).map((trip) => ({
      id: trip.id,
      title: trip.title,
      slug: trip.slug,
      shortName: trip.shortName,
      image: trip.image,
      destination: trip.destination,
      country: trip.country,
      region: trip.region,
      duration: { nights: trip.nights, days: trip.days },
      pickupLocation: trip.pickupLocation,
      dropLocation: trip.dropLocation,
      startDate: trip.startDate,
      endDate: trip.endDate,
      batches: 1,
      originalPrice: trip.earlyBirdPrice ? trip.price : null,
      currentPrice: trip.earlyBirdPrice || trip.price || 0,
      soldOut: trip.soldOut,
      datesLabel: formatDepartureRange(trip.startDate, trip.endDate, trip.dates),
    }));
  }, [trips, currentTrip]);

  if (!cards.length) return null;

  const categoryLabel =
    currentTrip?.destination === "International" ? "international" : "India";

  const scrollBy = (dir) => {
    const node = scrollerRef.current;
    if (!node) return;
    node.scrollBy({ left: dir * Math.min(360, node.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <section className="border-t border-white/8 bg-[#0B0B0C] px-5 py-16 md:px-12 xl:px-24">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="h-[2px] w-9 shrink-0 bg-[#D6AE3C]" aria-hidden="true" />
            <p className="font-[family-name:var(--font-dm-sans)] text-[13px] font-bold uppercase tracking-[0.24em] text-[#D6AE3C]">
              Similar trips
            </p>
          </div>
          <h2 className="font-[family-name:var(--font-playfair)] text-[clamp(1.85rem,3vw,2.6rem)] font-semibold text-[#FBF8F1]">
            You may <em className="italic text-[#E2BB4D]">also love</em>
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Previous similar trips"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-[#FBF8F1] transition hover:border-[#D6AE3C] hover:text-[#D6AE3C]"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Next similar trips"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-[#FBF8F1] transition hover:border-[#D6AE3C] hover:text-[#D6AE3C]"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
          <Link
            href={basePath}
            className="ml-2 inline-flex items-center gap-1.5 font-[family-name:var(--font-dm-sans)] text-[14px] font-bold text-[#D6AE3C] transition hover:text-[#E6BF4C]"
          >
            All {categoryLabel} trips
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {cards.map((trip, index) => (
          <div
            key={trip.id || trip.slug}
            className="w-[min(320px,85vw)] shrink-0 snap-start md:w-[calc((100%-3.75rem)/4)]"
          >
            <UpcomingTripCard trip={trip} variant="dark" priority={index < 2} />
          </div>
        ))}
      </div>
    </section>
  );
}
