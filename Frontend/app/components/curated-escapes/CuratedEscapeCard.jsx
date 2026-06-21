import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";

export default function CuratedEscapeCard({ escape }) {
  return (
    <Link
      href={`/curated-escapes/${escape.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-[#D4AF37]/25 bg-white text-[#1A1A1A] shadow-[0_18px_40px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-2 hover:border-[#D4AF37] hover:shadow-[0_24px_55px_rgba(212,175,55,0.22)] focus:outline-none focus:ring-4 focus:ring-[#D4AF37]/30"
      aria-label={`Explore ${escape.name}`}
    >
      <div className="relative h-64 overflow-hidden">
        <Image
          src={escape.image}
          alt={`${escape.name} curated travel experience`}
          fill
          sizes="(min-width: 1024px) 20vw, (min-width: 768px) 33vw, 100vw"
          className="object-cover transition duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" aria-hidden="true" />
        <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/45 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-white backdrop-blur-sm">
          {escape.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h2 className="text-xl font-black leading-snug text-[#1A1A1A]">{escape.name}</h2>
        <p className="mt-3 flex-1 text-sm leading-6 text-[#555555]">{escape.description}</p>

        <div className="mt-5 flex items-center gap-2 rounded-full bg-[#F5E6D3]/55 px-3 py-2 text-xs font-bold text-[#555555]">
          <Clock className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
          <span>Typical Duration: {escape.duration}</span>
        </div>

        <p className="mt-4 text-base font-black text-[#D4AF37]">
          From: {escape.priceLabel}{" "}
          <span className="text-xs font-semibold text-[#555555]">{escape.priceSuffix}</span>
        </p>

        <span className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[#D4AF37] px-5 py-3 text-sm font-black text-[#0F0F0F] transition duration-300 group-hover:bg-[#E8C547] group-hover:shadow-[0_10px_22px_rgba(212,175,55,0.35)]">
          {escape.cta}
        </span>
      </div>
    </Link>
  );
}
