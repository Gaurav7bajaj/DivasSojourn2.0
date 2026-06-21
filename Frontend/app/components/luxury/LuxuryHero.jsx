import Link from "next/link";

export default function LuxuryHero() {
  return (
    <section
      className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-cover bg-center text-center md:min-h-[80vh]"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1800&q=85')",
      }}
      aria-label="Luxury Experiences by Divas Sojourn"
    >
      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/60 to-[#1A1A1A]" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#1A1A1A] to-transparent" aria-hidden="true" />

      {/* Decorative gold lines */}
      <div className="absolute left-1/2 top-8 h-16 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#D4AF37]/60 to-transparent" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-4xl px-4">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.5em] text-[#D4AF37]">
          Luxury Experiences
        </p>
        <h1
          className="text-4xl font-black leading-tight drop-shadow-[0_4px_18px_rgba(0,0,0,0.85)] md:text-6xl lg:text-7xl"
          style={{ color: "#FFFFFF" }}
        >
          Indulgence, Curated
          <br />
          <span className="text-[#D4AF37]">for the Extraordinary</span>
        </h1>
        <p
          className="mx-auto mt-6 max-w-2xl text-base leading-7 drop-shadow-[0_3px_12px_rgba(0,0,0,0.9)] md:text-lg"
          style={{ color: "#FFFFFF" }}
        >
          Handcrafted journeys where every detail whispers luxury — from
          overwater villas and private safaris to mountain sanctuaries and
          river cruises. Your extraordinary journey begins here.
        </p>
        <Link
          href="#concierge"
          className="mt-8 inline-flex items-center gap-2 rounded-full border-2 border-[#D4AF37] bg-[#D4AF37]/10 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-[#D4AF37] backdrop-blur-sm transition-all duration-300 hover:bg-[#D4AF37] hover:text-[#0F0F0F] hover:shadow-[0_8px_30px_rgba(212,175,55,0.3)]"
        >
          Connect with Concierge
        </Link>
      </div>
    </section>
  );
}
