import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3, MapPin } from "lucide-react";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
});

export default function UpcomingTripCard({ trip }) {
  const href = trip.destination === "India" ? `/india-trips/${trip.slug}` : `/international-trips/${trip.slug}`;
  const dateText = `${dateFormatter.format(new Date(trip.startDate))}, ${dateFormatter.format(
    new Date(trip.endDate),
  )}`;

  return (
    <article className="group overflow-hidden rounded-2xl border border-[#D4AF37]/25 bg-[#F9F9F9] shadow-[0_2px_10px_rgba(0,0,0,0.14)] transition duration-300 hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-[0_14px_28px_rgba(212,175,55,0.16)]">
      <Link
        href={href}
        aria-label={`View details for ${trip.title}`}
        className="grid min-h-40 grid-cols-[42%_58%]"
      >
        <div className="relative min-h-40 overflow-hidden">
          <Image
            src={trip.image}
            alt={`${trip.title} upcoming women travel package`}
            fill
            sizes="(max-width: 768px) 42vw, 22vw"
            className="object-cover transition duration-500 group-hover:scale-105 group-hover:brightness-110"
          />
          <span className="absolute left-3 top-3 rounded-full bg-[#D4AF37] px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#1A1A1A]">
            {trip.destination}
          </span>
        </div>

        <div className="flex min-w-0 flex-col p-4">
          <h3 className="line-clamp-2 text-sm font-black leading-5 text-[#1A1A1A]">
            {trip.title}
          </h3>

          <div className="mt-3 space-y-2 text-xs font-semibold text-[#666666]">
            <p className="flex items-start gap-2">
              <Clock3 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#D4AF37]" aria-hidden="true" />
              {trip.duration.nights}N/{trip.duration.days}D
            </p>
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#D4AF37]" aria-hidden="true" />
              <span className="line-clamp-1">{trip.departure}</span>
            </p>
            <p className="flex items-start gap-2">
              <CalendarDays className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#D4AF37]" aria-hidden="true" />
              <span className="line-clamp-1">
                {dateText}
                <span className="ml-2 font-black text-[#D4AF37]">+{trip.batches} batches</span>
              </span>
            </p>
          </div>

          <div className="mt-auto flex items-end justify-between gap-3 pt-4">
            <div className="min-w-0 rounded-full bg-[#E8E8E8] px-3 py-1.5">
              {trip.originalPrice ? (
                <p className="text-[10px] font-bold text-[#B54848] line-through">
                  Rs. {currencyFormatter.format(trip.originalPrice)}
                </p>
              ) : null}
              <p className="text-xs font-black text-[#1A1A1A]">
                Rs. {currencyFormatter.format(trip.currentPrice)}
                <span className="ml-1 text-[10px] font-semibold text-[#777777]">Onwards</span>
              </p>
            </div>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1A1A1A] text-white transition group-hover:bg-[#D4AF37] group-hover:text-[#1A1A1A]">
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
