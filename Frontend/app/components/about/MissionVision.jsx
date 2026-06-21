import { Compass, Eye } from "lucide-react";
import { missionVision } from "../../data/aboutData";

export default function MissionVision() {
  const cards = [
    { ...missionVision.mission, Icon: Compass },
    { ...missionVision.vision, Icon: Eye },
  ];

  return (
    <section
      className="bg-[#0F0F0F] px-4 py-20"
      aria-labelledby="mission-vision-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
            What Drives Us
          </p>
          <h2
            id="mission-vision-heading"
            className="mt-3 text-3xl font-black text-white md:text-5xl"
          >
            Mission &amp; Vision
          </h2>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-8 md:grid-cols-2">
          {cards.map((card) => {
            const Icon = card.Icon;
            return (
              <article
                key={card.title}
                className="group rounded-3xl border border-[#D4AF37]/20 bg-[#1A1A1A] p-8 shadow-xl transition duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/50 hover:shadow-[0_8px_30px_rgba(212,175,55,0.12)] md:p-10"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4AF37]/15 text-[#D4AF37] transition-colors duration-300 group-hover:bg-[#D4AF37]/25">
                  <Icon className="h-7 w-7" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold text-white">{card.title}</h3>
                <p className="mt-4 leading-7 text-white/70">{card.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
