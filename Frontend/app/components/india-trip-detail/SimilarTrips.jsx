"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, ChevronLeft, ChevronRight, Clock3, MapPin } from "lucide-react";
import { useRef } from "react";
import { useCarouselScroll } from "./useCarouselScroll";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

export default function SimilarTrips({ trips, basePath = "/india-trips" }) {
  const scrollRef = useRef(null);
  const total = trips?.length ?? 0;
  const { activeIndex, rangeStart, rangeEnd, atStart, atEnd, scrollBy } = useCarouselScroll(
    scrollRef,
    total,
  );

  if (!total) {
    return null;
  }

  return (
    <section className="bg-[#0F0F0F] px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-[#D4AF37]">
              Explore More Adventures
            </p>
            <h2 className="mt-2 text-3xl font-black text-white md:text-5xl">Similar Trips</h2>
          </div>
          <p className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white/90">
            Showing trips {rangeStart}–{rangeEnd} of {total}
          </p>
        </div>

        <div className="relative">
          <CarouselArrow
            label="Previous trips"
            direction="left"
            disabled={atStart}
            onClick={() => scrollBy(-1)}
          />
          <CarouselArrow
            label="Next trips"
            direction="right"
            disabled={atEnd}
            onClick={() => scrollBy(1)}
          />

          <div
            ref={scrollRef}
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-12 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {trips.map((trip, index) => (
              <Link
                key={trip.slug}
                href={`${basePath}/${trip.slug}`}
                className="group relative w-[85%] shrink-0 snap-start overflow-hidden rounded-3xl border border-[#D4AF37]/25 bg-[#1A1A1A] shadow-2xl transition hover:-translate-y-1 hover:border-[#D4AF37] sm:w-[46%] lg:w-[31%] xl:w-[24%]"
              >
                <span className="absolute left-4 top-4 z-10 rounded-full bg-black/65 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                  {index + 1}/{total}
                </span>
                <Image
                  src={trip.image}
                  alt={`${trip.title} similar trip`}
                  width={400}
                  height={390}
                  sizes="(max-width: 768px) 85vw, 25vw"
                  className="aspect-[400/390] w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <h3 className="text-xl font-black">{trip.shortName}</h3>
                  <div className="mt-3 space-y-2 text-sm font-semibold text-white/85">
                    <p className="flex gap-2">
                      <Clock3 className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
                      {trip.nights}N/{trip.days}D
                    </p>
                    <p className="flex gap-2">
                      <MapPin className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
                      {trip.pickupLocation}
                    </p>
                    <p className="flex gap-2">
                      <CalendarDays className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
                      {trip.dates}
                    </p>
                  </div>
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <p className="rounded-full bg-[#D4AF37] px-3 py-2 text-sm font-black text-[#0F0F0F]">
                      Rs. {currencyFormatter.format(trip.price)}/- Onwards
                    </p>
                    <span className="flex items-center gap-1 rounded-full bg-[#0F9B9B] px-3 py-2 text-xs font-black text-white transition group-hover:bg-[#0d8585]">
                      View
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <p className="mt-4 text-center text-sm font-semibold text-white/60">
            Trip {activeIndex + 1} of {total} — swipe or use arrows to explore
          </p>
        </div>
      </div>
    </section>
  );
}

function CarouselArrow({ label, direction, disabled, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border-2 transition md:h-12 md:w-12 ${
        direction === "left" ? "left-0" : "right-0"
      } ${
        disabled
          ? "cursor-not-allowed border-white/20 bg-white/5 text-white/30"
          : "border-[#0F9B9B] bg-[#0F9B9B] text-white hover:scale-105 hover:bg-[#0d8585]"
      }`}
    >
      {direction === "left" ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
    </button>
  );
}
