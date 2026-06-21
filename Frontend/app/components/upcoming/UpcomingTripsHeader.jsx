import Image from "next/image";

export default function UpcomingTripsHeader() {
  return (
    <section className="bg-[#1A1A1A] px-4 py-8">
      <div className="relative mx-auto min-h-[170px] max-w-7xl overflow-hidden rounded-[2rem] border border-[#D4AF37]/30 shadow-2xl md:min-h-[250px]">
        <Image
          src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80"
          alt="Beach travel banner for upcoming community trips"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />
        <div className="relative z-10 flex min-h-[170px] flex-col items-center justify-center px-6 text-center md:min-h-[250px]">
          <p className="text-sm font-black uppercase tracking-[0.4em] text-white">Upcoming</p>
          <h1 className="mt-2 text-4xl font-black uppercase tracking-wide text-[#D4AF37] md:text-6xl">
            Community
          </h1>
          <p className="mt-2 text-sm font-black uppercase tracking-[0.4em] text-white">Trips</p>
          <div className="mt-5 h-1 w-24 rounded-full bg-[#D4AF37]" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
