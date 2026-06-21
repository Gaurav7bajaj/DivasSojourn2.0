"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { internationalHeroSlides } from "../../data/internationalTrips";

export default function InternationalHeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % internationalHeroSlides.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, []);

  const goToSlide = (direction) => {
    setActiveIndex((index) => {
      if (direction === "previous") {
        return index === 0 ? internationalHeroSlides.length - 1 : index - 1;
      }

      return (index + 1) % internationalHeroSlides.length;
    });
  };

  return (
    <section className="relative min-h-[380px] overflow-hidden md:min-h-[600px]" aria-label="International trip highlights">
      {internationalHeroSlides.map((slide, index) => (
        <Image
          key={slide.id}
          src={slide.image}
          alt={`${slide.title} international travel destination`}
          fill
          priority={index === 0}
          sizes="100vw"
          className={`object-cover transition-opacity duration-1000 ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-black/55" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/60" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex min-h-[380px] max-w-7xl items-center px-4 py-16 md:min-h-[600px] lg:px-8">
        <div className="max-w-3xl border-l-4 border-[#D4AF37] pl-6">
          <p className="mb-4 text-lg font-semibold text-[#D4AF37] md:text-2xl">
            Travel Solo, Explore Together
          </p>
          <h1 className="text-4xl font-black leading-tight text-white md:text-6xl">
            International Trips for Female
          </h1>
          <p className="mt-5 text-lg font-semibold text-white md:text-2xl">
            Book Right Now For Early Bird Discount
          </p>
          <p className="mt-5 max-w-2xl leading-7 text-white">
            Discover women-only international trips built around trusted planning, premium comfort,
            strong community and destinations you have always wanted to explore.
          </p>
          <Link
            href="#destinations"
            className="mt-8 inline-flex rounded-full bg-[#D4AF37] px-8 py-3 text-sm font-black uppercase tracking-wide text-[#0F0F0F] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E8C547] hover:shadow-[0_8px_20px_rgba(212,175,55,0.3)]"
          >
            Explore Destinations
          </Link>
        </div>
      </div>

      <button
        type="button"
        onClick={() => goToSlide("previous")}
        className="absolute left-4 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white transition hover:border-[#D4AF37] hover:text-[#D4AF37] md:flex"
        aria-label="Show previous hero image"
      >
        <ChevronLeft className="h-6 w-6" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => goToSlide("next")}
        className="absolute right-4 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white transition hover:border-[#D4AF37] hover:text-[#D4AF37] md:flex"
        aria-label="Show next hero image"
      >
        <ChevronRight className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {internationalHeroSlides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`h-2.5 rounded-full transition-all ${
              index === activeIndex ? "w-8 bg-[#D4AF37]" : "w-2.5 bg-white/60"
            }`}
            aria-label={`Show ${slide.title}`}
          />
        ))}
      </div>
    </section>
  );
}
