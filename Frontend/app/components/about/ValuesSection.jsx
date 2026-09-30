import { Check } from "lucide-react";
import { companyValues } from "../../data/aboutData";

export default function ValuesSection() {
  return (
    <section
      className="bg-[#0B0B0C] px-6 py-20 md:px-12 md:py-[120px] xl:px-24"
      aria-labelledby="values-heading"
    >
      <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[420px_1fr] lg:gap-16">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-0.5 w-9 shrink-0 bg-[#D6AE3C]" aria-hidden="true" />
            <p className="font-[family-name:var(--font-dm-sans)] text-[13px] font-bold uppercase tracking-[0.24em] text-[#D6AE3C]">
              Our Promise to You
            </p>
          </div>
          <h2
            id="values-heading"
            className="mt-4 font-[family-name:var(--font-playfair)] text-[36px] font-semibold leading-tight text-[#FBF8F1] md:text-[48px]"
          >
            Built on trust{" "}
            <em className="font-[family-name:var(--font-playfair)] font-medium italic text-[#E2BB4D]">
              &amp; transparency
            </em>
          </h2>
          <p className="mt-5 font-[family-name:var(--font-dm-sans)] text-[17px] leading-[1.65] text-[#D9D3C6]">
            These aren&apos;t marketing claims — they are the principles we operate by on every
            single trip.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {companyValues.map((value) => (
            <article
              key={value.title}
              className="rounded-[20px] border border-white/[0.08] bg-[#141417] p-[26px]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(214,174,60,0.16)]">
                <Check
                  className="h-5 w-5 text-[#D6AE3C]"
                  aria-hidden="true"
                  strokeWidth={2.75}
                />
              </div>
              <h3 className="mt-4 font-[family-name:var(--font-dm-sans)] text-[19px] font-bold text-[#FBF8F1]">
                {value.title}
              </h3>
              <p className="mt-2 font-[family-name:var(--font-dm-sans)] text-[15px] leading-[1.55] text-[#C9C3B6]">
                {value.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
