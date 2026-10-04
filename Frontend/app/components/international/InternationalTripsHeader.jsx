"use client";

import HeroImageCarousel from "../HeroImageCarousel";
import { internationalHeroImages } from "../../data/heroImages";

export default function InternationalTripsHeader() {
  return (
    <HeroImageCarousel
      images={internationalHeroImages}
      intervalMs={4000}
      unoptimized
      imageClassName="object-contain object-center"
      className="relative flex h-[320px] w-full items-center justify-center bg-[#0F0F0F] text-center sm:h-[420px] md:h-[520px]"
      ariaLabel="International trips hero"
    >
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-black/30 to-black/15"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex h-full max-w-4xl flex-col items-center justify-center px-4">
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
