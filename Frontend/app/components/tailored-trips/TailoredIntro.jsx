const STEPS = [
  {
    number: "01",
    title: "Pick a destination",
    text: "Choose from the places below — or tell us somewhere else you've been dreaming of.",
  },
  {
    number: "02",
    title: "Share a few details",
    text: "Your dates, group size and travel style. It takes less than a minute.",
  },
  {
    number: "03",
    title: "We craft your itinerary",
    text: "Our team reaches out to shape your perfect women-only escape, step by step.",
  },
];

export default function TailoredIntro() {
  return (
    <section
      id="how"
      className="scroll-mt-28 bg-[#0B0B0C] px-5 py-10 pb-16 md:px-12 md:pt-10 xl:px-24 xl:pb-[88px]"
      aria-labelledby="tailored-how-heading"
    >
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-12">
        <div className="max-w-xl">
          <div className="flex items-center gap-3">
            <span className="h-0.5 w-9 shrink-0 bg-[#D6AE3C]" aria-hidden="true" />
            <p className="font-[family-name:var(--font-dm-sans)] text-[13px] font-bold uppercase tracking-[0.24em] text-[#D6AE3C]">
              Made for you
            </p>
          </div>
          <h2
            id="tailored-how-heading"
            className="mt-4 font-[family-name:var(--font-playfair)] text-[36px] font-semibold leading-tight text-[#FBF8F1] md:text-[48px]"
          >
            A trip designed{" "}
            <em className="font-[family-name:var(--font-playfair)] font-medium italic text-[#E2BB4D]">
              around you
            </em>
          </h2>
        </div>
        <p className="max-w-[420px] font-[family-name:var(--font-dm-sans)] text-[16px] leading-[1.55] text-[#C9C3B6]">
          Travelling with friends, family or a group of your own? We&apos;ll plan a private
          women-only escape on your dates.
        </p>
      </div>

      <ol className="mt-10 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-3">
        {STEPS.map((step) => (
          <li
            key={step.number}
            className="flex flex-col gap-3.5 rounded-[20px] border border-white/8 bg-[#141417] p-7"
          >
            <p className="font-[family-name:var(--font-playfair)] text-[40px] font-semibold leading-none text-[#D6AE3C]">
              {step.number}
            </p>
            <h3 className="font-[family-name:var(--font-dm-sans)] text-[20px] font-bold text-[#FBF8F1]">
              {step.title}
            </h3>
            <p className="font-[family-name:var(--font-dm-sans)] text-[15px] leading-[1.55] text-[#C9C3B6]">
              {step.text}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
