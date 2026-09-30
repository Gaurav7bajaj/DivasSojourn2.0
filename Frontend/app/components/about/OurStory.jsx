import Image from "next/image";

export default function OurStory() {
  return (
    <section
      className="bg-[#0B0B0C] px-6 py-20 md:px-12 md:py-[120px] xl:px-24"
      aria-labelledby="our-story-heading"
    >
      <div className="mx-auto grid max-w-[1280px] items-center gap-10 lg:grid-cols-[560px_1fr] lg:gap-[72px]">
        <div className="relative h-[360px] w-full overflow-hidden rounded-[28px] md:h-[480px]">
          <Image
            src="/heroes/calendar/calendarHero4.webp"
            alt="Women travelers exploring together on a Divas Sojourn trip"
            fill
            sizes="(max-width: 1024px) 100vw, 560px"
            className="object-cover"
            loading="lazy"
          />
          <div className="absolute bottom-5 left-5 max-w-[240px] rounded-2xl border border-[rgba(214,174,60,0.45)] bg-[rgba(12,12,14,0.86)] px-5 py-4 backdrop-blur-sm">
            <p className="font-[family-name:var(--font-playfair)] text-[22px] font-semibold text-[#D6AE3C]">
              Since 2015
            </p>
            <p className="mt-1 font-[family-name:var(--font-dm-sans)] text-[13px] leading-snug text-[#D9D3C6]">
              One woman&apos;s solo journey, now a community.
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3">
            <span className="h-0.5 w-9 shrink-0 bg-[#D6AE3C]" aria-hidden="true" />
            <p className="font-[family-name:var(--font-dm-sans)] text-[13px] font-bold uppercase tracking-[0.24em] text-[#D6AE3C]">
              Our Story
            </p>
          </div>
          <h2
            id="our-story-heading"
            className="mt-4 font-[family-name:var(--font-playfair)] text-[36px] font-semibold leading-tight text-[#FBF8F1] md:text-[48px]"
          >
            From a dream{" "}
            <em className="font-[family-name:var(--font-playfair)] font-medium italic text-[#E2BB4D]">
              to a movement
            </em>
          </h2>
          <div className="mt-6 space-y-5 font-[family-name:var(--font-dm-sans)] text-[17px] leading-[1.65] text-[#D9D3C6]">
            <p>
              It all started in 2015, when a young engineer named Pooja Malhotra decided to
              challenge the societal norms that told her what a woman&apos;s life should look like.
              She left her cushy corporate job, bought a one-way ticket, and embarked on a solo
              journey across continents.
            </p>
            <p>
              Along the way, she met countless women who shared the same yearning — to travel
              freely, explore fearlessly, and experience the world without compromise. What began
              as a personal odyssey quickly became something much bigger: a community.
            </p>
            <p>
              Today, <strong className="font-bold text-[#FBF8F1]">Divas Sojourn</strong> is a
              global women&apos;s travel community that has taken{" "}
              <strong className="font-bold text-[#D6AE3C]">14,000+ women</strong> across{" "}
              <strong className="font-bold text-[#D6AE3C]">1,300+ destinations</strong> worldwide.
              Every trip is planned in-house with zero third-party involvement, ensuring safety,
              quality, and the kind of authentic experiences that money alone can&apos;t buy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
