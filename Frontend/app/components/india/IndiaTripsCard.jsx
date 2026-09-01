import Image from "next/image";
import Link from "next/link";
import { formatDualPrice } from "../../utils/formatPrice";

export default function IndiaTripsCard({ trip }) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-l-4 border-t-4 border-[#D4AF37]/30 bg-[#1A1A1A] transition duration-300 hover:-translate-y-2 hover:border-[#D4AF37] hover:shadow-[0_14px_30px_rgba(212,175,55,0.22)]">
      <Link href={`/india-trips/${trip.slug}`} aria-label={`Explore ${trip.shortName}`}>
        <div className="relative h-64 overflow-hidden">
          <Image
            src={trip.image}
            alt={`${trip.title} women-only India trip`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover brightness-90 transition duration-500 group-hover:scale-110 group-hover:brightness-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
          <span className="absolute left-4 top-4 rounded-full bg-[#D4AF37] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#0F0F0F]">
            India
          </span>
        </div>
        <div className="p-5">
          <h3 className="text-2xl font-black text-white">{trip.shortName}</h3>
          <p className="mt-2 font-semibold text-white">{trip.duration}</p>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-white">{trip.description}</p>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm">
            <span className="rounded-full bg-white px-3 py-1 font-bold text-black">
              {formatDualPrice(trip.price)}
            </span>
            <span className="font-semibold text-white">{trip.dates}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
