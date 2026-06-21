import Image from "next/image";
import { founderData } from "../../data/aboutData";

export default function FounderSection() {
  return (
    <section
      className="bg-[#1A1A1A] px-4 py-20"
      aria-labelledby="founder-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
            Founder&apos;s Message
          </p>
          <h2
            id="founder-heading"
            className="mt-3 text-3xl font-black text-white md:text-5xl"
          >
            The Woman Behind the Movement
          </h2>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl items-center gap-10 md:grid-cols-[auto_1fr]">
          {/* Founder Image */}
          <div className="flex flex-col items-center">
            <div className="relative h-64 w-64 overflow-hidden rounded-full border-4 border-[#D4AF37]/30 shadow-[0_0_40px_rgba(212,175,55,0.15)]">
              <Image
                src={founderData.image}
                alt={founderData.name}
                fill
                sizes="256px"
                className="object-cover"
              />
            </div>
            <h3 className="mt-6 text-2xl font-bold text-white">
              {founderData.name}
            </h3>
            <p className="text-sm font-medium tracking-wide text-[#D4AF37]">
              {founderData.title}
            </p>
          </div>

          {/* Founder Bio & Quote */}
          <div className="rounded-3xl border border-white/10 bg-[#0F0F0F] p-8 shadow-xl md:p-10">
            <blockquote className="border-l-4 border-[#D4AF37] pl-5">
              <p className="text-lg italic leading-8 text-white/90 md:text-xl">
                &ldquo;{founderData.quote}&rdquo;
              </p>
            </blockquote>
            <p className="mt-6 leading-7 text-white/70">
              {founderData.bio}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
