"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import { inrToUsd } from "../../utils/formatPrice";

const inrFmt = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
const usdFmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

/**
 * Single featured-trips carousel (India or International).
 * Same card style as the redesigned homepage — no tab toggle.
 */
export default function FeaturedJourneysCarousel({
  id = "featured-journeys",
  eyebrow = "Featured journeys",
  title = "Where will you go",
  titleEm = "next?",
  blurb = "",
  viewAllHref = "/upcoming-trips",
  viewAllLabel = "View all trips →",
  trips = [],
}) {
  const scrollerRef = useRef(null);
  const [broken, setBroken] = useState({});
  const headingId = `${id}-heading`;

  const scrollByCard = (direction) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector("[data-journey-card]");
    const amount = (card?.getBoundingClientRect().width || 280) + 24;
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  return (
    <section
      id={id}
      className="bg-[#0B0B0C] px-5 py-16 md:px-12 md:py-24 xl:px-24"
      aria-labelledby={headingId}
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="h-0.5 w-9 shrink-0 bg-[#D6AE3C]" aria-hidden="true" />
            <p className="font-[family-name:var(--font-dm-sans)] text-[13px] font-bold uppercase tracking-[0.24em] text-[#D6AE3C]">
              {eyebrow}
            </p>
          </div>
          <h2
            id={headingId}
            className="mt-4 font-[family-name:var(--font-playfair)] text-[36px] font-semibold leading-tight text-[#FBF8F1] md:text-[52px]"
          >
            {title}{" "}
            <em className="font-[family-name:var(--font-playfair)] font-medium italic text-[#E2BB4D]">
              {titleEm}
            </em>
          </h2>
          {blurb ? (
            <p className="mt-3 font-[family-name:var(--font-dm-sans)] text-[16px] leading-[1.55] text-[#C9C3B6] md:text-[17px]">
              {blurb}
            </p>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label="Previous trips"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-[#FBF8F1] transition hover:border-[#D6AE3C] hover:text-[#D6AE3C]"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label="Next trips"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-[#FBF8F1] transition hover:border-[#D6AE3C] hover:text-[#D6AE3C]"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {trips.length === 0 ? (
          <p className="font-[family-name:var(--font-dm-sans)] text-[15px] text-[#C9C3B6]">
            No trips to show right now.
          </p>
        ) : (
          trips.map((trip) => {
            const price = Number(trip.price) || 0;
            const imgBroken = broken[trip.id];
            return (
              <Link
                key={trip.id}
                href={trip.href}
                data-journey-card
                className="group relative h-[440px] w-[min(100%,280px)] shrink-0 snap-start overflow-hidden rounded-[20px] border border-white/8 bg-[#141417] transition duration-500 hover:-translate-y-1 hover:border-[#D6AE3C] sm:w-[calc((100%-48px)/2.2)] lg:w-[calc((100%-72px)/3)] xl:w-[calc((100%-72px)/4)]"
              >
                {trip.image && !imgBroken ? (
                  <Image
                    src={trip.image}
                    alt={trip.name}
                    fill
                    sizes="(max-width: 640px) 85vw, (max-width: 1280px) 33vw, 25vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                    onError={() =>
                      setBroken((current) => ({ ...current, [trip.id]: true }))
                    }
                  />
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(160deg, #1a1a22 0%, #0f1014 50%, #1c1810 100%)",
                    }}
                    aria-hidden="true"
                  />
                )}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(0deg, rgba(8,8,10,.94) 0%, rgba(8,8,10,.35) 45%, transparent 70%)",
                  }}
                  aria-hidden="true"
                />

                <span className="absolute left-4 top-4 rounded-full border border-[rgba(214,174,60,0.5)] bg-[rgba(8,8,10,0.72)] px-3 py-1 font-[family-name:var(--font-dm-sans)] text-[11px] font-bold uppercase tracking-[0.14em] text-[#D6AE3C]">
                  {trip.badge}
                </span>

                <div className="absolute inset-x-0 bottom-0 p-[22px]">
                  <h3 className="font-[family-name:var(--font-playfair)] text-[26px] font-semibold leading-tight text-[#FBF8F1]">
                    {trip.name}
                  </h3>
                  <div className="mt-4 flex items-end justify-between gap-3 border-t border-white/8 pt-4">
                    <div>
                      <p className="font-[family-name:var(--font-dm-sans)] text-[12px] text-[#C9C3B6]">
                        Starting from
                      </p>
                      <p className="mt-0.5 font-[family-name:var(--font-dm-sans)] text-[20px] font-bold text-[#FBF8F1]">
                        ₹{inrFmt.format(price)}
                        <span className="ml-2 text-[13px] font-medium text-[#C9C3B6]">
                          ${usdFmt.format(inrToUsd(price))}
                        </span>
                      </p>
                    </div>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#D6AE3C] text-[#D6AE3C] transition group-hover:bg-[#D6AE3C] group-hover:text-[#1A1405]">
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>

      <div className="mt-8 text-center">
        <Link
          href={viewAllHref}
          className="font-[family-name:var(--font-dm-sans)] text-[15px] font-bold text-[#D6AE3C] transition hover:text-[#E6BF4C]"
        >
          {viewAllLabel}
        </Link>
      </div>
    </section>
  );
}
