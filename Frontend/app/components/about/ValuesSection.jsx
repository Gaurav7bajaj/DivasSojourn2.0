import { Check } from "lucide-react";
import { companyValues } from "../../data/aboutData";

export default function ValuesSection() {
  return (
    <section
      className="bg-[#1A1A1A] px-4 py-20"
      aria-labelledby="values-heading"
    >
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
            Our Promise to You
          </p>
          <h2
            id="values-heading"
            className="mt-3 text-3xl font-black text-white md:text-5xl"
          >
            Built on Trust &amp; Transparency
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-white/60">
            These aren&apos;t marketing claims — they are the principles we
            operate by on every single trip. Here&apos;s what you can always
            expect from us.
          </p>
        </div>

        <div className="mt-12 space-y-8">
          {companyValues.map((value) => (
            <div key={value.title} className="flex items-start gap-4">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/15">
                <Check
                  className="h-4 w-4 text-[#D4AF37]"
                  aria-hidden="true"
                  strokeWidth={3}
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{value.title}</h3>
                <p className="mt-1 leading-7 text-white/60">
                  {value.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
