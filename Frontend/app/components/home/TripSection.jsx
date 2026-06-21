"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TripCard from "./TripCard";

export default function TripSection({
  id,
  title,
  subtitle,
  description,
  ctaHref,
  heroImage,
  heroAlt,
  heroVideo,
  trips,
}) {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollContainerRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id={id} className="bg-[#1A1A1A] px-4 py-16" aria-labelledby={`${id}-heading`}>
      <div className="mx-auto max-w-7xl relative">
        {/* Background Card */}
        <div className="relative w-full h-[480px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10">
          {heroVideo ? (
            <video
              src={heroVideo}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : heroImage ? (
            <Image
              src={heroImage}
              alt={heroAlt || title}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />
          <div className="absolute inset-0 p-8 md:p-16 flex flex-col justify-start items-start text-white">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
              Featured
            </span>
            <h2 id={`${id}-heading`} className="mt-3 text-3xl font-black text-white md:text-5xl tracking-wide">
              {title}
            </h2>
            <p className="mt-3 max-w-lg text-lg text-white/95 font-medium leading-relaxed">
              {subtitle}
            </p>
            {description && (
              <p className="mt-2.5 max-w-xl text-sm text-white/70 leading-6 hidden md:block">
                {description}
              </p>
            )}
            <Link
              href={ctaHref}
              className="mt-7 rounded-full bg-[#D4AF37] px-8 py-3 text-sm font-bold uppercase tracking-wide text-[#0F0F0F] transition-all duration-300 hover:scale-105 hover:bg-[#E8C547] hover:shadow-[0_8px_20px_rgba(212,175,55,0.4)]"
            >
              Explore
            </Link>
          </div>
        </div>

        {/* Overlapping Slider */}
        <div className="relative z-10 -mt-40 px-4 md:px-12 group/slider">
          {/* Scroll Navigation Buttons */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white border border-white/10 hover:bg-[#D4AF37] hover:text-[#0F0F0F] transition duration-300 opacity-0 group-hover/slider:opacity-100 disabled:opacity-0 shadow-lg"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <button
            onClick={() => scroll("right")}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white border border-white/10 hover:bg-[#D4AF37] hover:text-[#0F0F0F] transition duration-300 opacity-0 group-hover/slider:opacity-100 shadow-lg"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Horizontal scrollable row */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory scroll-smooth"
          >
            {trips.map((trip) => (
              <div key={trip.id} className="snap-start py-4">
                <TripCard trip={trip} href={ctaHref} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
