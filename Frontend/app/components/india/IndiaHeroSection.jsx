import Image from "next/image";
import Link from "next/link";

export default function IndiaHeroSection() {
  return (
    <section className="relative flex min-h-[320px] items-center overflow-hidden md:min-h-[500px]">
      <Image
        src="https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1800&q=80"
        alt="Taj Mahal representing India trips for female travelers"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-white/70" aria-hidden="true" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-16 lg:px-8">
        <div className="max-w-3xl border-l-4 border-[#D4AF37] pl-6">
          <p className="text-lg font-bold text-[#D4AF37] md:text-2xl">
            A Journey Through Time, Colour And Culture
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight text-white md:text-6xl">
            India Trips for Female Travelers
          </h1>
          <p className="mt-5 max-w-2xl leading-7 text-white">
            India tour packages crafted for every dream and every destination, from Himalayan
            monasteries and spiritual circuits to royal cities, backwaters and hidden regional gems.
          </p>
          <Link
            href="#destinations"
            className="mt-8 inline-flex rounded-full bg-[#D4AF37] px-8 py-3 text-sm font-black uppercase tracking-wide text-[#0F0F0F] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E8C547] hover:shadow-[0_8px_20px_rgba(212,175,55,0.3)]"
          >
            Explore Trips
          </Link>
        </div>
      </div>
    </section>
  );
}
