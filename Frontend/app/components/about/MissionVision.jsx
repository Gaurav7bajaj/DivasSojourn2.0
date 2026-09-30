import { missionVision } from "../../data/aboutData";

const cards = [
  {
    label: "Our Mission",
    headline: (
      <>
        Every woman deserves to see the world{" "}
        <em className="font-[family-name:var(--font-playfair)] font-medium italic text-[#E2BB4D]">
          on her own terms.
        </em>
      </>
    ),
    text: missionVision.mission.text,
  },
  {
    label: "Our Vision",
    headline: (
      <>
        The world&apos;s largest and most trusted{" "}
        <em className="font-[family-name:var(--font-playfair)] font-medium italic text-[#E2BB4D]">
          women&apos;s travel community.
        </em>
      </>
    ),
    text: missionVision.vision.text,
  },
];

export default function MissionVision() {
  return (
    <section
      className="bg-[#0B0B0C] px-6 py-20 md:px-12 md:py-[120px] xl:px-24"
      aria-labelledby="mission-vision-heading"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="flex items-center gap-3">
          <span className="h-0.5 w-9 shrink-0 bg-[#D6AE3C]" aria-hidden="true" />
          <p className="font-[family-name:var(--font-dm-sans)] text-[13px] font-bold uppercase tracking-[0.24em] text-[#D6AE3C]">
            What Drives Us
          </p>
        </div>
        <h2
          id="mission-vision-heading"
          className="mt-4 font-[family-name:var(--font-playfair)] text-[36px] font-semibold leading-tight text-[#FBF8F1] md:text-[48px]"
        >
          Mission{" "}
          <em className="font-[family-name:var(--font-playfair)] font-medium italic text-[#E2BB4D]">
            &amp; vision
          </em>
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {cards.map((card) => (
            <article
              key={card.label}
              className="rounded-[24px] border border-black bg-[#141417] p-8 transition-colors duration-300 hover:border-[#D6AE3C] md:p-10"
            >
              <p className="font-[family-name:var(--font-dm-sans)] text-[12px] font-bold uppercase tracking-[0.2em] text-[#D6AE3C]">
                {card.label}
              </p>
              <h3 className="mt-4 font-[family-name:var(--font-playfair)] text-[26px] font-semibold leading-snug text-[#FBF8F1] md:text-[30px]">
                {card.headline}
              </h3>
              <p className="mt-5 font-[family-name:var(--font-dm-sans)] text-[16px] leading-[1.65] text-[#D9D3C6]">
                {card.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
