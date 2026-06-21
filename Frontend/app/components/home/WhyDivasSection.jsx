import { BadgeCheck, Filter, Radar, UsersRound } from "lucide-react";

const reasons = [
  {
    title: "No Third Party Mess",
    description:
      "100 percent in-house operations for all trips! No third parties involved, hence no shady claims!",
    icon: UsersRound,
  },
  {
    title: "Transparency & Security",
    description:
      "Real time monitoring of all trips by ground team! All routes and weather conditions are accurately updated!",
    icon: Radar,
  },
  {
    title: "Co-Travelers Filtering",
    description:
      "Multi-step filtering to bring only like-minded people together! That's our key to have fuss-free trips!",
    icon: Filter,
  },
  {
    title: "One Stop Hassle Free Experience",
    description:
      "Comfortable stays, trained drivers, hospitable staff and friendly trip leaders put together that one memorable trip for you!",
    icon: BadgeCheck,
  },
];

export default function WhyDivasSection() {
  return (
    <section className="bg-[#1A1A1A] px-4 py-16" aria-labelledby="why-divas-heading">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">Why Choose Us</p>
          <h2 id="why-divas-heading" className="mt-3 text-3xl font-black text-white md:text-5xl">
            Why Divas Sojourn?
          </h2>
          <p className="mt-4 leading-7 text-white">
            Every journey is planned with trusted operations, thoughtful community building and reliable
            on-ground care.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason) => {
            const Icon = reason.icon;

            return (
              <article
                key={reason.title}
                className="rounded-3xl border border-[#D4AF37]/30 bg-[#1A1A1A] p-6 shadow-xl transition duration-300 hover:-translate-y-1 hover:border-[#D4AF37] hover:bg-[#2A2A2A] hover:shadow-[0_8px_20px_rgba(212,175,55,0.2)]"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4AF37]/15 text-[#D4AF37]">
                  <Icon className="h-7 w-7" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-white">{reason.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white">{reason.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
