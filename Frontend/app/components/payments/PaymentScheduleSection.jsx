"use client";

import { useId, useState } from "react";
import { scheduleConfig, scheduleFootnote } from "../../data/paymentData";

const TABS = [
  { id: "short", label: "Short haul" },
  { id: "long", label: "Long haul" },
];

export default function PaymentScheduleSection() {
  const [active, setActive] = useState("short");
  const baseId = useId();
  const tablistId = `${baseId}-tablist`;

  return (
    <section
      id="schedule"
      className="scroll-mt-28 bg-[#0B0B0C] px-6 py-16 md:px-12 md:py-24 xl:px-24"
      aria-labelledby="payment-schedule-heading"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="h-0.5 w-9 shrink-0 bg-[#D6AE3C]" aria-hidden="true" />
              <p className="font-[family-name:var(--font-dm-sans)] text-[13px] font-bold uppercase tracking-[0.24em] text-[#D6AE3C]">
                Payment Policy
              </p>
            </div>
            <h2
              id="payment-schedule-heading"
              className="mt-4 font-[family-name:var(--font-playfair)] text-[36px] font-semibold leading-tight text-[#FBF8F1] md:text-[44px]"
            >
              When do I{" "}
              <em className="font-[family-name:var(--font-playfair)] font-medium italic text-[#E2BB4D]">
                pay?
              </em>
            </h2>
            <p className="mt-4 font-[family-name:var(--font-dm-sans)] text-[16px] leading-[1.55] text-[#D9D3C6] md:text-[17px]">
              Your schedule depends on whether your destination is short haul or long haul.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Haul type"
            id={tablistId}
            className="inline-flex h-12 shrink-0 rounded-full border border-white/[0.14] bg-[#121215] p-1"
          >
            {TABS.map((tab) => {
              const selected = active === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  id={`${baseId}-tab-${tab.id}`}
                  aria-selected={selected}
                  aria-controls={`${baseId}-panel-${tab.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(tab.id)}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                      event.preventDefault();
                      setActive((current) => (current === "short" ? "long" : "short"));
                    }
                  }}
                  className={`inline-flex h-10 min-w-[120px] items-center justify-center rounded-full px-5 font-[family-name:var(--font-dm-sans)] text-[14px] font-bold transition ${
                    selected
                      ? "bg-[#D6AE3C] text-[#1A1405]"
                      : "text-[#C9C3B6] hover:text-[#FBF8F1]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {TABS.map((tab) => {
          const panelConfig = scheduleConfig[tab.id];
          const isActive = active === tab.id;
          return (
            <div
              key={tab.id}
              role="tabpanel"
              id={`${baseId}-panel-${tab.id}`}
              aria-labelledby={`${baseId}-tab-${tab.id}`}
              hidden={!isActive}
              className="mt-10"
            >
              {isActive ? (
                <div className="rounded-[24px] border border-white/[0.08] bg-[#141417] px-6 py-8 md:px-9 md:py-8">
                  <p className="font-[family-name:var(--font-dm-sans)] text-[12px] font-bold uppercase tracking-[0.18em] text-[#8F897D]">
                    {panelConfig.destinationsLabel}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {panelConfig.destinations.map((dest) => (
                      <span
                        key={dest}
                        className="rounded-full bg-[#1C1C21] px-3 py-1.5 font-[family-name:var(--font-dm-sans)] text-[13px] text-[#D9D3C6]"
                      >
                        {dest}
                      </span>
                    ))}
                    <span className="rounded-full bg-[#1C1C21] px-3 py-1.5 font-[family-name:var(--font-dm-sans)] text-[13px] text-[#8F897D]">
                      and similar
                    </span>
                  </div>

                  <ol className="mt-10 grid gap-8 md:grid-cols-4 md:gap-4">
                    {panelConfig.steps.map((step, index) => {
                      const isLast = index === panelConfig.steps.length - 1;
                      return (
                        <li key={step.when} className="relative flex gap-4 md:flex-col md:gap-0">
                          {/* Connector + circle */}
                          <div className="flex flex-col items-center md:mb-5 md:flex-row md:items-center">
                            <span
                              className={`relative z-[1] flex h-[18px] w-[18px] shrink-0 rounded-full border-2 border-[#D6AE3C] ${
                                isLast ? "bg-[#D6AE3C]" : "bg-[#141417]"
                              }`}
                              aria-hidden="true"
                            />
                            {!isLast ? (
                              <>
                                <span
                                  className="mt-1 w-0.5 flex-1 bg-[#D6AE3C] md:hidden"
                                  aria-hidden="true"
                                />
                                <span
                                  className="absolute left-[18px] right-0 top-[7px] hidden h-0.5 bg-[#D6AE3C] md:block"
                                  aria-hidden="true"
                                />
                              </>
                            ) : null}
                          </div>

                          <div className="min-w-0 flex-1 pb-2 md:pb-0 md:pr-4">
                            <p className="font-[family-name:var(--font-dm-sans)] text-[13px] font-bold uppercase tracking-[0.14em] text-[#C9C3B6]">
                              {step.when}
                            </p>
                            <p className="mt-2 font-[family-name:var(--font-playfair)] text-[40px] font-semibold leading-none text-[#D6AE3C] md:text-[44px]">
                              {step.amount}
                            </p>
                            <p className="mt-3 font-[family-name:var(--font-dm-sans)] text-[14px] leading-[1.5] text-[#D9D3C6]">
                              {step.detail}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ol>

                  <p className="mt-10 border-t border-white/[0.08] pt-5 font-[family-name:var(--font-dm-sans)] text-[13px] leading-[1.55] text-[#8F897D]">
                    {scheduleFootnote}
                  </p>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
