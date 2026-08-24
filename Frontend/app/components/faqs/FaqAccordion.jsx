"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function FaqAccordion({ items }) {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const isOpen = openId === item.id;

        return (
          <article
            key={item.id}
            className="overflow-hidden rounded-3xl border border-[#D4AF37]/25 bg-white shadow-lg transition hover:border-[#D4AF37]/45"
          >
            <button
              type="button"
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${item.id}`}
              className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left md:px-6 md:py-6"
            >
              <span className="text-xl font-black text-[#1A1A1A] md:text-2xl">{item.heading}</span>
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition ${
                  isOpen
                    ? "border-[#0F9B9B] bg-[#0F9B9B] text-white"
                    : "border-[#D4AF37] bg-[#FFF8E1] text-[#D4AF37]"
                }`}
                aria-hidden="true"
              >
                <ChevronDown
                  className={`h-5 w-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                />
              </span>
            </button>

            <div
              id={`faq-panel-${item.id}`}
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="border-t border-[#D4AF37]/20 bg-[#F9F9F9] px-5 py-5 md:px-6 md:py-6">
                  {item.question ? (
                    <h3 className="text-base font-black text-[#0F9B9B] md:text-lg">{item.question}</h3>
                  ) : null}
                  <p className={`text-sm leading-7 text-[#333333] md:text-base ${item.question ? "mt-3" : ""}`}>
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
