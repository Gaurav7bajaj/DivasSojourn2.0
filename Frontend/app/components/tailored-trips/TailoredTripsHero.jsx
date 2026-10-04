"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { tailoredHeroImages } from "../../data/tailoredDestinations";

const INTERVAL_MS = 4000;

function stripCacheBust(src) {
  return String(src || "").split("?")[0];
}

export default function TailoredTripsHero() {
  const slides = tailoredHeroImages
    .map((image) => ({
      image: stripCacheBust(image.src),
      alt: image.alt || "Tailored trip destination",
    }))
    .filter((slide) => slide.image);

  const slideCount = slides.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const touchStartX = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (slideCount <= 1 || isPaused || reduceMotion) return undefined;
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slideCount);
    }, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [slideCount, isPaused, reduceMotion, activeIndex]);

  const goTo = useCallback(
    (index) => {
      if (!slideCount) return;
      setActiveIndex(((index % slideCount) + slideCount) % slideCount);
    },
    [slideCount],
  );
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  const onKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goPrev();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goNext();
    }
  };

  const onTouchStart = (event) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event) => {
    if (touchStartX.current == null) return;
    const delta = (event.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 48) return;
    if (delta > 0) goPrev();
    else goNext();
  };

  const counterCurrent = String(activeIndex + 1).padStart(2, "0");
  const counterTotal = String(Math.max(slideCount, 1)).padStart(2, "0");
  const progressRunning = !isPaused && !reduceMotion && slideCount > 1;

  return (
    <section
      ref={sectionRef}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Tailored trips"
      onKeyDown={onKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!sectionRef.current?.contains(event.relatedTarget)) setIsPaused(false);
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="relative isolate overflow-hidden bg-[#0B0B0C] outline-none"
      style={{ height: "clamp(480px, 70vh, 560px)" }}
    >
      <style>{`
        @keyframes tailored-hero-progress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        .tailored-hero-progress-fill {
          transform-origin: left center;
          transform: scaleX(0);
        }
        .tailored-hero-progress-fill.is-active {
          animation: tailored-hero-progress ${INTERVAL_MS}ms linear forwards;
        }
        .tailored-hero-progress-fill.is-paused {
          transform: scaleX(1);
          animation: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .tailored-hero-fade { transition: none !important; }
          .tailored-hero-progress-fill.is-active {
            animation: none;
            transform: scaleX(1);
          }
        }
      `}</style>

      {slides.map((slide, index) => {
        const isActive = index === activeIndex;
        return (
          <div
            key={`${slide.image}-${index}`}
            className={`tailored-hero-fade absolute inset-0 transition-opacity ease-[ease] ${
              isActive ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            style={{ transitionDuration: reduceMotion ? "0ms" : "900ms" }}
            aria-hidden={!isActive}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: "center 35%" }}
            />
          </div>
        );
      })}

      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(90deg, rgba(8,8,10,.92) 0%, rgba(8,8,10,.65) 40%, rgba(8,8,10,.05) 75%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[160px]"
        style={{ background: "linear-gradient(0deg, #0B0B0C, transparent)" }}
        aria-hidden="true"
      />

      <div className="relative z-[2] flex h-full flex-col justify-end px-5 pb-10 md:justify-start md:px-0 md:pb-0 md:pl-24 md:pt-16">
        <div className="mx-auto flex w-full max-w-[620px] flex-col gap-5 text-center md:mx-0 md:text-left">
          <nav
            className="font-[family-name:var(--font-dm-sans)] text-[14px] text-[#C9C3B6]"
            aria-label="Breadcrumb"
          >
            <ol className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <li>
                <Link href="/" className="transition hover:text-[#D6AE3C]">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="font-semibold text-[#D6AE3C]">Tailored Trips</li>
            </ol>
          </nav>

          <div className="flex items-center justify-center gap-3 md:justify-start">
            <span className="hidden h-0.5 w-9 shrink-0 bg-[#D6AE3C] md:block" aria-hidden="true" />
            <p className="font-[family-name:var(--font-dm-sans)] text-[13px] font-bold uppercase tracking-[0.24em] text-[#D6AE3C]">
              Tailored trips
            </p>
          </div>

          <h1 className="font-[family-name:var(--font-playfair)] text-[clamp(3rem,6vw,5rem)] font-semibold leading-none tracking-[-0.015em] text-[#FBF8F1]">
            Your journey,{" "}
            <em className="font-[family-name:var(--font-playfair)] font-medium italic text-[#E2BB4D]">
              your way
            </em>
          </h1>

          <p className="mx-auto max-w-[540px] font-[family-name:var(--font-dm-sans)] text-[16px] leading-[1.55] text-[#D9D3C6] md:mx-0 md:text-[19px]">
            Choose a destination you love — we craft a women-first itinerary around your pace,
            preferences and travel style.
          </p>

          <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-center md:justify-start">
            <a
              href="#destinations"
              className="inline-flex h-[54px] items-center justify-center rounded-full bg-[#D6AE3C] px-7 font-[family-name:var(--font-dm-sans)] text-[15px] font-bold text-[#1A1405] transition hover:bg-[#E6BF4C]"
            >
              Start planning →
            </a>
            <a
              href="#how"
              className="inline-flex h-[54px] items-center justify-center rounded-full border-[1.5px] border-[rgba(245,241,232,0.7)] px-7 font-[family-name:var(--font-dm-sans)] text-[15px] font-semibold text-white transition hover:bg-white/12"
            >
              How it works
            </a>
          </div>

          {slideCount > 1 ? (
            <div className="flex items-center justify-center gap-2 pt-1 md:hidden">
              {slides.map((slide, index) => (
                <ProgressBar
                  key={`m-${slide.image}-${index}`}
                  active={index === activeIndex}
                  running={index === activeIndex && progressRunning}
                  paused={index === activeIndex && !progressRunning}
                  onClick={() => goTo(index)}
                  animKey={`${activeIndex}-${isPaused}-${index}-m`}
                  label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {slideCount > 1 ? (
        <div className="pointer-events-none absolute bottom-9 right-5 z-[3] hidden items-center gap-[18px] md:flex md:right-12 xl:right-24">
          <p className="pointer-events-auto font-[family-name:var(--font-dm-sans)] text-[14px] font-semibold tracking-[0.1em] text-[#C9C3B6]">
            <span className="text-[#D6AE3C]">{counterCurrent}</span>
            <span> / {counterTotal}</span>
          </p>
          <div className="pointer-events-auto flex items-center gap-2">
            {slides.map((slide, index) => (
              <ProgressBar
                key={`d-${slide.image}-${index}`}
                active={index === activeIndex}
                running={index === activeIndex && progressRunning}
                paused={index === activeIndex && !progressRunning}
                onClick={() => goTo(index)}
                animKey={`${activeIndex}-${isPaused}-${index}-d`}
                label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous slide"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(245,241,232,0.45)] bg-[rgba(8,8,10,0.4)] text-[#FBF8F1] transition hover:border-[#D6AE3C] hover:bg-[#D6AE3C] hover:text-[#1A1405]"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next slide"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(245,241,232,0.45)] bg-[rgba(8,8,10,0.4)] text-[#FBF8F1] transition hover:border-[#D6AE3C] hover:bg-[#D6AE3C] hover:text-[#1A1405]"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function ProgressBar({ active, running, paused, onClick, animKey, label }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-current={active ? "true" : undefined}
      onClick={onClick}
      className="h-1.5 w-8 overflow-hidden rounded-full bg-white/20"
    >
      <span
        key={animKey}
        className={`tailored-hero-progress-fill block h-full rounded-full bg-[#D6AE3C] ${
          active ? (paused ? "is-paused" : running ? "is-active" : "is-paused") : ""
        }`}
        style={!active ? { transform: "scaleX(0)" } : undefined}
      />
    </button>
  );
}
