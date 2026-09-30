"use client";

import Link from "next/link";
import { Check, Minus, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { INR_TO_USD_RATE } from "../../utils/formatPrice";
import {
  derivePlan,
  howItWorksSteps,
  PHONE_DISPLAY,
  PHONE_HREF,
  savingPlanOptions,
  termsAndConditions,
  travelSavingFaqs,
  whyJoinPoints,
} from "../../data/travelSavingPlan";

const inrFormatter = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

function formatInr(amount) {
  return `₹${inrFormatter.format(amount)}`;
}

function formatUsd(amountInr) {
  return `$${Math.round(amountInr / INR_TO_USD_RATE)}`;
}

function findPlan(monthly, months) {
  return savingPlanOptions.find((p) => p.monthly === monthly && p.months === months) || savingPlanOptions[1];
}

const MONTHLY_OPTIONS = [2000, 5000];
const DURATION_OPTIONS = [6, 12];

export default function TravelSavingClient() {
  const [monthly, setMonthly] = useState(5000);
  const [months, setMonths] = useState(12);
  const [openFaq, setOpenFaq] = useState(travelSavingFaqs[0]?.id ?? null);

  const selected = useMemo(() => derivePlan(findPlan(monthly, months)), [monthly, months]);
  const maxBonus = useMemo(
    () => Math.max(...savingPlanOptions.map((p) => derivePlan(p).bonus)),
    [],
  );
  const maxBonusPercent = useMemo(() => {
    const percents = savingPlanOptions.map((p) => derivePlan(p).bonusPercent);
    return Math.max(...percents);
  }, []);

  const selectPlan = (plan, { scrollCalculator = false } = {}) => {
    setMonthly(plan.monthly);
    setMonths(plan.months);
    if (scrollCalculator && typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches) {
      document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      {/* Hero + calculator */}
      <header className="bg-[#0B0B0C] px-6 pb-16 pt-16 md:px-12 md:pb-24 xl:px-24">
        <div className="mx-auto grid max-w-[1280px] items-center gap-12 lg:grid-cols-[1fr_520px] lg:gap-16">
          <div>
            <nav
              aria-label="Breadcrumb"
              className="font-[family-name:var(--font-dm-sans)] text-[13px] text-[#C9C3B6]"
            >
              <Link href="/" className="transition hover:text-[#D6AE3C]">
                Home
              </Link>
              <span className="mx-2 text-white/30" aria-hidden="true">
                /
              </span>
              <span className="text-[#FBF8F1]">Travel Saving Plan</span>
            </nav>

            <div className="mt-5 flex items-center gap-3">
              <span className="h-0.5 w-9 shrink-0 bg-[#D6AE3C]" aria-hidden="true" />
              <p className="font-[family-name:var(--font-dm-sans)] text-[13px] font-bold uppercase tracking-[0.24em] text-[#D6AE3C]">
                Save Little, Travel More
              </p>
            </div>

            <h1 className="mt-4 font-[family-name:var(--font-playfair)] text-[clamp(2.75rem,5vw,4.5rem)] font-semibold leading-[1.08] text-[#FBF8F1]">
              Save monthly.{" "}
              <em className="font-[family-name:var(--font-playfair)] font-medium italic text-[#E2BB4D]">
                Travel for more.
              </em>
            </h1>

            <p className="mt-5 max-w-xl font-[family-name:var(--font-dm-sans)] text-[18px] leading-[1.55] text-[#D9D3C6]">
              Commit a small, fixed amount every month for 6 or 12 months — and unlock a women-only
              travel package worth up to{" "}
              <strong className="font-bold text-[#D6AE3C]">{formatInr(maxBonus)} more</strong> than
              you put in.
            </p>

            <ul className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-3">
              {[
                `From ${formatInr(2000)} / month`,
                `Up to ${maxBonusPercent.toFixed(1)}% bonus value`,
                "2 years to redeem",
              ].map((item) => (
                <li
                  key={item}
                  className="inline-flex items-center gap-2 font-[family-name:var(--font-dm-sans)] text-[14px] text-[#D9D3C6]"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[rgba(214,174,60,0.16)]">
                    <Check className="h-3 w-3 text-[#D6AE3C]" aria-hidden="true" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#plans"
                className="inline-flex h-[54px] items-center justify-center rounded-full bg-[#D6AE3C] px-7 font-[family-name:var(--font-dm-sans)] text-[15px] font-bold text-[#1A1405] transition hover:bg-[#E6BF4C]"
              >
                Choose your plan →
              </a>
              <a
                href="#how"
                className="inline-flex h-[54px] items-center justify-center rounded-full border-[1.5px] border-[rgba(245,241,232,0.7)] px-7 font-[family-name:var(--font-dm-sans)] text-[15px] font-semibold text-[#FBF8F1] transition hover:border-[#D6AE3C] hover:text-[#D6AE3C]"
              >
                How it works
              </a>
            </div>
          </div>

          <div
            id="calculator"
            className="scroll-mt-28 rounded-[28px] border-[1.5px] border-[rgba(214,174,60,0.45)] bg-[#141417] p-7 md:p-8"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-[family-name:var(--font-dm-sans)] text-[12px] font-bold uppercase tracking-[0.18em] text-[#D6AE3C]">
                Savings Calculator
              </p>
            </div>

            <fieldset className="mt-6">
              <legend className="font-[family-name:var(--font-dm-sans)] text-[13px] font-semibold text-[#C9C3B6]">
                I can save every month
              </legend>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {MONTHLY_OPTIONS.map((value) => {
                  const pressed = monthly === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={pressed}
                      onClick={() => setMonthly(value)}
                      className={`inline-flex h-14 items-center justify-center rounded-full font-[family-name:var(--font-dm-sans)] text-[15px] font-bold transition ${
                        pressed
                          ? "bg-[#D6AE3C] text-[#1A1405]"
                          : "border border-white/[0.14] text-[#FBF8F1] hover:border-[#D6AE3C]"
                      }`}
                    >
                      {formatInr(value)}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="mt-5">
              <legend className="font-[family-name:var(--font-dm-sans)] text-[13px] font-semibold text-[#C9C3B6]">
                For
              </legend>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {DURATION_OPTIONS.map((value) => {
                  const pressed = months === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={pressed}
                      onClick={() => setMonths(value)}
                      className={`inline-flex h-14 items-center justify-center rounded-full font-[family-name:var(--font-dm-sans)] text-[15px] font-bold transition ${
                        pressed
                          ? "bg-[#D6AE3C] text-[#1A1405]"
                          : "border border-white/[0.14] text-[#FBF8F1] hover:border-[#D6AE3C]"
                      }`}
                    >
                      {value} months
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div
              className="mt-6 rounded-2xl bg-[#0F0F12] p-5"
              aria-live="polite"
              aria-atomic="true"
            >
              <div className="flex items-center justify-between gap-3 font-[family-name:var(--font-dm-sans)] text-[15px]">
                <span className="text-[#C9C3B6]">You pay in total</span>
                <span className="font-bold text-[#FBF8F1]">{formatInr(selected.total)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between gap-3 font-[family-name:var(--font-dm-sans)] text-[15px]">
                <span className="text-[#C9C3B6]">Bonus from us</span>
                <span className="font-bold text-[#7FD49A]">+ {formatInr(selected.bonus)}</span>
              </div>
              <div className="my-4 h-px bg-white/[0.08]" aria-hidden="true" />
              <p className="font-[family-name:var(--font-dm-sans)] text-[13px] text-[#8F897D]">
                Your travel package
              </p>
              <p className="mt-1 font-[family-name:var(--font-playfair)] text-[40px] font-semibold leading-none text-[#D6AE3C]">
                {formatInr(selected.package)}
              </p>
              <p className="mt-2 font-[family-name:var(--font-dm-sans)] text-[14px] text-[#C9C3B6]">
                {formatUsd(selected.package)} · {selected.bonusPercent.toFixed(1)}% extra value
              </p>
            </div>

            <a
              href={PHONE_HREF}
              className="mt-6 inline-flex h-[54px] w-full items-center justify-center rounded-full bg-[#D6AE3C] font-[family-name:var(--font-dm-sans)] text-[15px] font-bold text-[#1A1405] transition hover:bg-[#E6BF4C]"
            >
              Enrol in this plan →
            </a>
          </div>
        </div>
      </header>

      {/* How it works */}
      <section
        id="how"
        className="scroll-mt-28 bg-[#0B0B0C] px-6 py-20 md:px-12 md:py-[120px] xl:px-24"
        aria-labelledby="how-heading"
      >
        <div className="mx-auto max-w-[1280px]">
          <div className="flex items-center gap-3">
            <span className="h-0.5 w-9 shrink-0 bg-[#D6AE3C]" aria-hidden="true" />
            <p className="font-[family-name:var(--font-dm-sans)] text-[13px] font-bold uppercase tracking-[0.24em] text-[#D6AE3C]">
              How It Works
            </p>
          </div>
          <h2
            id="how-heading"
            className="mt-4 font-[family-name:var(--font-playfair)] text-[36px] font-semibold text-[#FBF8F1] md:text-[44px]"
          >
            Four simple{" "}
            <em className="font-[family-name:var(--font-playfair)] font-medium italic text-[#E2BB4D]">
              steps
            </em>
          </h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorksSteps.map((step) => (
              <article
                key={step.step}
                className="rounded-[20px] border border-white/[0.08] bg-[#141417] p-7"
              >
                <p className="font-[family-name:var(--font-playfair)] text-[40px] font-semibold leading-none text-[#D6AE3C]">
                  {String(step.step).padStart(2, "0")}
                </p>
                <h3 className="mt-4 font-[family-name:var(--font-dm-sans)] text-[18px] font-bold text-[#FBF8F1]">
                  {step.title}
                </h3>
                <p className="mt-2 font-[family-name:var(--font-dm-sans)] text-[15px] leading-[1.55] text-[#D9D3C6]">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section
        id="plans"
        className="scroll-mt-28 bg-[#0B0B0C] px-6 py-20 md:px-12 md:py-[120px] xl:px-24"
        aria-labelledby="plans-heading"
      >
        <div className="mx-auto max-w-[1280px]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-0.5 w-9 shrink-0 bg-[#D6AE3C]" aria-hidden="true" />
                <p className="font-[family-name:var(--font-dm-sans)] text-[13px] font-bold uppercase tracking-[0.24em] text-[#D6AE3C]">
                  Choose Your Plan
                </p>
              </div>
              <h2
                id="plans-heading"
                className="mt-4 font-[family-name:var(--font-playfair)] text-[36px] font-semibold text-[#FBF8F1] md:text-[44px]"
              >
                Pick what{" "}
                <em className="font-[family-name:var(--font-playfair)] font-medium italic text-[#E2BB4D]">
                  fits you
                </em>
              </h2>
            </div>
            <p className="max-w-xs font-[family-name:var(--font-dm-sans)] text-[13px] leading-snug text-[#8F897D] lg:text-right">
              Amounts in Indian Rupees (₹), with approximate US$ values.
            </p>
          </div>

          <div className="-mx-6 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-4">
            {savingPlanOptions.map((raw) => {
              const plan = derivePlan(raw);
              const pressed = selected.id === plan.id;
              const isBest = plan.id === 2;
              return (
                <button
                  key={plan.id}
                  type="button"
                  aria-pressed={pressed}
                  onClick={() => selectPlan(plan, { scrollCalculator: true })}
                  className={`relative min-w-[260px] snap-start rounded-[24px] border-[1.5px] p-6 text-left transition md:min-w-0 ${
                    pressed
                      ? "border-[#D6AE3C] bg-[rgba(214,174,60,0.08)]"
                      : "border-white/[0.08] bg-[#141417] hover:border-[rgba(214,174,60,0.4)]"
                  }`}
                >
                  {isBest ? (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#D6AE3C] px-3 py-1 font-[family-name:var(--font-dm-sans)] text-[11px] font-bold uppercase tracking-wide text-[#1A1405]">
                      Best value
                    </span>
                  ) : null}
                  <p className="font-[family-name:var(--font-dm-sans)] text-[12px] font-bold uppercase tracking-[0.14em] text-[#8F897D]">
                    Option {plan.id} · {plan.months} months
                  </p>
                  <p className="mt-4 font-[family-name:var(--font-playfair)] text-[40px] font-semibold leading-none text-[#FBF8F1]">
                    {formatInr(plan.monthly)}
                    <span className="ml-1 font-[family-name:var(--font-dm-sans)] text-[15px] font-semibold text-[#C9C3B6]">
                      / month
                    </span>
                  </p>
                  <p className="mt-2 font-[family-name:var(--font-dm-sans)] text-[13px] text-[#8F897D]">
                    {formatUsd(plan.monthly)} / month
                  </p>
                  <div className="my-5 h-px bg-white/[0.08]" aria-hidden="true" />
                  <div className="flex justify-between font-[family-name:var(--font-dm-sans)] text-[14px]">
                    <span className="text-[#C9C3B6]">You pay</span>
                    <span className="font-semibold text-[#FBF8F1]">{formatInr(plan.total)}</span>
                  </div>
                  <div className="mt-2 flex justify-between font-[family-name:var(--font-dm-sans)] text-[14px]">
                    <span className="text-[#C9C3B6]">Bonus</span>
                    <span className="font-bold text-[#7FD49A]">+{formatInr(plan.bonus)}</span>
                  </div>
                  <div className="mt-5 rounded-xl bg-[rgba(214,174,60,0.12)] px-4 py-3">
                    <p className="font-[family-name:var(--font-dm-sans)] text-[13px] text-[#C9C3B6]">
                      You get
                    </p>
                    <p className="font-[family-name:var(--font-dm-sans)] text-[22px] font-extrabold text-[#D6AE3C]">
                      {formatInr(plan.package)}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why join */}
      <section
        className="bg-[#0B0B0C] px-6 py-20 md:px-12 md:py-[120px] xl:px-24"
        aria-labelledby="why-heading"
      >
        <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[400px_1fr] lg:gap-16">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-0.5 w-9 shrink-0 bg-[#D6AE3C]" aria-hidden="true" />
              <p className="font-[family-name:var(--font-dm-sans)] text-[13px] font-bold uppercase tracking-[0.24em] text-[#D6AE3C]">
                Why Join
              </p>
            </div>
            <h2
              id="why-heading"
              className="mt-4 font-[family-name:var(--font-playfair)] text-[36px] font-semibold leading-tight text-[#FBF8F1] md:text-[44px]"
            >
              Why save{" "}
              <em className="font-[family-name:var(--font-playfair)] font-medium italic text-[#E2BB4D]">
                with us?
              </em>
            </h2>
            <p className="mt-4 font-[family-name:var(--font-dm-sans)] text-[17px] leading-[1.55] text-[#D9D3C6]">
              A simple monthly commitment that turns into more trip value — with flexibility to use
              it when you&apos;re ready.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {whyJoinPoints.map((point) => (
              <article
                key={point.title}
                className="rounded-2xl border border-white/[0.08] bg-[#141417] p-5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(214,174,60,0.16)]">
                  <Check className="h-5 w-5 text-[#D6AE3C]" aria-hidden="true" strokeWidth={2.75} />
                </div>
                <h3 className="mt-4 font-[family-name:var(--font-dm-sans)] text-[17px] font-bold text-[#FBF8F1]">
                  {point.title}
                </h3>
                <p className="mt-2 font-[family-name:var(--font-dm-sans)] text-[14px] leading-[1.55] text-[#D9D3C6]">
                  {point.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Terms + FAQs */}
      <section className="bg-[#0B0B0C] px-6 py-20 md:px-12 md:py-[120px] xl:px-24">
        <div className="mx-auto grid max-w-[1280px] gap-14 lg:grid-cols-2 lg:gap-12">
          <div aria-labelledby="terms-heading">
            <div className="flex items-center gap-3">
              <span className="h-0.5 w-9 shrink-0 bg-[#D6AE3C]" aria-hidden="true" />
              <p className="font-[family-name:var(--font-dm-sans)] text-[13px] font-bold uppercase tracking-[0.24em] text-[#D6AE3C]">
                Terms &amp; Conditions
              </p>
            </div>
            <h2
              id="terms-heading"
              className="mt-4 font-[family-name:var(--font-playfair)] text-[32px] font-semibold text-[#FBF8F1] md:text-[36px]"
            >
              The{" "}
              <em className="font-[family-name:var(--font-playfair)] font-medium italic text-[#E2BB4D]">
                fine print
              </em>
            </h2>
            <ol className="mt-8 list-none p-0">
              {termsAndConditions.map((term, index) => (
                <li
                  key={term.title}
                  className="grid grid-cols-[40px_1fr] gap-4 border-t border-white/[0.08] py-5"
                >
                  <span className="font-[family-name:var(--font-playfair)] text-[20px] font-semibold text-[#D6AE3C]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-[family-name:var(--font-dm-sans)] text-[16px] font-bold text-[#FBF8F1]">
                      {term.title}
                    </h3>
                    <p className="mt-1.5 font-[family-name:var(--font-dm-sans)] text-[15px] leading-[1.55] text-[#D9D3C6]">
                      {term.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div aria-labelledby="faq-heading">
            <div className="flex items-center gap-3">
              <span className="h-0.5 w-9 shrink-0 bg-[#D6AE3C]" aria-hidden="true" />
              <p className="font-[family-name:var(--font-dm-sans)] text-[13px] font-bold uppercase tracking-[0.24em] text-[#D6AE3C]">
                Questions
              </p>
            </div>
            <h2
              id="faq-heading"
              className="mt-4 font-[family-name:var(--font-playfair)] text-[32px] font-semibold text-[#FBF8F1] md:text-[36px]"
            >
              Frequently{" "}
              <em className="font-[family-name:var(--font-playfair)] font-medium italic text-[#E2BB4D]">
                asked
              </em>
            </h2>

            <div className="mt-8 flex flex-col gap-3">
              {travelSavingFaqs.map((faq) => {
                const isOpen = openFaq === faq.id;
                const panelId = `tsp-faq-${faq.id}`;
                const buttonId = `tsp-faq-btn-${faq.id}`;
                return (
                  <article
                    key={faq.id}
                    className={`overflow-hidden rounded-2xl border bg-[#141417] transition-colors ${
                      isOpen
                        ? "border-[rgba(214,174,60,0.55)]"
                        : "border-white/[0.08] hover:border-[rgba(214,174,60,0.35)]"
                    }`}
                  >
                    <h3 className="m-0">
                      <button
                        type="button"
                        id={buttonId}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                        className="flex w-full min-h-14 items-center justify-between gap-4 px-5 py-4 text-left"
                      >
                        <span className="font-[family-name:var(--font-dm-sans)] text-[16px] font-semibold text-[#FBF8F1]">
                          {faq.question}
                        </span>
                        <span
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D6AE3C] text-[#D6AE3C]"
                          aria-hidden="true"
                        >
                          {isOpen ? (
                            <Minus className="h-4 w-4" strokeWidth={2.5} />
                          ) : (
                            <Plus className="h-4 w-4" strokeWidth={2.5} />
                          )}
                        </span>
                      </button>
                    </h3>
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className={`grid motion-safe:transition-[grid-template-rows] motion-safe:duration-200 ${
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="px-5 pb-5 font-[family-name:var(--font-dm-sans)] text-[15px] leading-[1.65] text-[#D9D3C6]">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="bg-[#0B0B0C] px-6 pb-20 pt-8 md:px-12 md:pb-24 xl:px-24"
        aria-labelledby="enrol-cta-heading"
      >
        <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-8 rounded-[28px] border border-[rgba(214,174,60,0.3)] bg-[#121215] px-8 py-10 md:flex-row md:items-center md:px-14 md:py-12">
          <div className="max-w-xl">
            <h2
              id="enrol-cta-heading"
              className="font-[family-name:var(--font-playfair)] text-[32px] font-semibold leading-tight text-[#FBF8F1] md:text-[40px]"
            >
              Ready to start saving for{" "}
              <em className="font-[family-name:var(--font-playfair)] font-medium italic text-[#E2BB4D]">
                your next trip?
              </em>
            </h2>
            <p className="mt-3 font-[family-name:var(--font-dm-sans)] text-[16px] leading-[1.55] text-[#D9D3C6]">
              Call us to enrol — it takes a few minutes, and we&apos;ll set up your monthly plan.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/upcoming-trips"
              className="inline-flex h-14 items-center justify-center rounded-full border-[1.5px] border-[rgba(245,241,232,0.7)] px-7 font-[family-name:var(--font-dm-sans)] text-[15px] font-semibold text-[#FBF8F1] transition hover:border-[#D6AE3C] hover:text-[#D6AE3C]"
            >
              Browse upcoming trips
            </Link>
            <a
              href={PHONE_HREF}
              className="inline-flex h-14 items-center justify-center rounded-full bg-[#D6AE3C] px-7 font-[family-name:var(--font-dm-sans)] text-[15px] font-bold text-[#1A1405] transition hover:bg-[#E6BF4C]"
            >
              Call {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
