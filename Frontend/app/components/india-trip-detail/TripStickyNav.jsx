"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { formatInr, getDisplayPrice } from "./tripDetailUtils";

export default function TripStickyNav({ sections, trip, bookHref, onSectionClick }) {
  const [activeId, setActiveId] = useState(sections[0]?.id || "overview");
  const price = getDisplayPrice(trip);

  const ids = useMemo(() => sections.map((s) => s.id), [sections]);

  useEffect(() => {
    if (!ids.length) return undefined;

    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-30% 0px -55% 0px",
        threshold: [0.1, 0.25, 0.5],
      },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [ids]);

  const scrollTo = (id) => {
    onSectionClick?.(id);
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <div className="sticky top-[73px] z-40 border-b border-white/8 bg-[#0F0F12]">
        <div className="flex h-16 items-center justify-between gap-4 px-5 md:px-12 xl:px-24">
          <nav
            aria-label="Trip sections"
            className="-mx-1 flex min-w-0 flex-1 items-center gap-1 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {sections.map((section) => {
              const isActive = activeId === section.id;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => scrollTo(section.id)}
                  className={[
                    "relative shrink-0 px-3 py-2 font-[family-name:var(--font-dm-sans)] text-[14px] font-semibold transition",
                    isActive ? "text-[#FBF8F1]" : "text-[#8F897D] hover:text-[#C9C3B6]",
                  ].join(" ")}
                >
                  {section.label}
                  {isActive ? (
                    <span className="absolute inset-x-3 bottom-0 h-0.5 bg-[#D6AE3C]" aria-hidden="true" />
                  ) : null}
                </button>
              );
            })}
          </nav>

          <div className="hidden shrink-0 items-center gap-3 md:flex">
            {price > 0 ? (
              <p className="font-[family-name:var(--font-dm-sans)] text-[14px] font-semibold text-[#C9C3B6]">
                From{" "}
                <span className="font-bold text-[#FBF8F1]">₹{formatInr(price)}</span>
              </p>
            ) : (
              <p className="font-[family-name:var(--font-dm-sans)] text-[14px] font-semibold text-[#D6AE3C]">
                Coming soon
              </p>
            )}
            <Link
              href={bookHref}
              className="inline-flex h-[42px] items-center rounded-full bg-[#D6AE3C] px-4 font-[family-name:var(--font-dm-sans)] text-[14px] font-bold text-[#1A1405] transition hover:bg-[#E6BF4C]"
            >
              Book now
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile fixed book bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/8 bg-[#0F0F12]/95 px-5 py-3 backdrop-blur md:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            {price > 0 ? (
              <>
                <p className="font-[family-name:var(--font-dm-sans)] text-[12px] text-[#8F897D]">From</p>
                <p className="font-[family-name:var(--font-dm-sans)] text-[18px] font-bold text-[#FBF8F1]">
                  ₹{formatInr(price)}
                </p>
              </>
            ) : (
              <p className="font-[family-name:var(--font-dm-sans)] text-[16px] font-bold text-[#D6AE3C]">
                Coming soon
              </p>
            )}
          </div>
          <Link
            href={bookHref}
            className="inline-flex h-11 min-w-[140px] items-center justify-center rounded-full bg-[#D6AE3C] px-5 font-[family-name:var(--font-dm-sans)] text-[14px] font-bold text-[#1A1405]"
          >
            Book now
          </Link>
        </div>
      </div>
    </>
  );
}
