export default function RangeSlider({ label, min, max, step = 1, value, onChange, formatValue }) {
  const [minValue, maxValue] = value;

  const updateMin = (event) => {
    const nextMin = Math.min(Number(event.target.value), maxValue);
    onChange([nextMin, maxValue]);
  };

  const updateMax = (event) => {
    const nextMax = Math.max(Number(event.target.value), minValue);
    onChange([minValue, nextMax]);
  };

  return (
    <div>
      <p className="text-sm font-black text-[#1A1A1A]">{label}</p>
      <div className="mt-4 space-y-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minValue}
          onChange={updateMin}
          className="w-full accent-[#D4AF37]"
          aria-label={`${label} minimum`}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxValue}
          onChange={updateMax}
          className="w-full accent-[#D4AF37]"
          aria-label={`${label} maximum`}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs font-bold text-[#555555]">
        <span>{formatValue(minValue)}</span>
        <span>{formatValue(maxValue)}</span>
      </div>
    </div>
  );
}
