import Image from "next/image";
import { Clock } from "lucide-react";

export default function LuxuryTripCard({ trip, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex h-[400px] w-full flex-col overflow-hidden rounded-3xl border border-white/10 text-left shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-[#D4AF37]/50 hover:shadow-[0_12px_40px_rgba(212,175,55,0.15)] md:h-[440px]"
      aria-label={`View details for ${trip.title}`}
    >
      <Image
        src={trip.image}
        alt={trip.title}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-300 group-hover:from-black/95" />

      {/* Duration badge */}
      <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-[#D4AF37] px-3 py-1.5 text-xs font-bold text-[#0F0F0F] shadow-lg">
        <Clock className="h-3 w-3" aria-hidden="true" />
        {trip.duration}
      </div>

      {/* Bottom content */}
      <div className="absolute inset-x-0 bottom-0 p-6">
        <h3 className="text-xl font-bold text-white transition-colors duration-300 group-hover:text-[#D4AF37] md:text-2xl">
          {trip.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/60">
          {trip.overview}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-[#D4AF37]">
            ₹{trip.price.toLocaleString("en-IN")}
            <span className="ml-1 text-xs font-normal text-white/40">per person</span>
          </span>
          <span className="rounded-full border border-[#D4AF37]/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#D4AF37] transition-all duration-300 group-hover:bg-[#D4AF37] group-hover:text-[#0F0F0F]">
            View Details
          </span>
        </div>
      </div>
    </button>
  );
}
