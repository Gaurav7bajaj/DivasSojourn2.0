"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function HeroImageCarousel({
  images,
  intervalMs = 2000,
  className = "",
  imageClassName = "object-cover object-center",
  children,
  ariaLabel = "Hero image carousel",
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slideCount = images?.length || 0;

  useEffect(() => {
    if (slideCount <= 1 || isPaused) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slideCount);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [slideCount, intervalMs, isPaused, activeIndex]);

  if (!slideCount) {
    return null;
  }

  const goToSlide = (direction) => {
    setActiveIndex((index) => {
      if (direction === "previous") {
        return index === 0 ? slideCount - 1 : index - 1;
      }
      return (index + 1) % slideCount;
    });
  };

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      aria-label={ariaLabel}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {images.map((image, index) => (
        <Image
          key={image.src}
          src={image.src}
          alt={image.alt}
          fill
          priority={index === 0}
          sizes="100vw"
          className={`transition-opacity duration-500 ${imageClassName} ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {children}

      {slideCount > 1 ? (
        <>
          <button
            type="button"
            onClick={() => goToSlide("previous")}
            className="absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white transition hover:border-[#D4AF37] hover:text-[#D4AF37] md:left-4 md:h-10 md:w-10"
            aria-label="Show previous hero image"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => goToSlide("next")}
            className="absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white transition hover:border-[#D4AF37] hover:text-[#D4AF37] md:right-4 md:h-10 md:w-10"
            aria-label="Show next hero image"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </>
      ) : null}
    </div>
  );
}
