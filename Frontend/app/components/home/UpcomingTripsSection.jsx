import Image from "next/image";
import Link from "next/link";

export default function UpcomingTripsSection() {
  return (
    <section className="bg-[#1A1A1A] px-4 py-16" aria-labelledby="upcoming-trips-heading">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-center gap-4 text-center">
          <span className="h-px w-12 bg-[#D4AF37]" aria-hidden="true" />
          <h2
            id="upcoming-trips-heading"
            className="text-2xl font-black uppercase tracking-widest text-white md:text-3xl"
          >
            Upcoming Community Trips
          </h2>
          <span className="h-px w-12 bg-[#D4AF37]" aria-hidden="true" />
        </div>

        <div className="relative min-h-[280px] overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl">
          <Image
            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80"
            alt="Beachside travel community experience"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />
          <div className="relative z-10 flex min-h-[280px] flex-col items-start justify-center px-6 py-10 md:px-12">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
              Travel Together
            </p>
            <h3 className="max-w-2xl text-3xl font-black leading-tight text-white md:text-5xl">
              Join our next women-only community adventure
            </h3>
            <Link
              href="/upcoming-trips"
              className="mt-7 rounded-full bg-[#D4AF37] px-7 py-3 text-sm font-bold uppercase tracking-wide text-[#0F0F0F] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E8C547] hover:shadow-[0_8px_20px_rgba(212,175,55,0.3)]"
            >
              Explore
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
