"use client";

import HeroImageCarousel from "../HeroImageCarousel";
import { internationalHeroImages } from "../../data/heroImages";

export default function InternationalTripsHeader() {
  return (
    <HeroImageCarousel
      images={internationalHeroImages}
      className="flex min-h-[62vh] items-center justify-center bg-[#0F0F0F] text-center md:min-h-[90vh]"
      ariaLabel="International trips hero"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/5 to-[#1A1A1A]" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#1A1A1A] to-transparent" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex min-h-[62vh] max-w-4xl flex-col items-center justify-center px-4 md:min-h-[90vh]">
        <p className="text-sm font-black uppercase tracking-[0.4em] text-white drop-shadow-[0_3px_12px_rgba(0,0,0,0.9)]">
          Explore
        </p>
        <h1 className="mt-2 text-4xl font-black uppercase tracking-wide text-[#D4AF37] drop-shadow-[0_4px_18px_rgba(0,0,0,0.85)] md:text-6xl lg:text-7xl">
          International
        </h1>
        <p className="mt-2 text-sm font-black uppercase tracking-[0.4em] text-white drop-shadow-[0_3px_12px_rgba(0,0,0,0.9)]">
          Trips
        </p>
        <div className="mt-5 h-1 w-24 rounded-full bg-[#D4AF37]" aria-hidden="true" />
      </div>
    </HeroImageCarousel>
  );
}
