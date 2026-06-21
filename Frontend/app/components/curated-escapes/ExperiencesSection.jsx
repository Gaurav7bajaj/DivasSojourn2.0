import { curatedExperiencesIntro } from "../../data/curatedEscapes";

export default function ExperiencesSection() {
  return (
    <section
      className="relative flex min-h-[360px] items-center justify-center overflow-hidden bg-[#0F0F0F] bg-cover bg-center px-4 py-16 text-center md:min-h-[460px]"
      style={{ backgroundImage: `url('${curatedExperiencesIntro.image}')` }}
      aria-labelledby="curated-escape-experiences-heading"
    >
      <div className="absolute inset-0 bg-black/45" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.22),transparent_38%),linear-gradient(to_bottom,rgba(0,0,0,0.38),rgba(26,26,26,0.88))]" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#1A1A1A] to-transparent" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-4xl rounded-[2rem] border border-white/15 bg-black/35 px-5 py-9 shadow-[0_24px_70px_rgba(0,0,0,0.35)] backdrop-blur-sm md:px-12 md:py-11">
        <p
          className="text-sm font-black uppercase tracking-[0.28em] drop-shadow-[0_3px_12px_rgba(0,0,0,0.9)]"
          style={{ color: "#D4AF37" }}
        >
          {curatedExperiencesIntro.eyebrow}
        </p>
        <h2
          id="curated-escape-experiences-heading"
          className="mt-4 text-3xl font-black leading-tight drop-shadow-[0_4px_18px_rgba(0,0,0,0.8)] md:text-5xl"
          style={{ color: "#FFFFFF" }}
        >
          {curatedExperiencesIntro.title}
        </h2>
        <div className="mx-auto mt-5 h-1 w-20 rounded-full bg-[#D4AF37]" aria-hidden="true" />
        <p
          className="mx-auto mt-5 max-w-3xl text-sm leading-7 drop-shadow-[0_3px_12px_rgba(0,0,0,0.85)] md:text-base"
          style={{ color: "#FFFFFF" }}
        >
          {curatedExperiencesIntro.description}
        </p>
      </div>
    </section>
  );
}
