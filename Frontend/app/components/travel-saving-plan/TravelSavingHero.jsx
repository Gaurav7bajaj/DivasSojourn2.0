import { PiggyBank } from "lucide-react";

export default function TravelSavingHero() {
  return (
    <section className="bg-[#1A1A1A] px-4 py-14 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37]">
        <PiggyBank className="h-9 w-9" aria-hidden="true" />
      </div>
      <p className="mt-5 text-sm font-black uppercase tracking-[0.28em] text-[#D4AF37]">
        Save Little, Travel More
      </p>
      <h1 className="mt-3 text-4xl font-black text-white md:text-6xl">Travel Saving Plan</h1>
      <div className="mx-auto mt-5 h-1 w-20 rounded-full bg-[#D4AF37]" aria-hidden="true" />
    </section>
  );
}
