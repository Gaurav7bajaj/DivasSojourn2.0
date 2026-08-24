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

  const minPercent = ((minValue - min) / (max - min)) * 100;
  const maxPercent = ((maxValue - min) / (max - min)) * 100;

  return (
    <div>
      <p className="text-sm font-black text-[#1A1A1A]">{label}</p>
      
      {/* Unified track container */}
      <div className="relative mt-4 h-6 flex items-center">
        {/* Background Track */}
        <div className="absolute left-0 right-0 h-1 rounded bg-[#E8E8E8]" />
        
        {/* Highlighted active segment (Gold) */}
        <div
          className="absolute h-1 bg-[#D4AF37] rounded"
          style={{
            left: `${minPercent}%`,
            right: `${100 - maxPercent}%`,
          }}
        />
        
        {/* Min Input Slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minValue}
          onChange={updateMin}
          className="absolute pointer-events-none appearance-none bg-transparent w-full h-1.5 focus:outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#D4AF37] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#D4AF37] [&::-moz-range-thumb]:cursor-pointer"
          aria-label={`${label} minimum`}
        />
        
        {/* Max Input Slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxValue}
          onChange={updateMax}
          className="absolute pointer-events-none appearance-none bg-transparent w-full h-1.5 focus:outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#D4AF37] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#D4AF37] [&::-moz-range-thumb]:cursor-pointer"
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
