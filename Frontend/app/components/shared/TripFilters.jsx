"use client";

import { inrToUsd } from "../../utils/formatPrice";
import RangeSlider from "../upcoming/RangeSlider";

const inrFull = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
const usdFull = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

export function formatMonthLabel(value) {
  const date = new Date(`${value}-01T00:00:00`);
  return date.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}

/**
 * Shared trip filters sidebar.
 * primaryGroup: "destination" | "country" | "region" (label + options driven by props)
 */
export default function TripFilters({
  primaryGroup = "destination",
  primaryValue = "all",
  primaryOptions = [],
  onPrimaryChange,
  month,
  duration,
  budget,
  months = [],
  monthCounts = {},
  totalTripCount = 0,
  onMonthChange,
  onDurationChange,
  onBudgetChange,
  onClear,
  className = "",
}) {
  const primaryLabel =
    primaryGroup === "country"
      ? "Country"
      : primaryGroup === "region"
        ? "Region"
        : "Destination";

  return (
    <aside
      className={`flex w-full flex-col gap-[26px] rounded-[20px] border border-white/8 bg-[#141417] p-6 ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-semibold text-[#FBF8F1]">
          Filters
        </h2>
        <button
          type="button"
          onClick={onClear}
          className="font-[family-name:var(--font-dm-sans)] text-[13px] font-bold text-[#D6AE3C] transition hover:text-[#E6BF4C]"
        >
          Clear all
        </button>
      </div>

      <div className="h-px bg-white/8" aria-hidden="true" />

      <div>
        <p className="font-[family-name:var(--font-dm-sans)] text-[12px] font-bold uppercase tracking-[0.16em] text-[#C9C3B6]">
          {primaryLabel}
        </p>
        <div className="mt-3 space-y-2" role="radiogroup" aria-label={primaryLabel}>
          {primaryOptions.map((option) => {
            const selected = primaryValue === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onPrimaryChange?.(option.value)}
                className={`flex h-11 w-full items-center gap-3 rounded-xl border px-3 text-left transition ${
                  selected
                    ? "border-[rgba(214,174,60,0.6)] bg-[rgba(214,174,60,0.12)]"
                    : "border-transparent hover:border-[#D6AE3C]"
                }`}
              >
                <span
                  className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 ${
                    selected ? "border-[#D6AE3C]" : "border-[rgba(245,241,232,0.4)]"
                  }`}
                  aria-hidden="true"
                >
                  {selected ? <span className="h-2 w-2 rounded-full bg-[#D6AE3C]" /> : null}
                </span>
                <span className="flex-1 font-[family-name:var(--font-dm-sans)] text-[15px] font-semibold text-[#FBF8F1]">
                  {option.label}
                </span>
                <span className="font-[family-name:var(--font-dm-sans)] text-[13px] text-[#C9C3B6]">
                  {option.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-white/8" aria-hidden="true" />

      <div>
        <p className="font-[family-name:var(--font-dm-sans)] text-[12px] font-bold uppercase tracking-[0.16em] text-[#C9C3B6]">
          Month
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            aria-pressed={month === "all"}
            onClick={() => onMonthChange?.("all")}
            className={`flex h-14 flex-col justify-center rounded-[14px] px-3 text-left transition ${
              month === "all"
                ? "bg-[#D6AE3C] text-[#1A1405]"
                : "border border-[rgba(245,241,232,0.2)] text-[#FBF8F1] hover:border-[#D6AE3C]"
            }`}
          >
            <span className="font-[family-name:var(--font-dm-sans)] text-[14px] font-bold">All months</span>
            <span
              className={`font-[family-name:var(--font-dm-sans)] text-[12px] ${
                month === "all" ? "opacity-80" : "text-[#C9C3B6]"
              }`}
            >
              {totalTripCount} trips
            </span>
          </button>
          {months.map((item) => {
            const selected = month === item.value;
            const count = monthCounts[item.value] || 0;
            return (
              <button
                key={item.value}
                type="button"
                aria-pressed={selected}
                onClick={() => onMonthChange?.(item.value)}
                className={`flex h-14 flex-col justify-center rounded-[14px] px-3 text-left transition ${
                  selected
                    ? "bg-[#D6AE3C] text-[#1A1405]"
                    : "border border-[rgba(245,241,232,0.2)] text-[#FBF8F1] hover:border-[#D6AE3C]"
                }`}
              >
                <span className="font-[family-name:var(--font-dm-sans)] text-[14px] font-bold">
                  {formatMonthLabel(item.value)}
                </span>
                <span
                  className={`font-[family-name:var(--font-dm-sans)] text-[12px] ${
                    selected ? "opacity-80" : "text-[#C9C3B6]"
                  }`}
                >
                  {count} {count === 1 ? "trip" : "trips"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-white/8" aria-hidden="true" />

      <RangeSlider
        variant="dark"
        label="Duration"
        min={2}
        max={16}
        step={1}
        value={duration}
        onChange={onDurationChange}
        formatValue={(value) => `${value} nights`}
        valueLabel={`${duration[0]} – ${duration[1]} nights`}
      />

      <div className="h-px bg-white/8" aria-hidden="true" />

      <RangeSlider
        variant="dark"
        label="Budget"
        min={0}
        max={1000000}
        step={1000}
        value={budget}
        onChange={onBudgetChange}
        formatValue={(value) => `₹${formatCompactInr(value)}`}
        valueLabel={`₹${formatCompactInr(budget[0])} – ₹${formatCompactInr(budget[1])}`}
        footer={
          <div className="mt-2 flex items-center justify-between font-[family-name:var(--font-dm-sans)] text-[12px] text-[#C9C3B6]">
            <span>
              ₹{inrFull.format(budget[0])} · ${usdFull.format(inrToUsd(budget[0]))}
            </span>
            <span>
              ₹{inrFull.format(budget[1])} · ${usdFull.format(inrToUsd(budget[1]))}
            </span>
          </div>
        }
      />
    </aside>
  );
}

function formatCompactInr(value) {
  if (value >= 100000) {
    const lakhs = value / 100000;
    return `${lakhs % 1 === 0 ? lakhs : lakhs.toFixed(1)}L`;
  }
  if (value >= 1000) return `${Math.round(value / 1000)}K`;
  return String(value);
}
