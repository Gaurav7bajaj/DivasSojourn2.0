"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  HOME_HERO_INTERVAL_MS,
  HOME_HERO_STATS,
  homeHeroSlides,
} from "../../data/homeHeroSlides";

export default function HeroSection() {
  const slides = homeHeroSlides;
  const slideCount = slides.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [portraitFlags, setPortraitFlags] = useState(() => slides.map(() => false));
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
    if (slideCount <= 1 || isPaused || reduceMotion) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slideCount);
    }, HOME_HERO_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [slideCount, isPaused, reduceMotion, activeIndex]);

  const goTo = useCallback(
    (index) => {
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

  const markPortrait = (index, img) => {
    if (!img?.naturalWidth || !img?.naturalHeight) return;
    const isPortrait = img.naturalHeight > img.naturalWidth;
    setPortraitFlags((current) => {
      if (current[index] === isPortrait) return current;
      const next = [...current];
      next[index] = isPortrait;
      return next;
    });
  };

  const activeSlide = slides[activeIndex];
  const counterCurrent = String(activeIndex + 1).padStart(2, "0");
  const counterTotal = String(slideCount).padStart(2, "0");
  const progressRunning = !isPaused && !reduceMotion;

  return (
    <section
      ref={sectionRef}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Divas Sojourn featured journeys"
      onKeyDown={onKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!sectionRef.current?.contains(event.relatedTarget)) {
          setIsPaused(false);
        }
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="relative isolate min-h-[560px] overflow-hidden bg-[#0B0B0C] outline-none md:min-h-[600px]"
      style={{
        height: "calc(100vh - 4.5rem)",
      }}
    >
      {/* Desktop height accounts for both nav bars (~7.5rem). */}
      <style>{`
        @media (min-width: 768px) {
          section[aria-roledescription="carousel"][aria-label="Divas Sojourn featured journeys"] {
            height: calc(100vh - 7.5rem) !important;
          }
        }
        @keyframes home-hero-progress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        .home-hero-progress-fill {
          transform-origin: left center;
          transform: scaleX(0);
        }
        .home-hero-progress-fill.is-active {
          animation: home-hero-progress ${HOME_HERO_INTERVAL_MS}ms linear forwards;
        }
        .home-hero-progress-fill.is-paused {
          transform: scaleX(1);
          animation: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .home-hero-fade {
            transition: none !important;
          }
          .home-hero-progress-fill.is-active {
            animation: none;
            transform: scaleX(1);
          }
        }
      `}</style>

      {slides.map((slide, index) => {
        const isActive = index === activeIndex;
        const isPortrait = portraitFlags[index];

        return (
          <div
            key={`${slide.image}-${index}`}
            className={`home-hero-fade absolute inset-0 transition-opacity ease-[ease] ${
              isActive ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            style={{ transitionDuration: reduceMotion ? "0ms" : "900ms" }}
            aria-hidden={!isActive}
          >
            {isPortrait ? (
              <Image
                src={slide.image}
                alt=""
                fill
                unoptimized
                sizes="100vw"
                aria-hidden="true"
                className="scale-110 object-cover object-center blur-[40px] brightness-50"
              />
            ) : null}

            {/* TODO: Replace with landscape photos, 1920×1080 or larger. */}
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              unoptimized
              sizes="100vw"
              priority={index === 0}
              fetchPriority={index === 0 ? "high" : "auto"}
              loading={index === 0 ? "eager" : "lazy"}
              onLoad={(event) => markPortrait(index, event.currentTarget)}
              className={
                isPortrait
                  ? "object-contain object-center"
                  : "object-cover object-[center_40%] max-md:object-center"
              }
            />
          </div>
        );
      })}

      <div
        className="pointer-events-none absolute inset-0 z-[1] hidden md:block"
        style={{
          background:
            "linear-gradient(90deg, rgba(8,8,10,.88) 0%, rgba(8,8,10,.6) 38%, rgba(8,8,10,.05) 72%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] md:hidden"
        style={{
          background:
            "linear-gradient(0deg, rgba(8,8,10,.95) 0%, rgba(8,8,10,.7) 45%, rgba(8,8,10,.1) 75%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-40"
        style={{
          background: "linear-gradient(0deg, rgba(8,8,10,.75), transparent)",
        }}
        aria-hidden="true"
      />

      <div
        className="relative z-[2] flex h-full flex-col justify-end px-5 pb-9 md:justify-center md:px-[6vw] md:pb-24"
        aria-live="polite"
      >
        <div className="mx-auto flex w-full max-w-[620px] flex-col gap-[22px] text-center md:mx-0 md:text-left">
          <div className="flex items-center justify-center gap-3 md:justify-start">
            <span className="hidden h-0.5 w-9 shrink-0 bg-[#D6AE3C] md:block" aria-hidden="true" />
            <p className="font-[family-name:var(--font-dm-sans)] text-[13px] font-bold uppercase tracking-[0.24em] text-[#D6AE3C]">
              {activeSlide.eyebrow}
            </p>
          </div>

          <h1 className="font-[family-name:var(--font-playfair)] text-[38px] font-semibold leading-[1.06] tracking-[-0.01em] text-[#FBF8F1] md:text-[clamp(2.4rem,4.8vw,4.25rem)]">
            {activeSlide.title}{" "}
            <em className="font-[family-name:var(--font-playfair)] text-[length:inherit] font-medium italic text-[#E2BB4D]">
              {activeSlide.highlight}
            </em>
            {activeSlide.titleAfter ? ` ${activeSlide.titleAfter}` : null}
          </h1>

          <p className="mx-auto max-w-[520px] font-[family-name:var(--font-dm-sans)] text-[17px] leading-[1.55] text-[#D9D3C6] md:mx-0 md:text-[19px]">
            {activeSlide.text}
          </p>

          <div className="flex flex-col gap-3.5 md:flex-row md:items-center">
            <Link
              href={activeSlide.primaryCta.href}
              className="inline-flex h-[54px] w-full items-center justify-center gap-2 rounded-full bg-[#D6AE3C] px-7 font-[family-name:var(--font-dm-sans)] text-[15px] font-bold text-[#1A1405] transition hover:bg-[#E6BF4C] md:w-auto"
            >
              {activeSlide.primaryCta.label}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href={activeSlide.secondaryCta.href}
              className="inline-flex h-[54px] w-full items-center justify-center rounded-full border-[1.5px] border-[rgba(245,241,232,0.7)] bg-transparent px-7 font-[family-name:var(--font-dm-sans)] text-[15px] font-semibold text-white transition hover:bg-white/12 md:w-auto"
            >
              {activeSlide.secondaryCta.label}
            </Link>
          </div>

          <div className="flex items-center justify-center gap-2 pt-1 md:hidden">
            {slides.map((slide, index) => (
              <ProgressBar
                key={`m-${slide.eyebrow}`}
                label={`Go to slide ${index + 1}: ${slide.eyebrow}`}
                active={index === activeIndex}
                running={index === activeIndex && progressRunning}
                paused={index === activeIndex && !progressRunning}
                onClick={() => goTo(index)}
                animKey={`${activeIndex}-${isPaused}-${index}-m`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-10 left-[6vw] right-16 z-[3] hidden items-end justify-between md:flex">
        <ul className="pointer-events-auto m-0 flex list-none items-stretch gap-0 p-0">
          {HOME_HERO_STATS.map((stat, index) => (
            <li key={stat.label} className="flex items-stretch">
              {index > 0 ? (
                <span className="mx-11 w-px self-stretch bg-[rgba(245,241,232,0.2)]" aria-hidden="true" />
              ) : null}
              <div>
                <p className="font-[family-name:var(--font-playfair)] text-[30px] font-semibold leading-none text-[#FBF8F1]">
                  {stat.value}
                </p>
                <p className="mt-2 font-[family-name:var(--font-dm-sans)] text-[13px] text-[#C9C3B6]">
                  {stat.label}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="pointer-events-auto flex items-center gap-[22px]">
          <p
            className="font-[family-name:var(--font-dm-sans)] text-[14px] font-semibold tracking-[0.1em] text-[#C9C3B6]"
            aria-live="polite"
          >
            <span className="text-[#D6AE3C]">{counterCurrent}</span>
            <span> / {counterTotal}</span>
          </p>

          <div className="flex items-center gap-2">
            {slides.map((slide, index) => (
              <ProgressBar
                key={`d-${slide.eyebrow}`}
                label={`Go to slide ${index + 1}: ${slide.eyebrow}`}
                active={index === activeIndex}
                running={index === activeIndex && progressRunning}
                paused={index === activeIndex && !progressRunning}
                onClick={() => goTo(index)}
                animKey={`${activeIndex}-${isPaused}-${index}-d`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
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
      </div>
    </section>
  );
}

function ProgressBar({ label, active, running, paused, onClick, animKey }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-current={active ? "true" : undefined}
      onClick={onClick}
      className={`relative h-1 overflow-hidden rounded-full bg-[rgba(245,241,232,0.25)] transition-all ${
        active ? "w-14" : "w-5"
      }`}
    >
      <span
        key={animKey}
        className={`home-hero-progress-fill absolute inset-0 bg-[#D6AE3C] ${
          running ? "is-active" : ""
        } ${paused ? "is-paused" : ""}`}
      />
    </button>
  );
}
