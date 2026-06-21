"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { getGalleryItems, useCarouselScroll } from "./useCarouselScroll";

export default function JourneyFrames({ trip }) {
  const scrollRef = useRef(null);
  const galleryItems = getGalleryItems(trip);
  const total = galleryItems.length;
  const { activeIndex, rangeStart, rangeEnd, atStart, atEnd, scrollBy } = useCarouselScroll(
    scrollRef,
    total,
  );

  return (
    <section className="bg-[#1A1A1A] px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-[#D4AF37]">
              Pictures Perfect Moments
            </p>
            <h2 className="mt-2 text-3xl font-black text-white md:text-5xl">Journey In Frames</h2>
          </div>
          <p className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white/90">
            Image {activeIndex + 1} of {total}
            <span className="mx-2 text-white/40">|</span>
            Showing {rangeStart}–{rangeEnd} of {total}
          </p>
        </div>

        <div className="relative">
          <CarouselArrow
            label="Previous image"
            direction="left"
            disabled={atStart}
            onClick={() => scrollBy(-1)}
          />
          <CarouselArrow
            label="Next image"
            direction="right"
            disabled={atEnd}
            onClick={() => scrollBy(1)}
          />

          <div
            ref={scrollRef}
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-12 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {galleryItems.map((item, index) => (
              <figure
                key={`${item.src}-${index}`}
                className="w-[82%] shrink-0 snap-start sm:w-[44%] lg:w-[31%]"
              >
                <div className="relative overflow-hidden rounded-3xl border border-[#D4AF37]/20 bg-[#0F0F0F] shadow-2xl">
                  <Image
                    src={item.src}
                    alt={`${trip.title} — ${item.caption}`}
                    width={640}
                    height={480}
                    sizes="(max-width: 768px) 82vw, 31vw"
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-4 pt-10">
                    <p className="rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                      Image {index + 1} of {total}
                    </p>
                  </div>
                </div>
                <figcaption className="mt-3 text-center text-base font-bold text-white/90">
                  {item.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CarouselArrow({ label, direction, disabled, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`absolute top-[38%] z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border-2 transition md:h-12 md:w-12 ${
        direction === "left" ? "left-0" : "right-0"
      } ${
        disabled
          ? "cursor-not-allowed border-white/20 bg-white/5 text-white/30"
          : "border-[#0F9B9B] bg-[#0F9B9B] text-white hover:scale-105 hover:bg-[#0d8585]"
      }`}
    >
      {direction === "left" ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
    </button>
  );
}
