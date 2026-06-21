import { curatedEscapesHero } from "../../data/curatedEscapes";

export default function CuratedEscapesHero() {
  return (
    <section
      className="relative flex min-h-[62vh] items-center justify-center overflow-hidden bg-[#0F0F0F] bg-cover bg-center px-4 py-16 text-center md:min-h-[70vh] lg:bg-none"
      style={{ backgroundImage: `url('${curatedEscapesHero.image}')` }}
      aria-label="Curated escape travel experiences"
    >
      <video
        className="absolute inset-0 hidden h-full w-full object-cover lg:block"
        autoPlay
        loop
        muted
        playsInline
        poster={curatedEscapesHero.image}
        aria-hidden="true"
      >
        <source src={curatedEscapesHero.video} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#1A1A1A]" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#1A1A1A] to-transparent" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-3xl">
        <p
          className="text-sm font-bold uppercase tracking-[0.3em] text-[#D4AF37] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] md:text-xl"
          style={{ color: "#D4AF37" }}
        >
          {curatedEscapesHero.subtitle}
        </p>
        <h1
          className="mt-4 text-4xl font-black leading-tight drop-shadow-[0_4px_18px_rgba(0,0,0,0.85)] md:text-6xl"
          style={{ color: "#FFFFFF" }}
        >
          {curatedEscapesHero.title}
        </h1>
        <div className="mx-auto mt-5 h-1 w-24 rounded-full bg-[#D4AF37]" aria-hidden="true" />
        <p
          className="mx-auto mt-5 max-w-2xl text-sm leading-7 drop-shadow-[0_3px_12px_rgba(0,0,0,0.9)] md:text-lg"
          style={{ color: "#FFFFFF" }}
        >
          {curatedEscapesHero.description}
        </p>
      </div>
    </section>
  );
}
