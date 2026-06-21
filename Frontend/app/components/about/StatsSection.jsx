"use client";

import { useEffect, useRef, useState } from "react";
import { companyStats } from "../../data/aboutData";

function AnimatedCounter({ target, suffix = "", isDecimal = false }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const startTime = performance.now();

          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic for smooth deceleration
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = isDecimal
              ? parseFloat((target * eased).toFixed(1))
              : Math.floor(target * eased);
            setCount(current);
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [target, isDecimal]);

  return (
    <span ref={ref} className="text-4xl font-black text-[#D4AF37] md:text-5xl lg:text-6xl">
      {isDecimal ? count.toFixed(1) : count.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  return (
    <section
      className="relative overflow-hidden bg-[#0F0F0F] px-4 py-16 md:py-20"
      aria-label="Company statistics"
    >
      {/* Subtle gold accent lines */}
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />

      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 md:grid-cols-4 md:gap-4">
        {companyStats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center text-center">
            <AnimatedCounter
              target={stat.value}
              suffix={stat.suffix}
              isDecimal={stat.isDecimal}
            />
            <p className="mt-2 text-sm font-medium uppercase tracking-widest text-white/60">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
