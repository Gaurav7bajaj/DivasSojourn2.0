export default function TailoredIntro() {
  return (
    <section className="bg-[#1A1A1A] px-4 py-16 text-center md:py-20" aria-labelledby="tailored-intro-heading">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-[#D4AF37]">Made For You</p>
        <h2
          id="tailored-intro-heading"
          className="mt-4 text-2xl font-black leading-snug text-white md:text-4xl"
        >
          Divas Sojourn can help you make your own specialized tailored trips for these destinations
        </h2>
        <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-[#D4AF37]" aria-hidden="true" />
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
          Tap a destination below and share a few details — our team will reach out to shape your
          perfect women-only escape.
        </p>
      </div>
    </section>
  );
}
