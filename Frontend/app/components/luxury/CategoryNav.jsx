"use client";

import { useEffect, useRef, useState } from "react";
import { luxuryCategories } from "../../data/luxuryExperiencesData";

export default function CategoryNav() {
  const [active, setActive] = useState(luxuryCategories[0].id);
  const observerRefs = useRef({});

  useEffect(() => {
    const observers = [];

    luxuryCategories.forEach((cat) => {
      const el = document.getElementById(`lux-${cat.id}`);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(cat.id);
        },
        { rootMargin: "-40% 0px -55% 0px" }
      );

      observer.observe(el);
      observers.push(observer);
      observerRefs.current[cat.id] = observer;
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(`lux-${id}`);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <nav
      className="sticky top-[72px] z-40 border-b border-[#D4AF37]/15 bg-[#0F0F0F]/95 backdrop-blur-md md:top-[108px]"
      aria-label="Luxury experience categories"
    >
      <div className="scrollbar-hide mx-auto flex max-w-7xl items-center justify-start gap-0 overflow-x-auto px-4 md:justify-center">
        {luxuryCategories.map((cat, i) => (
          <div key={cat.id} className="flex shrink-0 items-center">
            <button
              type="button"
              onClick={() => scrollTo(cat.id)}
              className={`relative whitespace-nowrap px-4 py-4 text-xs font-semibold uppercase tracking-[0.2em] transition-colors duration-300 md:px-6 md:text-sm ${
                active === cat.id
                  ? "text-[#D4AF37]"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              {cat.title}
              {active === cat.id && (
                <span className="absolute inset-x-4 bottom-0 h-0.5 rounded-full bg-[#D4AF37] md:inset-x-6" />
              )}
            </button>
            {i < luxuryCategories.length - 1 && (
              <span
                className="hidden h-1 w-1 shrink-0 rounded-full bg-[#D4AF37]/40 md:block"
                aria-hidden="true"
              />
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
