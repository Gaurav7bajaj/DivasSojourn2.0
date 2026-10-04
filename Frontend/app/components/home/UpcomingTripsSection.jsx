import Image from "next/image";
import Link from "next/link";

export default function UpcomingTripsSection() {
  return (
    <section
      className="bg-[#0B0B0C] px-5 py-16 md:px-12 md:py-24 xl:px-24"
      aria-labelledby="community-trips-heading"
    >
      <div className="relative overflow-hidden rounded-[28px] border border-[rgba(214,174,60,0.2)] bg-[#121215] md:h-[500px]">
        {/* Image — top on mobile, right ~64% on desktop */}
        <div className="relative h-[240px] w-full md:absolute md:inset-y-0 md:right-0 md:h-auto md:w-[64%]">
          <Image
            src="/heroes/home/upcomingCommunityTrips-v2.jpg"
            alt="Women travelers sitting together outdoors on a grassy hillside"
            fill
            sizes="(max-width: 768px) 100vw, 64vw"
            className="object-cover object-center"
            loading="lazy"
          />
        </div>

        <div
          className="pointer-events-none absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(90deg, #121215 0%, #121215 36%, rgba(18,18,21,.6) 50%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[240px] bg-gradient-to-b from-black/30 to-[#121215] md:hidden"
          aria-hidden="true"
        />

        <div className="relative z-[1] flex flex-col justify-center px-6 py-10 md:h-full md:max-w-[560px] md:px-16 md:py-0">
          <div className="flex items-center gap-3">
            <span className="h-0.5 w-9 shrink-0 bg-[#D6AE3C]" aria-hidden="true" />
            <p className="font-[family-name:var(--font-dm-sans)] text-[13px] font-bold uppercase tracking-[0.24em] text-[#D6AE3C]">
              Travel together
            </p>
          </div>
          <h2
            id="community-trips-heading"
            className="mt-4 font-[family-name:var(--font-playfair)] text-[32px] font-semibold leading-tight text-[#FBF8F1] md:text-[52px]"
          >
            Join our next women-only{" "}
            <em className="font-[family-name:var(--font-playfair)] font-medium italic text-[#E2BB4D]">
              community adventure
            </em>
          </h2>
          <p className="mt-4 max-w-lg font-[family-name:var(--font-dm-sans)] text-[16px] leading-[1.55] text-[#D9D3C6] md:text-[17px]">
            Small groups, trip leaders who care, and friendships that last long after you&apos;re
            home.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/upcoming-trips"
              className="inline-flex h-[54px] items-center justify-center rounded-full bg-[#D6AE3C] px-7 font-[family-name:var(--font-dm-sans)] text-[15px] font-bold text-[#1A1405] transition hover:bg-[#E6BF4C]"
            >
              See upcoming trips →
            </Link>
            <Link
              href="/calendar"
              className="inline-flex h-[54px] items-center justify-center rounded-full border-[1.5px] border-[rgba(245,241,232,0.7)] px-7 font-[family-name:var(--font-dm-sans)] text-[15px] font-semibold text-white transition hover:bg-white/12"
            >
              View calendar
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
