import { IndianRupee } from "lucide-react";

export default function PaymentsHeader() {
  return (
    <section className="bg-[#1A1A1A] px-4 py-14 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37]">
        <IndianRupee className="h-9 w-9" aria-hidden="true" />
      </div>
      <h1 className="mt-5 text-4xl font-black text-white md:text-6xl">Pay us at</h1>
      <div className="mx-auto mt-5 h-1 w-20 rounded-full bg-[#D4AF37]" aria-hidden="true" />
    </section>
  );
}
