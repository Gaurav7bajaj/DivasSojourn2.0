import Image from "next/image";

export default function OurStory() {
  return (
    <section className="bg-[#1A1A1A] px-4 py-20" aria-labelledby="our-story-heading">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        {/* Text Column */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
            Our Story
          </p>
          <h2
            id="our-story-heading"
            className="mt-3 text-3xl font-black text-white md:text-5xl"
          >
            From a Dream to a Movement
          </h2>
          <div className="mt-6 space-y-5 text-base leading-7 text-white/80">
            <p>
              It all started in 2015, when a young engineer named Pooja Malhotra
              decided to challenge the societal norms that told her what a
              woman&apos;s life should look like. She left her cushy corporate
              job, bought a one-way ticket, and embarked on a solo journey
              across continents.
            </p>
            <p>
              Along the way, she met countless women who shared the same
              yearning — to travel freely, explore fearlessly, and experience
              the world without compromise. What began as a personal odyssey
              quickly became something much bigger: a community.
            </p>
            <p>
              Today, <strong className="text-white">Divas Sojourn</strong> is a
              global women&apos;s travel community that has taken{" "}
              <span className="font-semibold text-[#D4AF37]">14,000+</span>{" "}
              women across{" "}
              <span className="font-semibold text-[#D4AF37]">1,300+</span>{" "}
              destinations worldwide. Every trip is planned in-house with zero
              third-party involvement, ensuring safety, quality, and the kind of
              authentic experiences that money alone can&apos;t buy.
            </p>
          </div>
        </div>

        {/* Image Column */}
        <div className="relative h-[400px] w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl lg:h-[500px]">
          <Image
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80"
            alt="Women travelers enjoying a group trip together"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      </div>
    </section>
  );
}
