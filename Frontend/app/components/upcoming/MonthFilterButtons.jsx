"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function MonthFilterButtons({ months, selectedMonths, onToggleMonth }) {
  const scrollRef = useRef(null);

  const scrollMonths = (direction) => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#1A1A1A] p-2.5 shadow-xl">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => scrollMonths("left")}
          className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/40 text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-[#0F0F0F] md:flex"
          aria-label="Scroll months left"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {months.map((month) => {
            const isActive = selectedMonths.includes(month.value);

            return (
              <button
                key={month.value}
                type="button"
                onClick={() => onToggleMonth(month.value)}
                className={`shrink-0 rounded-xl border px-4 py-2 text-sm font-black transition-all duration-300 ${
                  isActive
                    ? "border-[#D4AF37] bg-[#D4AF37] text-[#0F0F0F]"
                    : "border-[#D4AF37]/30 bg-[#1A1A1A] text-white hover:border-[#D4AF37] hover:bg-[#F5E6D3]"
                }`}
              >
                {month.label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => scrollMonths("right")}
          className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/40 text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-[#0F0F0F] md:flex"
          aria-label="Scroll months right"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
