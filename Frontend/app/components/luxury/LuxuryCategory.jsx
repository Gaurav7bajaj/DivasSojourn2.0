"use client";

import Image from "next/image";
import { useState } from "react";
import LuxuryTripCard from "./LuxuryTripCard";
import TripDetailModal from "./TripDetailModal";

export default function LuxuryCategory({ category }) {
  const [selectedTrip, setSelectedTrip] = useState(null);

  return (
    <>
      <section
        id={`lux-${category.id}`}
        className="bg-[#1A1A1A] px-4 py-16 md:py-20"
        aria-labelledby={`lux-${category.id}-heading`}
      >
        <div className="mx-auto max-w-7xl">
          {/* Full-width atmospheric banner */}
          <div className="relative h-[300px] w-full overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl md:h-[420px]">
            <Image
              src={category.bannerImage}
              alt={category.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-14">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
                {category.subtitle}
              </p>
              <h2
                id={`lux-${category.id}-heading`}
                className="mt-2 text-3xl font-black text-white md:text-5xl"
              >
                {category.title}
              </h2>
            </div>
          </div>

          {/* Description */}
          <p className="mx-auto mt-8 max-w-3xl text-center leading-7 text-white/60">
            {category.description}
          </p>

          {/* Trip cards grid */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {category.trips.map((trip) => (
              <LuxuryTripCard
                key={trip.id}
                trip={trip}
                onClick={() => setSelectedTrip(trip)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      {selectedTrip && (
        <TripDetailModal
          trip={selectedTrip}
          onClose={() => setSelectedTrip(null)}
        />
      )}
    </>
  );
}
