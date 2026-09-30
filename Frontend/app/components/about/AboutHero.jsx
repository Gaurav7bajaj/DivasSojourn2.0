import Image from "next/image";
import Link from "next/link";

const HERO_IMAGES = [
  {
    src: "/heroes/home/homeHero1.webp",
    alt: "Divas Sojourn travelers together on a scenic journey",
    className: "row-span-2",
  },
  {
    src: "/heroes/calendar/calendarHero1.webp",
    alt: "Women travelers in traditional attire on a cultural trip",
    className: "",
  },
  {
    src: "/heroes/calendar/calendarHero3.webp",
    alt: "Women travelers on a tropical island getaway",
    className: "",
  },
];

const STATS = [
  { value: "14,000+", label: "women travelled with us" },
  { value: "1,300+", label: "destinations explored" },
  { value: "2015", label: "where it all began" },
];

export default function AboutHero() {
  return (
    <section
      className="bg-[#0B0B0C] px-6 pb-20 pt-16 md:px-12 md:pb-[120px] md:pt-16 xl:px-24"
      aria-label="About Divas Sojourn"
    >
      <div className="mx-auto grid max-w-[1280px] items-center gap-10 lg:grid-cols-[1fr_620px] lg:gap-16">
        <div className="flex flex-col gap-[22px]">
          <nav
            aria-label="Breadcrumb"
            className="font-[family-name:var(--font-dm-sans)] text-[13px] text-[#C9C3B6]"
          >
            <Link href="/" className="transition hover:text-[#D6AE3C]">
              Home
            </Link>
            <span className="mx-2 text-white/30" aria-hidden="true">
              /
            </span>
            <span className="text-[#FBF8F1]">About Us</span>
          </nav>

          <div className="flex items-center gap-3">
            <span className="h-0.5 w-9 shrink-0 bg-[#D6AE3C]" aria-hidden="true" />
            <p className="font-[family-name:var(--font-dm-sans)] text-[13px] font-bold uppercase tracking-[0.24em] text-[#D6AE3C]">
              About Us
            </p>
          </div>

          <h1 className="font-[family-name:var(--font-playfair)] text-[clamp(2.75rem,5vw,4.4rem)] font-semibold leading-[1.08] text-[#FBF8F1]">
            Empowering women{" "}
            <em className="font-[family-name:var(--font-playfair)] font-medium italic text-[#E2BB4D]">
              to explore the world
            </em>
          </h1>

          <p className="max-w-xl font-[family-name:var(--font-dm-sans)] text-[19px] leading-[1.55] text-[#D9D3C6]">
            A global community of women travelers built on trust, safety, and the shared love of
            discovery. Since 2015, we&apos;ve been curating journeys that transform lives.
          </p>

          <div
            className="flex flex-wrap items-stretch gap-0 border-y border-white/[0.08] py-5 sm:border-y-0 sm:py-0"
            role="list"
            aria-label="Community stats"
          >
            {STATS.map((stat, index) => (
              <div
                key={stat.label}
                role="listitem"
                className={`flex min-w-[140px] flex-1 flex-col gap-1 px-0 py-3 sm:min-w-0 sm:px-5 sm:py-0 ${
                  index > 0 ? "sm:border-l sm:border-white/[0.08]" : "sm:pl-0"
                } ${index < STATS.length - 1 ? "border-b border-white/[0.08] sm:border-b-0" : ""}`}
              >
                <p className="font-[family-name:var(--font-playfair)] text-[38px] font-semibold leading-none text-[#D6AE3C]">
                  {stat.value}
                </p>
                <p className="font-[family-name:var(--font-dm-sans)] text-[13px] leading-snug text-[#C9C3B6]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
            <Link
              href="/upcoming-trips"
              className="inline-flex h-[54px] items-center justify-center gap-2 rounded-full bg-[#D6AE3C] px-7 font-[family-name:var(--font-dm-sans)] text-[15px] font-bold text-[#1A1405] transition hover:bg-[#E6BF4C]"
            >
              Explore upcoming trips →
            </Link>
            <a
              href="#founder"
              className="inline-flex h-[54px] items-center justify-center rounded-full border-[1.5px] border-[rgba(245,241,232,0.7)] px-7 font-[family-name:var(--font-dm-sans)] text-[15px] font-semibold text-[#FBF8F1] transition hover:border-[#D6AE3C] hover:text-[#D6AE3C]"
            >
              Meet our founder
            </a>
          </div>
        </div>

        <div className="grid h-auto grid-cols-2 grid-rows-2 gap-3.5 md:h-[580px] md:gap-3.5">
          {HERO_IMAGES.map((image) => (
            <div
              key={image.src}
              className={`group relative min-h-[180px] overflow-hidden rounded-[24px] ${image.className}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 1024px) 50vw, 310px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority={image.className.includes("row-span")}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
