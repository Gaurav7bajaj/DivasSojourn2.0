"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
const DEFAULT_INTERVAL_MS = 6000;

export default function CategoryHero({
  slides = [],
  upcomingCount = 0,
  startingPriceLabel = "₹—",
  breadcrumbLabel = "Trips",
  eyebrow = "Explore",
  title = "Trips",
  titleItalic = "trips",
  description = "",
  ariaLabel = "Category trips",
  titleClassName = "md:text-[clamp(3rem,6vw,5.25rem)]",
  primaryCta = { label: "See departures", href: "#departures" },
  secondaryCta = { label: "Personalize a trip", href: "/personalize-trip" },
  intervalMs = DEFAULT_INTERVAL_MS,
}) {
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
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [slideCount, isPaused, reduceMotion, activeIndex, intervalMs]);

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

  if (!slideCount) {
    return null;
  }

  const activeSlide = slides[activeIndex];
  const counterCurrent = String(activeIndex + 1).padStart(2, "0");
  const counterTotal = String(slideCount).padStart(2, "0");
  const progressRunning = !isPaused && !reduceMotion;

  const stats = [
    { value: String(upcomingCount), label: "upcoming departures" },
    { value: startingPriceLabel, label: "starting from" },
    { value: "Women-only", label: "small groups" },
  ];

  return (
    <section
      ref={sectionRef}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
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
      className="category-hero relative isolate overflow-hidden bg-[#0B0B0C] outline-none"
      style={{
        height: "clamp(520px, calc(100vh - 4.5rem), 600px)",
      }}
    >
      <style>{`
        @media (min-width: 768px) {
          section[aria-roledescription="carousel"].category-hero {
            height: clamp(520px, calc(100vh - 7.5rem), 600px) !important;
          }
        }
        @keyframes category-hero-progress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        .category-hero-progress-fill {
          transform-origin: left center;
          transform: scaleX(0);
        }
        .category-hero-progress-fill.is-active {
          animation: category-hero-progress ${intervalMs}ms linear forwards;
        }
        .category-hero-progress-fill.is-paused {
          transform: scaleX(1);
          animation: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .category-hero-fade {
            transition: none !important;
          }
          .category-hero-progress-fill.is-active {
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
            className={`category-hero-fade absolute inset-0 transition-opacity ease-[ease] ${
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
                  : "object-cover max-md:object-center"
              }
              style={
                isPortrait
                  ? undefined
                  : { objectPosition: slide.objectPosition || "center 40%" }
              }
            />
          </div>
        );
      })}

      <div
        className="pointer-events-none absolute inset-0 z-[1] hidden md:block"
        style={{
          background:
            "linear-gradient(90deg, rgba(8,8,10,.9) 0%, rgba(8,8,10,.62) 38%, rgba(8,8,10,.05) 72%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] md:hidden"
        style={{
          background:
            "linear-gradient(0deg, rgba(8,8,10,.96) 0%, rgba(8,8,10,.72) 48%, rgba(8,8,10,.1) 78%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[170px]"
        style={{
          background: "linear-gradient(0deg, rgba(8,8,10,.8), transparent)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-[2] flex h-full flex-col justify-end px-5 pb-7 md:justify-start md:px-[6vw] md:pb-0 md:pt-14">
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
              <li className="font-semibold text-[#D6AE3C]">{breadcrumbLabel}</li>
            </ol>
          </nav>

          <div className="mt-[18px] flex items-center justify-center gap-3 md:justify-start">
            <span className="hidden h-0.5 w-9 shrink-0 bg-[#D6AE3C] md:block" aria-hidden="true" />
            <p className="font-[family-name:var(--font-dm-sans)] text-[13px] font-bold uppercase tracking-[0.24em] text-[#D6AE3C]">
              {eyebrow}
            </p>
          </div>

          <h1
            className={`font-[family-name:var(--font-playfair)] text-[42px] font-semibold leading-none tracking-[-0.015em] text-[#FBF8F1] sm:text-[52px] ${titleClassName}`}
          >
            {title}{" "}
            <em className="font-[family-name:var(--font-playfair)] text-[length:inherit] font-medium italic text-[#E2BB4D]">
              {titleItalic}
            </em>
          </h1>

          {description ? (
            <p className="mx-auto max-w-[520px] font-[family-name:var(--font-dm-sans)] text-[16px] leading-[1.55] text-[#D9D3C6] md:mx-0 md:text-[19px]">
              {description}
            </p>
          ) : null}

          <div className="flex flex-col gap-3.5 md:flex-row md:items-center">
            <a
              href={primaryCta.href}
              className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[#D6AE3C] px-7 font-[family-name:var(--font-dm-sans)] text-[15px] font-bold text-[#1A1405] transition hover:bg-[#E6BF4C] md:h-[54px] md:w-auto"
            >
              {primaryCta.label}
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </a>
            <Link
              href={secondaryCta.href}
              className="inline-flex h-[52px] w-full items-center justify-center rounded-full border-[1.5px] border-[rgba(245,241,232,0.7)] bg-transparent px-7 font-[family-name:var(--font-dm-sans)] text-[15px] font-semibold text-white transition hover:bg-white/12 md:h-[54px] md:w-auto"
            >
              {secondaryCta.label}
            </Link>
          </div>

          <div className="flex items-center justify-center gap-2 pt-1 md:hidden">
            {slides.map((slide, index) => (
              <ProgressBar
                key={`m-${slide.image}-${index}`}
                label={`Go to slide ${index + 1}`}
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

      <div className="pointer-events-none absolute bottom-9 left-[6vw] right-16 z-[3] hidden items-end justify-between md:flex">
        <ul className="pointer-events-auto m-0 flex list-none items-stretch p-0">
          {stats.map((stat, index) => (
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
          <p className="font-[family-name:var(--font-dm-sans)] text-[14px] font-semibold tracking-[0.1em] text-[#C9C3B6]">
            <span className="text-[#D6AE3C]">{counterCurrent}</span>
            <span> / {counterTotal}</span>
          </p>

          <div className="flex items-center gap-2">
            {slides.map((slide, index) => (
              <ProgressBar
                key={`d-${slide.image}-${index}`}
                label={`Go to slide ${index + 1}`}
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
      className={`relative h-1 overflow-hidden rounded-full bg-[rgba(245,241,232,0.3)] transition-all ${
        active ? "w-14" : "w-5"
      }`}
    >
      <span
        key={animKey}
        className={`category-hero-progress-fill absolute inset-0 bg-[#D6AE3C] ${
          running ? "is-active" : ""
        } ${paused ? "is-paused" : ""}`}
      />
    </button>
  );
}
