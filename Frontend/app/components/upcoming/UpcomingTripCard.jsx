import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3, MapPin } from "lucide-react";
import { formatDualPrice, inrToUsd } from "../../utils/formatPrice";

const inrFormatter = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
const usdFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const shortDateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
});

function formatRoute(trip) {
  const pickup = (trip.pickupLocation || "").trim();
  const drop = (trip.dropLocation || "").trim();
  if (pickup && drop) {
    if (pickup.toLowerCase() === drop.toLowerCase()) {
      return `${pickup} (round trip)`;
    }
    return `${pickup} → ${drop}`;
  }
  return trip.departure || "Route to be announced";
}

export default function UpcomingTripCard({
  trip,
  priority = false,
  variant = "light",
  badgeLabel,
}) {
  const href =
    trip.destination === "India" ? `/india-trips/${trip.slug}` : `/international-trips/${trip.slug}`;

  if (variant === "dark") {
    return (
      <DarkCard
        trip={trip}
        href={href}
        priority={priority}
        badgeLabel={badgeLabel}
      />
    );
  }

  const dateText = `${shortDateFormatter.format(new Date(trip.startDate))}, ${shortDateFormatter.format(
    new Date(trip.endDate),
  )}`;

  return (
    <article className="group overflow-hidden rounded-2xl border border-[#D4AF37]/25 bg-[#F9F9F9] shadow-[0_2px_10px_rgba(0,0,0,0.14)] transition duration-300 hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-[0_14px_28px_rgba(212,175,55,0.16)]">
      <Link
        href={href}
        aria-label={`View details for ${trip.title}`}
        className="grid min-h-40 grid-cols-[42%_58%]"
      >
        <div className="relative min-h-40 overflow-hidden bg-[#E8E8E8]">
          {trip.image ? (
            <Image
              src={trip.image}
              alt={`${trip.title} upcoming women travel package`}
              fill
              sizes="(max-width: 768px) 42vw, 22vw"
              className="object-cover transition duration-500 group-hover:scale-105 group-hover:brightness-110"
            />
          ) : null}
          <span className="absolute left-3 top-3 rounded-full bg-[#D4AF37] px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[#1A1A1A]">
            {trip.destination}
          </span>
        </div>

        <div className="flex min-w-0 flex-col p-4">
          <h3 className="line-clamp-2 text-sm font-black leading-5 text-[#1A1A1A]">{trip.title}</h3>

          <div className="mt-3 space-y-2 text-xs font-semibold text-[#666666]">
            <p className="flex items-start gap-2">
              <Clock3 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#D4AF37]" aria-hidden="true" />
              {trip.duration.nights}N/{trip.duration.days}D
            </p>
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#D4AF37]" aria-hidden="true" />
              <span className="line-clamp-1">{formatRoute(trip)}</span>
            </p>
            <p className="flex items-start gap-2">
              <CalendarDays className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#D4AF37]" aria-hidden="true" />
              <span className="line-clamp-1">
                {dateText}
                {trip.batches > 1 ? (
                  <span className="ml-2 font-black text-[#D4AF37]">+{trip.batches} batches</span>
                ) : null}
              </span>
            </p>
          </div>

          <div className="mt-auto flex items-end justify-between gap-3 pt-4">
            <div className="min-w-0 rounded-full bg-[#E8E8E8] px-3 py-1.5">
              {!trip.currentPrice ? (
                <p className="text-xs font-black text-[#1A1A1A]">Coming soon</p>
              ) : (
                <>
                  {trip.originalPrice ? (
                    <p className="text-[10px] font-bold text-[#B54848] line-through">
                      {formatDualPrice(trip.originalPrice)}
                    </p>
                  ) : null}
                  <p className="text-xs font-black text-[#1A1A1A]">
                    {formatDualPrice(trip.currentPrice)}
                    <span className="ml-1 text-[10px] font-semibold text-[#777777]">Onwards</span>
                  </p>
                </>
              )}
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

function DarkCard({ trip, href, priority, badgeLabel }) {
  const primaryDate = `${dateFormatter.format(new Date(trip.startDate))} – ${dateFormatter.format(
    new Date(trip.endDate),
  )}`;
  const extraCount = Math.max(0, (trip.extraDates?.length || 0) + Math.max(0, trip.batches - 1));
  const savings =
    trip.originalPrice && trip.originalPrice > trip.currentPrice
      ? trip.originalPrice - trip.currentPrice
      : 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-white/8 bg-[#141417] transition duration-500 hover:-translate-y-1 hover:border-[rgba(214,174,60,0.6)]">
      <Link href={href} aria-label={`View details for ${trip.title}`} className="flex h-full flex-col">
        <div className="relative h-[200px] overflow-hidden md:h-[260px]">
          {trip.image ? (
            <Image
              src={trip.image}
              alt={trip.title}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              priority={priority}
              loading={priority ? "eager" : "lazy"}
              className="object-cover transition duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-[#2A2A2A]" />
          )}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(0deg, rgba(8,8,10,.55), transparent 50%)" }}
            aria-hidden="true"
          />

          <span className="absolute left-3 top-3 rounded-full border border-[rgba(214,174,60,0.5)] bg-[rgba(8,8,10,0.72)] px-3 py-1 font-[family-name:var(--font-dm-sans)] text-[11px] font-bold uppercase tracking-[0.14em] text-[#D6AE3C]">
            {badgeLabel || trip.destination}
          </span>

          {savings > 0 ? (
            <span className="absolute right-3 top-3 rounded-full bg-[#D6AE3C] px-3 py-1 font-[family-name:var(--font-dm-sans)] text-[12px] font-bold text-[#1A1405]">
              Save ₹{inrFormatter.format(savings)}
            </span>
          ) : null}

          <p className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 font-[family-name:var(--font-dm-sans)] text-[13px] font-bold text-white">
            <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
            {trip.duration.nights}N / {trip.duration.days}D
          </p>
        </div>

        <div className="flex flex-1 flex-col gap-3.5 p-4 md:p-[22px]">
          <h3 className="line-clamp-2 min-h-[2.5em] font-[family-name:var(--font-playfair)] text-[20px] font-semibold leading-[1.25] text-[#FBF8F1] md:text-[22px]">
            {trip.title}
          </h3>

          <p className="flex items-start gap-2 font-[family-name:var(--font-dm-sans)] text-[14px] text-[#C9C3B6]">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#D6AE3C]" aria-hidden="true" />
            <span className="line-clamp-2">{formatRoute(trip)}</span>
          </p>

          <p className="flex items-start gap-2 font-[family-name:var(--font-dm-sans)] text-[14px] text-[#ECE7DC]">
            <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-[#D6AE3C]" aria-hidden="true" />
            <span>
              {primaryDate}
              {extraCount > 0 ? (
                <span className="ml-2 font-semibold text-[#D6AE3C]">
                  +{extraCount} more date{extraCount === 1 ? "" : "s"}
                </span>
              ) : null}
            </span>
          </p>

          <div className="mt-auto flex items-end justify-between gap-4 border-t border-white/8 pt-4">
            <div>
              {!trip.currentPrice ? (
                <p className="font-[family-name:var(--font-dm-sans)] text-[22px] font-bold text-[#D6AE3C]">
                  Coming soon
                </p>
              ) : (
                <>
                  {trip.originalPrice && trip.originalPrice > trip.currentPrice ? (
                    <p className="font-[family-name:var(--font-dm-sans)] text-[13px] text-[#8F897D] line-through">
                      ₹{inrFormatter.format(trip.originalPrice)}
                    </p>
                  ) : null}
                  <p className="font-[family-name:var(--font-dm-sans)] text-[24px] font-bold text-[#FBF8F1]">
                    ₹{inrFormatter.format(trip.currentPrice)}
                  </p>
                  <p className="font-[family-name:var(--font-dm-sans)] text-[13px] text-[#C9C3B6]">
                    ${usdFormatter.format(inrToUsd(trip.currentPrice))} · per person
                  </p>
                </>
              )}
            </div>

            <span className="inline-flex h-11 shrink-0 items-center rounded-full border-[1.5px] border-[#D6AE3C] px-4 font-[family-name:var(--font-dm-sans)] text-[14px] font-bold text-[#D6AE3C] transition group-hover:bg-[#D6AE3C] group-hover:text-[#1A1405]">
              View trip
              <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
