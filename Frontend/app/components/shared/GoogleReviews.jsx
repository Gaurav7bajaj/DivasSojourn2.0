"use client";

import { useEffect, useState } from "react";
import { GOOGLE, REVIEWS } from "../../data/googleReviews";

function GoogleG({ className = "h-5 w-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function Stars({ rating = 5, size = "h-3.5 w-3.5" }) {
  const filled = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`Rated ${filled} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={size}
          viewBox="0 0 20 20"
          fill={i < filled ? "#D6AE3C" : "rgba(214,174,60,0.25)"}
          aria-hidden="true"
        >
          <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.27 5.06 16.71l.94-5.5-4-3.9 5.53-.8L10 1.5z" />
        </svg>
      ))}
    </span>
  );
}

/** Hide a leading "5/5 Stars …" line on the card only — data stays unchanged. */
function displayReviewText(raw) {
  const text = String(raw || "");
  const stripped = text.replace(/^\s*5\/5\s*Stars[^\n]*\n?/i, "");
  return stripped.trimStart() || text;
}

function ReviewCard({ review, inert = false }) {
  const name = review.name?.trim() || "Reviewer";
  const date = review.date?.trim() || "";
  const text = displayReviewText(review.text);
  const href = review.url?.trim() || GOOGLE.allReviewsUrl;
  const initial = (name[0] || "?").toUpperCase();

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={inert ? -1 : undefined}
      className="google-review-card group flex w-[290px] shrink-0 flex-col rounded-[20px] border border-[rgba(255,255,255,0.08)] bg-[#141417] p-6 transition hover:border-[rgba(214,174,60,0.6)] hover:bg-[#18181C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D6AE3C] sm:w-[400px]"
    >
      <div className="flex items-center justify-between gap-3">
        <Stars rating={review.rating || 5} />
        <GoogleG className="h-4 w-4 shrink-0 opacity-90" />
      </div>

      <p className="google-review-clamp mt-4 font-[family-name:var(--font-dm-sans)] text-[15px] leading-[1.55] text-[#FBF8F1]">
        “{text}”
      </p>

      <div className="mt-auto flex items-center gap-3 pt-5">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#D6AE3C] font-[family-name:var(--font-dm-sans)] text-sm font-bold text-[#1A1405]"
          aria-hidden="true"
        >
          {initial}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-[family-name:var(--font-dm-sans)] text-sm font-semibold text-[#FBF8F1]">
            {name}
          </p>
          <p className="truncate font-[family-name:var(--font-dm-sans)] text-xs text-[#8F897D]">
            {date}
          </p>
        </div>
        <span
          className="shrink-0 font-[family-name:var(--font-dm-sans)] text-base text-[#D6AE3C] transition group-hover:text-[#E6BF4C]"
          aria-hidden="true"
        >
          ↗
        </span>
      </div>
    </a>
  );
}

function MarqueeRow({ reviews, reverse = false }) {
  const list = reviews.length ? reviews : [];

  return (
    <div className={`google-reviews-row ${reverse ? "is-reverse" : ""}`}>
      <div className="google-reviews-track">
        <div className="google-reviews-set flex gap-4 pr-4">
          {list.map((review, index) => (
            <ReviewCard key={`a-${review.id ?? index}`} review={review} />
          ))}
        </div>
        <div className="google-reviews-set flex gap-4 pr-4" aria-hidden="true">
          {list.map((review, index) => (
            <ReviewCard key={`b-${review.id ?? index}`} review={review} inert />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Static Google reviews wall — same reviews on every page.
 * @param {{ eyebrow?: string, title?: string, titleAccent?: string, suffix?: string }} props
 */
export default function GoogleReviews({
  eyebrow,
  title = "Don't take",
  titleAccent = "our word",
  suffix = " for it",
}) {
  const [reviews, setReviews] = useState(REVIEWS);
  const [meta, setMeta] = useState({
    rating: GOOGLE.rating,
    count: GOOGLE.count,
    allReviewsUrl: GOOGLE.allReviewsUrl,
    writeReviewUrl: GOOGLE.writeReviewUrl,
  });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/reviews", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        if (Array.isArray(data.reviews) && data.reviews.length) {
          setReviews(data.reviews);
        }
        if (data.google) {
          setMeta((prev) => ({ ...prev, ...data.google }));
        }
      })
      .catch(() => {
        /* keep static fallback */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const resolvedEyebrow = eyebrow ?? `LOVED BY ${meta.count}+ DIVAS`;
  const row1 = reviews.slice(0, 10);
  const row2 = reviews.slice(10, 20);

  return (
    <section
      aria-label="Google reviews"
      className="google-reviews relative overflow-hidden bg-[#0B0B0C] px-0 py-16 md:py-24"
    >
      <style>{`
        .google-reviews {
          background-image: radial-gradient(ellipse 70% 45% at 50% 0%, rgba(214,174,60,0.10), transparent 70%);
        }
        .google-review-clamp {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 4;
          overflow: hidden;
          white-space: pre-line;
          min-height: 5.8em;
          font-family: var(--font-dm-sans), system-ui, "Noto Sans Devanagari", sans-serif;
        }
        .google-reviews-wall {
          mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
        }
        .google-reviews-row {
          overflow: hidden;
        }
        .google-reviews-track {
          display: flex;
          width: max-content;
          padding-inline: 1.25rem;
          animation: google-reviews-marquee 60s linear infinite;
        }
        .google-reviews-row.is-reverse .google-reviews-track {
          animation-name: google-reviews-marquee-reverse;
        }
        .google-reviews-row:hover .google-reviews-track,
        .google-reviews-row:focus-within .google-reviews-track {
          animation-play-state: paused;
        }
        @keyframes google-reviews-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes google-reviews-marquee-reverse {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        @media (max-width: 767px) {
          .google-reviews-row {
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            touch-action: pan-x;
          }
          .google-reviews-row::-webkit-scrollbar { display: none; }
          .google-reviews-track {
            animation: none;
          }
          .google-reviews-set:last-child {
            display: none;
          }
          .google-review-card {
            scroll-snap-align: start;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .google-reviews-row {
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            scrollbar-width: none;
          }
          .google-reviews-row::-webkit-scrollbar { display: none; }
          .google-reviews-track {
            animation: none !important;
          }
          .google-reviews-set:last-child {
            display: none;
          }
          .google-review-card {
            scroll-snap-align: start;
          }
        }
      `}</style>

      <div className="mx-auto max-w-[720px] px-5 text-center md:px-12">
        <div className="flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-[#D6AE3C] sm:w-10" aria-hidden="true" />
          <p className="font-[family-name:var(--font-dm-sans)] text-[12px] font-bold uppercase tracking-[0.24em] text-[#D6AE3C] sm:text-[13px]">
            {resolvedEyebrow}
          </p>
          <span className="h-px w-8 bg-[#D6AE3C] sm:w-10" aria-hidden="true" />
        </div>

        <h2 className="mt-5 font-[family-name:var(--font-playfair)] text-[36px] font-semibold leading-[1.1] tracking-[-0.01em] text-[#FBF8F1] md:text-[56px]">
          {title}{" "}
          <em className="font-[family-name:var(--font-playfair)] font-medium italic text-[#D6AE3C]">
            {titleAccent}
          </em>
          {suffix}
        </h2>

        <a
          href={meta.allReviewsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-flex items-center gap-2.5 rounded-full border border-[rgba(214,174,60,0.45)] bg-[rgba(20,20,23,0.8)] px-4 py-2.5 transition hover:border-[#D6AE3C] hover:bg-[#18181C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D6AE3C] sm:gap-3 sm:px-5"
        >
          <GoogleG className="h-5 w-5" />
          <span className="font-[family-name:var(--font-playfair)] text-[22px] font-semibold text-[#FBF8F1]">
            {meta.rating}
          </span>
          <Stars rating={5} size="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          <span className="font-[family-name:var(--font-dm-sans)] text-[13px] text-[#8F897D] sm:text-sm">
            {meta.count} Google reviews
          </span>
        </a>
      </div>

      <div className="google-reviews-wall mt-12 space-y-4 md:mt-14">
        <MarqueeRow reviews={row1} />
        <MarqueeRow reviews={row2} reverse />
      </div>

      <div className="mx-auto mt-12 flex max-w-[720px] flex-col items-center gap-3 px-5 md:mt-14 md:flex-row md:justify-center md:gap-4 md:px-12">
        <a
          href={meta.allReviewsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-[54px] w-full items-center justify-center gap-2 rounded-full bg-[#D6AE3C] px-7 font-[family-name:var(--font-dm-sans)] text-[15px] font-bold text-[#1A1405] transition hover:bg-[#E6BF4C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D6AE3C] md:w-auto"
        >
          Read all {meta.count} reviews on Google
          <span aria-hidden="true">↗</span>
        </a>
        <a
          href={meta.writeReviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-[54px] w-full items-center justify-center rounded-full border-[1.5px] border-[#D6AE3C] bg-transparent px-7 font-[family-name:var(--font-dm-sans)] text-[15px] font-semibold text-[#D6AE3C] transition hover:bg-[rgba(214,174,60,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D6AE3C] md:w-auto"
        >
          Write a review
        </a>
      </div>

      <p className="mt-5 px-5 text-center font-[family-name:var(--font-dm-sans)] text-[12px] text-[#8F897D] md:text-[13px]">
        <span className="hidden md:inline">Hover to pause · tap any review to read it on Google</span>
        <span className="md:hidden">Swipe or tap any review to read it on Google</span>
      </p>
    </section>
  );
}
