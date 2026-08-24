"use client";

import Link from "next/link";
import HeroImageCarousel from "../HeroImageCarousel";
import { homeHeroImages } from "../../data/heroImages";

export default function HeroSection() {
  return (
    <HeroImageCarousel
      images={homeHeroImages}
      className="flex min-h-[62vh] items-center justify-center bg-[#0F0F0F] text-center md:min-h-[90vh]"
      ariaLabel="Divas Sojourn home hero"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/5 to-[#1A1A1A]" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#1A1A1A] to-transparent" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-4xl px-4">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-[#D4AF37]">
          Connecting People
        </p>
        <h1
          className="text-4xl font-black leading-tight drop-shadow-[0_4px_18px_rgba(0,0,0,0.85)] md:text-6xl lg:text-7xl"
          style={{ color: "#FFFFFF" }}
        >
          Global Women&apos;s Community of Travelers
        </h1>
        <p
          className="mx-auto mt-6 max-w-2xl text-base leading-7 drop-shadow-[0_3px_12px_rgba(0,0,0,0.9)] md:text-lg"
          style={{ color: "#FFFFFF" }}
        >
          Curated journeys for women who want comfort, connection and memorable adventures across India
          and the world.
        </p>
        <Link
          href="/upcoming-trips"
          className="mt-8 inline-flex rounded-full bg-[#D4AF37] px-7 py-3 text-sm font-bold uppercase tracking-wide text-[#0F0F0F] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E8C547] hover:shadow-[0_8px_20px_rgba(212,175,55,0.3)]"
        >
          Explore Trips
        </Link>
      </div>
    </HeroImageCarousel>
  );
}
