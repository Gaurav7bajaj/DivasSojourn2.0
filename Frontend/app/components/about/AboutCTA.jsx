import Link from "next/link";

export default function AboutCTA() {
  return (
    <section
      className="relative flex min-h-[40vh] items-center justify-center overflow-hidden bg-cover bg-center px-4 text-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1800&q=85')",
      }}
      aria-label="Join Divas Sojourn"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A] via-black/80 to-[#1A1A1A]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-3xl py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#D4AF37]">
          Your Journey Awaits
        </p>
        <h2 className="mt-4 text-3xl font-black text-white md:text-5xl">
          Ready to Begin Your Adventure?
        </h2>
        <p className="mx-auto mt-5 max-w-xl leading-7 text-white/70">
          Join thousands of women who have discovered the joy of traveling
          together. Your next unforgettable memory is just a trip away.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/upcoming-trips"
            className="rounded-full bg-[#D4AF37] px-8 py-3 text-sm font-bold uppercase tracking-wide text-[#0F0F0F] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E8C547] hover:shadow-[0_8px_20px_rgba(212,175,55,0.3)]"
          >
            Explore Upcoming Trips
          </Link>
          <Link
            href="tel:+919990022835"
            className="rounded-full border-2 border-white/30 px-8 py-3 text-sm font-bold uppercase tracking-wide text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D4AF37] hover:text-[#D4AF37]"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
