"use client";

import HeroImageCarousel from "../HeroImageCarousel";
import { tailoredHeroImages } from "../../data/tailoredDestinations";

export default function TailoredTripsHero() {
  return (
    <HeroImageCarousel
      images={tailoredHeroImages}
      intervalMs={2000}
      className="flex min-h-[62vh] items-center justify-center bg-[#0F0F0F] text-center md:min-h-[85vh]"
      ariaLabel="Tailored trips destination carousel"
    >
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-[#1A1A1A]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#1A1A1A] to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-4xl px-4">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-[#D4AF37]">
          Tailored Trips
        </p>
        <h1
          className="text-4xl font-black leading-tight drop-shadow-[0_4px_18px_rgba(0,0,0,0.85)] md:text-6xl lg:text-7xl"
          style={{ color: "#FFFFFF" }}
        >
          Your Journey, Your Way
        </h1>
        <p
          className="mx-auto mt-6 max-w-2xl text-base leading-7 drop-shadow-[0_3px_12px_rgba(0,0,0,0.9)] md:text-lg"
          style={{ color: "#FFFFFF" }}
        >
          Choose a destination you love — we craft a women-first itinerary around your pace,
          preferences and travel style.
        </p>
      </div>
    </HeroImageCarousel>
  );
}
