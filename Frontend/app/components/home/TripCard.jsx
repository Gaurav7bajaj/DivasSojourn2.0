import Image from "next/image";
import Link from "next/link";
import { formatDualPrice } from "../../utils/formatPrice";

export default function TripCard({ trip, href = "/upcoming-trips" }) {
  const linkHref = trip.customHref ? trip.customHref : (trip.slug ? `${href}/${trip.slug}` : href);

  return (
    <article className="group relative w-[240px] h-[340px] shrink-0 overflow-hidden rounded-3xl border border-white/10 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-[#D4AF37] hover:shadow-[0_12px_28px_rgba(212,175,55,0.3)]">
      <Link href={linkHref} aria-label={`Explore ${trip.name} trip`} className="absolute inset-0">
        <Image
          src={trip.image}
          alt={`${trip.name} travel destination`}
          fill
          sizes="240px"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent transition-opacity duration-300 group-hover:from-black/90 group-hover:via-black/40" />
        <div className="absolute inset-0 p-5 flex flex-col justify-end items-center text-center">
          <h3 className="text-xl font-bold text-white tracking-wide transition duration-300 group-hover:text-[#D4AF37]">
            {trip.name}
          </h3>
          <p className="mt-1.5 text-sm font-semibold text-[#D4AF37]">
            Starting Price {formatDualPrice(trip.price)}
          </p>
        </div>
      </Link>
    </article>
  );
}
