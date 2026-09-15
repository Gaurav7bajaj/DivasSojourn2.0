"use client";

import Image from "next/image";
import { useState } from "react";
import { tailoredDestinations } from "../../data/tailoredDestinations";
import DestinationEnquiryModal from "./DestinationEnquiryModal";

export default function DestinationCards() {
  const [selectedDestination, setSelectedDestination] = useState(null);

  return (
    <section
      className="bg-[#1A1A1A] px-4 pb-16 md:pb-20"
      aria-labelledby="tailored-destinations-heading"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center md:mb-10">
          <p className="text-sm font-black uppercase tracking-[0.28em] text-[#D4AF37]">Destinations</p>
          <h2
            id="tailored-destinations-heading"
            className="mt-3 text-3xl font-black text-white md:text-4xl"
          >
            Pick a place to begin
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tailoredDestinations.map((destination) => (
            <button
              key={destination.slug}
              type="button"
              onClick={() => setSelectedDestination(destination)}
              aria-haspopup="dialog"
              className="group relative min-h-[280px] overflow-hidden rounded-[1.75rem] border border-white/10 text-left transition duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/70 hover:shadow-[0_18px_40px_rgba(0,0,0,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]"
            >
              <Image
                src={destination.image}
                alt={destination.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/15"
                aria-hidden="true"
              />
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                  {destination.region}
                </p>
                <h3 className="mt-2 text-2xl font-black text-white">{destination.name}</h3>
                <p className="mt-2 text-sm leading-6 text-white/75">{destination.tagline}</p>
                <span className="mt-4 inline-flex text-sm font-black uppercase tracking-wide text-[#E8C547] transition group-hover:translate-x-1">
                  Enquire →
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedDestination ? (
        <DestinationEnquiryModal
          destination={selectedDestination}
          onClose={() => setSelectedDestination(null)}
        />
      ) : null}
    </section>
  );
}
