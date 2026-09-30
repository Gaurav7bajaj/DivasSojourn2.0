import Image from "next/image";

const reasons = [
  {
    number: "01",
    title: "No third-party mess",
    description:
      "100% in-house operations on every trip. No middlemen, so no shady claims.",
  },
  {
    number: "02",
    title: "Transparency & security",
    description:
      "Our ground team monitors every trip in real time, with routes and weather kept up to date.",
  },
  {
    number: "03",
    title: "Co-traveller filtering",
    description:
      "A multi-step screening brings like-minded women together — our key to fuss-free trips.",
  },
  {
    number: "04",
    title: "One-stop, hassle-free",
    description:
      "Comfortable stays, trained drivers, hospitable staff and friendly trip leaders, all taken care of.",
  },
];

export default function WhyDivasSection() {
  return (
    <section
      className="bg-[#0B0B0C] px-5 py-16 md:px-12 md:py-24 xl:px-24"
      aria-labelledby="why-divas-heading"
    >
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[440px_minmax(0,1fr)] lg:gap-16">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-0.5 w-9 shrink-0 bg-[#D6AE3C]" aria-hidden="true" />
            <p className="font-[family-name:var(--font-dm-sans)] text-[13px] font-bold uppercase tracking-[0.24em] text-[#D6AE3C]">
              Why choose us
            </p>
          </div>
          <h2
            id="why-divas-heading"
            className="mt-4 font-[family-name:var(--font-playfair)] text-[36px] font-semibold leading-tight text-[#FBF8F1] md:text-[48px]"
          >
            Why{" "}
            <em className="font-[family-name:var(--font-playfair)] font-medium italic text-[#E2BB4D]">
              Divas Sojourn?
            </em>
          </h2>
          <p className="mt-4 font-[family-name:var(--font-dm-sans)] text-[16px] leading-[1.55] text-[#D9D3C6] md:text-[17px]">
            Every journey is planned with trusted operations, thoughtful community building and
            reliable on-ground care — so you can travel freely, together.
          </p>
          <div className="relative mt-8 h-[240px] overflow-hidden rounded-[20px]">
            <Image
              src="/heroes/home/homeHero2.webp"
              alt="Women travelers together on a Divas Sojourn journey"
              fill
              sizes="(max-width: 1024px) 100vw, 440px"
              className="object-cover"
              loading="lazy"
            />
          </div>
        </div>

        <ol className="m-0 grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2">
          {reasons.map((reason) => (
            <li
              key={reason.number}
              className="flex flex-col gap-3 rounded-[20px] border border-white/8 bg-[#141417] p-7"
            >
              <p className="font-[family-name:var(--font-playfair)] text-[36px] font-semibold leading-none text-[#D6AE3C]">
                {reason.number}
              </p>
              <h3 className="font-[family-name:var(--font-dm-sans)] text-[19px] font-bold text-[#FBF8F1]">
                {reason.title}
              </h3>
              <p className="font-[family-name:var(--font-dm-sans)] text-[15px] leading-[1.55] text-[#C9C3B6]">
                {reason.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
