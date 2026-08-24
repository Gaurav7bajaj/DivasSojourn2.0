import RangeSlider from "./RangeSlider";
import { ChevronRight } from "lucide-react";
import { formatDualPrice } from "../../utils/formatPrice";

export default function FilterSidebar({
  months,
  draftFilters,
  onDestinationChange,
  onDurationChange,
  onBudgetChange,
  onMonthChange,
  onApply,
  onClear,
  destinationOptions = ["India", "International"],
}) {
  return (
    <aside className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-2xl border border-[#D4AF37]/30 bg-[#F9F9F9] text-[#1A1A1A] shadow-xl">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#D4AF37]/20 bg-[#F9F9F9] px-5 py-4">
        <h2 className="text-lg font-black">Filters</h2>
        <button
          type="button"
          onClick={onClear}
          className="text-sm font-bold text-[#D4AF37] transition hover:underline"
        >
          Clear
        </button>
      </div>

      <div className="space-y-7 px-5 py-5">
        {destinationOptions.length > 1 && (
          <FilterGroup title="Destination">
            {destinationOptions.map((destination) => (
              <DestinationRow
                key={destination}
                label={destination}
                checked={draftFilters.destinations.includes(destination)}
                onChange={() => onDestinationChange(destination)}
              />
            ))}
          </FilterGroup>
        )}

        <RangeSlider
          label="Duration (in nights)"
          min={2}
          max={16}
          value={draftFilters.duration}
          onChange={onDurationChange}
          formatValue={(value) => `${value}N`}
        />

        <RangeSlider
          label="Budget (per person)"
          min={8000}
          max={400000}
          step={1000}
          value={draftFilters.budget}
          onChange={onBudgetChange}
          formatValue={(value) => formatDualPrice(value)}
        />

        <FilterGroup title="Month">
          <div className="space-y-2">
            {months.map((month) => (
              <CheckboxRow
                key={month.value}
                label={month.label}
                checked={draftFilters.months.includes(month.value)}
                onChange={() => onMonthChange(month.value)}
              />
            ))}
          </div>
        </FilterGroup>

        <div className="sticky bottom-0 -mx-5 grid grid-cols-[1fr_1.2fr] gap-3 border-t border-[#D4AF37]/20 bg-[#F9F9F9] px-5 py-4">
          <button
            type="button"
            onClick={onApply}
            className="order-2 rounded-lg bg-[#D4AF37] px-5 py-3 text-sm font-black text-[#1A1A1A] transition-all duration-300 hover:bg-[#E8C547] hover:shadow-[0_8px_20px_rgba(212,175,55,0.3)]"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={onClear}
            className="order-1 rounded-lg px-2 py-3 text-sm font-black text-[#D4AF37] transition hover:bg-[#F5E6D3] hover:underline"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </aside>
  );
}

function FilterGroup({ title, children }) {
  return (
    <details open className="group">
      <summary className="cursor-pointer list-none text-sm font-black text-[#1A1A1A]">
        <span className="flex items-center justify-between">
          {title}
          <span className="text-[#D4AF37] transition group-open:rotate-180">^</span>
        </span>
      </summary>
      <div className="mt-3 space-y-2">{children}</div>
    </details>
  );
}

function CheckboxRow({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-[#333333] transition hover:bg-[#F5E6D3]">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-[#D4AF37] accent-[#D4AF37]"
      />
      {label}
    </label>
  );
}

function DestinationRow({ label, checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`flex w-full cursor-pointer items-center justify-between py-2 text-sm font-semibold transition-all ${
        checked ? "text-[#D4AF37]" : "text-neutral-500 hover:text-[#D4AF37]"
      }`}
    >
      <span>{label}</span>
      <ChevronRight className={`h-4 w-4 text-neutral-400 transition-all ${checked ? "text-[#D4AF37]" : ""}`} />
    </button>
  );
}
