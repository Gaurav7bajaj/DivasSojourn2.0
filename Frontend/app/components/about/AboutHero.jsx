export default function AboutHero() {
  return (
    <section
      className="relative flex min-h-[55vh] items-center justify-center overflow-hidden bg-cover bg-center text-center md:min-h-[65vh]"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1800&q=85')",
      }}
      aria-label="About Divas Sojourn"
    >
      {/* Gradient overlays */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-[#1A1A1A]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#1A1A1A] to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-4xl px-4">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-[#D4AF37]">
          About Us
        </p>
        <h1
          className="text-4xl font-black leading-tight drop-shadow-[0_4px_18px_rgba(0,0,0,0.85)] md:text-6xl lg:text-7xl"
          style={{ color: "#FFFFFF" }}
        >
          Empowering Women to Explore the World
        </h1>
        <p
          className="mx-auto mt-6 max-w-2xl text-base leading-7 drop-shadow-[0_3px_12px_rgba(0,0,0,0.9)] md:text-lg"
          style={{ color: "#FFFFFF" }}
        >
          A global community of women travelers built on trust, safety, and the
          shared love of discovery. Since 2015, we&apos;ve been curating
          journeys that transform lives.
        </p>
      </div>
    </section>
  );
}
