"use client";

import Image from "next/image";
import { Compass } from "lucide-react";
import { useMemo, useState } from "react";
import { tailoredDestinations } from "../../data/tailoredDestinations";
import DestinationEnquiryModal from "./DestinationEnquiryModal";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "India", label: "India" },
  { value: "International", label: "International" },
];

const CUSTOM_DESTINATION = {
  slug: "custom",
  name: "dream",
  region: "",
  tagline: "Tell us where you want to go and we'll design it from scratch.",
  isCustom: true,
};

export default function DestinationCards() {
  const [filter, setFilter] = useState("all");
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [brokenImages, setBrokenImages] = useState({});

  const counts = useMemo(() => {
    const india = tailoredDestinations.filter((d) => d.region === "India").length;
    const international = tailoredDestinations.filter((d) => d.region === "International").length;
    return {
      all: tailoredDestinations.length,
      India: india,
      International: international,
    };
  }, []);

  const visible = useMemo(() => {
    if (filter === "all") return tailoredDestinations;
    return tailoredDestinations.filter((d) => d.region === filter);
  }, [filter]);

  return (
    <section
      id="destinations"
      className="scroll-mt-28 bg-[#0B0B0C] px-5 pb-16 md:px-12 md:pb-20 xl:px-24 xl:pb-24"
      aria-labelledby="tailored-destinations-heading"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-0.5 w-9 shrink-0 bg-[#D6AE3C]" aria-hidden="true" />
            <p className="font-[family-name:var(--font-dm-sans)] text-[13px] font-bold uppercase tracking-[0.24em] text-[#D6AE3C]">
              Destinations
            </p>
          </div>
          <h2
            id="tailored-destinations-heading"
            className="mt-4 font-[family-name:var(--font-playfair)] text-[36px] font-semibold leading-tight text-[#FBF8F1] md:text-[44px]"
          >
            Pick a place{" "}
            <em className="font-[family-name:var(--font-playfair)] font-medium italic text-[#E2BB4D]">
              to begin
            </em>
          </h2>
        </div>

        <div
          className="flex w-full rounded-full bg-[#16161A] p-1 md:w-auto"
          role="group"
          aria-label="Filter destinations"
        >
          {FILTERS.map((option) => {
            const active = filter === option.value;
            const count = counts[option.value] ?? counts.all;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(option.value)}
                className={`h-[42px] flex-1 whitespace-nowrap rounded-full px-4 font-[family-name:var(--font-dm-sans)] text-[13px] font-bold transition md:flex-none md:px-5 ${
                  active
                    ? "bg-[#D6AE3C] text-[#1A1405]"
                    : "text-[#C9C3B6] hover:text-[#FBF8F1]"
                }`}
              >
                {option.label} {count}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 min-[900px]:grid-cols-2 min-[1200px]:grid-cols-3 xl:grid-cols-4">
        {visible.map((destination) => {
          const imageBroken = brokenImages[destination.slug];
          return (
            <article
              key={destination.slug}
              className="group relative flex h-[380px] flex-col overflow-hidden rounded-[20px] border border-white/8 bg-[#141417] transition duration-500 hover:-translate-y-1 hover:border-[#D6AE3C]"
            >
              {destination.image && !imageBroken ? (
                <Image
                  src={destination.image}
                  alt={destination.alt || destination.name}
                  fill
                  sizes="(max-width: 900px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                  onError={() =>
                    setBrokenImages((current) => ({ ...current, [destination.slug]: true }))
                  }
                />
              ) : (
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(160deg, #1a1a22 0%, #0f1014 45%, #1c1810 100%)",
                  }}
                  aria-hidden="true"
                />
              )}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(0deg, rgba(8,8,10,.92) 0%, rgba(8,8,10,.45) 45%, transparent 80%)",
                }}
                aria-hidden="true"
              />
              <div className="relative mt-auto flex flex-col gap-2 p-[22px]">
                <p className="font-[family-name:var(--font-dm-sans)] text-[11px] font-bold uppercase tracking-[0.16em] text-[#D6AE3C]">
                  {destination.region}
                </p>
                <h3 className="font-[family-name:var(--font-playfair)] text-[30px] font-semibold leading-tight text-[#FBF8F1]">
                  {destination.name}
                </h3>
                <p className="min-h-[2.6em] font-[family-name:var(--font-dm-sans)] text-[14px] leading-snug text-[#D9D3C6]">
                  {destination.tagline}
                </p>
                <button
                  type="button"
                  aria-haspopup="dialog"
                  onClick={() => setSelectedDestination(destination)}
                  className="mt-2 inline-flex h-11 w-fit items-center rounded-full border-[1.5px] border-[#D6AE3C] bg-[rgba(8,8,10,0.45)] px-5 font-[family-name:var(--font-dm-sans)] text-[14px] font-bold text-[#D6AE3C] transition hover:bg-[#D6AE3C] hover:text-[#1A1405]"
                >
                  Plan this trip →
                </button>
              </div>
            </article>
          );
        })}

        <article className="group relative flex h-[380px] flex-col justify-between overflow-hidden rounded-[20px] border-[1.5px] border-dashed border-[rgba(214,174,60,0.55)] bg-[#111114] p-[22px]">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(214,174,60,0.14)] text-[#D6AE3C]">
            <Compass className="h-7 w-7" aria-hidden="true" />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-[family-name:var(--font-playfair)] text-[30px] font-semibold leading-tight text-[#FBF8F1]">
              Somewhere else{" "}
              <em className="font-[family-name:var(--font-playfair)] font-medium italic text-[#E2BB4D]">
                in mind?
              </em>
            </h3>
            <p className="min-h-[2.6em] font-[family-name:var(--font-dm-sans)] text-[14px] leading-snug text-[#D9D3C6]">
              {CUSTOM_DESTINATION.tagline}
            </p>
            <button
              type="button"
              aria-haspopup="dialog"
              onClick={() => setSelectedDestination(CUSTOM_DESTINATION)}
              className="mt-2 inline-flex h-11 w-fit items-center rounded-full bg-[#D6AE3C] px-5 font-[family-name:var(--font-dm-sans)] text-[14px] font-bold text-[#1A1405] transition hover:bg-[#E6BF4C]"
            >
              Tell us where →
            </button>
          </div>
        </article>
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
