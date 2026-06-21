"use client";

import { useState } from "react";
import { Phone, Sparkles } from "lucide-react";

export default function ConciergeForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = () => {
    const message = `Hi, I'd like to know more about your Luxury Experiences.%0A%0AName: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0A%0APlease share details about your premium travel packages.`;
    window.open(`https://wa.me/919990022835?text=${message}`, "_blank");
  };

  return (
    <section
      id="concierge"
      className="relative overflow-hidden bg-[#0F0F0F] px-4 py-20"
      aria-labelledby="concierge-heading"
    >
      {/* Decorative elements */}
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" aria-hidden="true" />
      <div className="absolute -left-32 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-[#D4AF37]/5 blur-3xl" aria-hidden="true" />
      <div className="absolute -right-32 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-[#D4AF37]/5 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-2xl text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4AF37]/15">
          <Sparkles className="h-7 w-7 text-[#D4AF37]" aria-hidden="true" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#D4AF37]">
          Personal Concierge
        </p>
        <h2
          id="concierge-heading"
          className="mt-3 text-3xl font-black text-white md:text-5xl"
        >
          Connect with Your Travel Concierge
        </h2>
        <p className="mx-auto mt-4 max-w-lg leading-7 text-white/50">
          Share your travel dreams and our luxury travel experts will craft a
          bespoke itinerary tailored just for you.
        </p>

        <div className="mx-auto mt-10 max-w-md space-y-4">
          <input
            type="text"
            placeholder="Your Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-[#1A1A1A] px-5 py-4 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-[#D4AF37]/50"
          />
          <input
            type="tel"
            placeholder="+91 Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-[#1A1A1A] px-5 py-4 text-sm text-white placeholder:text-white/30 outline-none transition focus:border-[#D4AF37]/50"
          />
          <button
            type="button"
            onClick={handleSubmit}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-6 py-4 text-sm font-bold uppercase tracking-wider text-[#0F0F0F] transition-all duration-300 hover:bg-[#E8C547] hover:shadow-[0_8px_30px_rgba(212,175,55,0.3)]"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            Connect via WhatsApp
          </button>
        </div>

        <p className="mt-4 text-xs text-white/30">
          We&apos;ll reach out within 2 hours on WhatsApp
        </p>
      </div>
    </section>
  );
}
