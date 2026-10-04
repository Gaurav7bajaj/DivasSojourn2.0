import Image from "next/image";
import Link from "next/link";

export default function AboutCTA() {
  return (
    <section
      className="bg-[#0B0B0C] px-6 py-20 md:px-12 md:py-[120px] xl:px-24"
      aria-labelledby="about-cta-heading"
    >
      <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-[28px] border border-[rgba(214,174,60,0.2)] bg-[#121215] md:h-[420px]">
        <div className="relative h-[240px] w-full md:absolute md:inset-y-0 md:right-0 md:h-auto md:w-[60%]">
          <Image
            src="/heroes/home/upcomingCommunityTrips-v2.jpg"
            alt="Women travelers sitting together outdoors on a grassy hillside"
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-cover object-center"
            loading="lazy"
          />
        </div>

        <div
          className="pointer-events-none absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(90deg, #121215 0%, #121215 40%, rgba(18,18,21,.55) 55%, transparent 75%)",
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[240px] bg-gradient-to-b from-black/25 to-[#121215] md:hidden"
          aria-hidden="true"
        />

        <div className="relative z-[1] flex flex-col justify-center px-6 py-10 md:h-full md:max-w-[580px] md:px-16 md:py-0">
          <div className="flex items-center gap-3">
            <span className="h-0.5 w-9 shrink-0 bg-[#D6AE3C]" aria-hidden="true" />
            <p className="font-[family-name:var(--font-dm-sans)] text-[13px] font-bold uppercase tracking-[0.24em] text-[#D6AE3C]">
              Your Journey Awaits
            </p>
          </div>
          <h2
            id="about-cta-heading"
            className="mt-4 font-[family-name:var(--font-playfair)] text-[32px] font-semibold leading-tight text-[#FBF8F1] md:text-[44px]"
          >
            Ready to begin{" "}
            <em className="font-[family-name:var(--font-playfair)] font-medium italic text-[#E2BB4D]">
              your adventure?
            </em>
          </h2>
          <p className="mt-4 max-w-lg font-[family-name:var(--font-dm-sans)] text-[16px] leading-[1.55] text-[#D9D3C6] md:text-[17px]">
            Join thousands of women who have discovered the joy of traveling together. Your next
            unforgettable memory is just a trip away.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/upcoming-trips"
              className="inline-flex h-[54px] items-center justify-center rounded-full bg-[#D6AE3C] px-7 font-[family-name:var(--font-dm-sans)] text-[15px] font-bold text-[#1A1405] transition hover:bg-[#E6BF4C]"
            >
              Explore upcoming trips →
            </Link>
            <a
              href="#reach-out"
              className="inline-flex h-[54px] items-center justify-center rounded-full border-[1.5px] border-[rgba(245,241,232,0.7)] px-7 font-[family-name:var(--font-dm-sans)] text-[15px] font-semibold text-[#FBF8F1] transition hover:border-[#D6AE3C] hover:text-[#D6AE3C]"
            >
              Contact us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
