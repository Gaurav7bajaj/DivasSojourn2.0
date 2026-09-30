import Link from "next/link";
import { CalendarDays } from "lucide-react";

export default function UpcomingTripsHeader() {
  return (
    <header className="bg-[#0B0B0C] px-5 pb-8 pt-10 md:px-12 md:pb-8 md:pt-[52px] xl:px-24">
      <div className="flex items-end justify-between gap-8">
        <div className="flex max-w-[560px] flex-col gap-4">
          <nav
            className="font-[family-name:var(--font-dm-sans)] text-[14px] text-[#C9C3B6]"
            aria-label="Breadcrumb"
          >
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="transition hover:text-[#D6AE3C]">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="font-semibold text-[#D6AE3C]">Upcoming Trips</li>
            </ol>
          </nav>

          <div className="mt-2 flex items-center gap-3">
            <span className="h-0.5 w-9 shrink-0 bg-[#D6AE3C]" aria-hidden="true" />
            <p className="font-[family-name:var(--font-dm-sans)] text-[13px] font-bold uppercase tracking-[0.24em] text-[#D6AE3C]">
              Departing soon
            </p>
          </div>

          <h1 className="font-[family-name:var(--font-playfair)] text-[42px] font-semibold leading-[1.02] tracking-[-0.015em] text-[#FBF8F1] md:text-[clamp(2.75rem,5vw,4.25rem)]">
            Upcoming{" "}
            <em className="font-[family-name:var(--font-playfair)] text-[length:inherit] font-medium italic text-[#E2BB4D]">
              trips
            </em>
          </h1>

          <p className="hidden max-w-[560px] font-[family-name:var(--font-dm-sans)] text-[18px] leading-[1.55] text-[#D9D3C6] md:block">
            Women only group journeys, across India and the world. Pick a month, find your people.
          </p>
        </div>

        <Link
          href="/calendar"
          className="hidden h-[50px] shrink-0 items-center gap-2 rounded-full border-[1.5px] border-[rgba(245,241,232,0.6)] px-6 font-[family-name:var(--font-dm-sans)] text-[14px] font-semibold text-[#FBF8F1] transition hover:border-[#D6AE3C] hover:bg-white/10 md:inline-flex"
        >
          <CalendarDays className="h-4 w-4 text-[#D6AE3C]" aria-hidden="true" />
          Calendar view
        </Link>
      </div>
    </header>
  );
}
