"use client";

/**
 * Dual-handle range slider.
 * variant="light" keeps the existing India/International look;
 * variant="dark" matches the Upcoming Trips redesign.
 */
export default function RangeSlider({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  formatValue,
  valueLabel,
  footer,
  variant = "light",
}) {
  const [minValue, maxValue] = value;
  const isDark = variant === "dark";

  const updateMin = (event) => {
    const nextMin = Math.min(Number(event.target.value), maxValue);
    onChange([nextMin, maxValue]);
  };

  const updateMax = (event) => {
    const nextMax = Math.max(Number(event.target.value), minValue);
    onChange([minValue, nextMax]);
  };

  const minPercent = ((minValue - min) / (max - min)) * 100;
  const maxPercent = ((maxValue - min) / (max - min)) * 100;

  const thumbClass = isDark
    ? "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-[#D6AE3C] [&::-webkit-slider-thumb]:bg-[#FBF8F1] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-[#D6AE3C] [&::-moz-range-thumb]:bg-[#FBF8F1] [&::-moz-range-thumb]:cursor-pointer"
    : "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#D4AF37] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#D4AF37] [&::-moz-range-thumb]:cursor-pointer";

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p
          className={
            isDark
              ? "font-[family-name:var(--font-dm-sans)] text-[12px] font-bold uppercase tracking-[0.16em] text-[#C9C3B6]"
              : "text-sm font-black text-[#1A1A1A]"
          }
        >
          {label}
        </p>
        {valueLabel ? (
          <p className="font-[family-name:var(--font-dm-sans)] text-[14px] font-semibold text-[#FBF8F1]">
            {valueLabel}
          </p>
        ) : null}
      </div>

      <div className="relative mt-4 flex h-6 items-center">
        <div
          className={`absolute left-0 right-0 h-1 rounded ${
            isDark ? "bg-[rgba(245,241,232,0.15)]" : "bg-[#E8E8E8]"
          }`}
        />
        <div
          className="absolute h-1 rounded bg-[#D6AE3C]"
          style={{
            left: `${minPercent}%`,
            right: `${100 - maxPercent}%`,
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minValue}
          onChange={updateMin}
          className={`pointer-events-none absolute h-1.5 w-full appearance-none bg-transparent focus:outline-none ${thumbClass}`}
          aria-label={`${label} minimum`}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxValue}
          onChange={updateMax}
          className={`pointer-events-none absolute h-1.5 w-full appearance-none bg-transparent focus:outline-none ${thumbClass}`}
          aria-label={`${label} maximum`}
        />
      </div>

      {footer ? (
        footer
      ) : (
        <div
          className={`mt-2 flex items-center justify-between text-xs font-bold ${
            isDark ? "text-[#C9C3B6]" : "text-[#555555]"
          }`}
        >
          <span>{formatValue(minValue)}</span>
          <span>{formatValue(maxValue)}</span>
        </div>
      )}
    </div>
  );
}
