import Image from "next/image";
import { Playfair_Display } from "next/font/google";
import { Download } from "lucide-react";
import ShareButton from "./ShareButton";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  style: ["normal", "italic"],
});

export default function TripHero({ trip }) {
  return (
    <section
      className="relative overflow-hidden bg-[#0F0F0F]"
      style={{ height: "clamp(320px, 48vw, 520px)" }}
    >
      <Image
        src={trip.image}
        alt={`${trip.title} trip hero`}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/15"
        aria-hidden="true"
      />

      <div className="absolute inset-x-0 bottom-0 z-10 p-5 md:p-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h1
            className={`${playfair.className} max-w-[min(100%,720px)] text-[clamp(1.75rem,4.5vw,3.25rem)] font-bold italic leading-[1.15] text-white sm:max-w-[80%]`}
            style={{ textShadow: "2px 2px 12px rgba(0,0,0,0.75)" }}
          >
            {trip.title}
          </h1>

          <div className="flex shrink-0 flex-wrap gap-3">
            <HeroAction href={trip.pdfPath} download label="Download Itinerary" />
            <ShareButton title={trip.title} />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroAction({ href, download, label }) {
  if (!href) {
    return null;
  }

  return (
    <a
      href={href}
      download={download}
      className="inline-flex items-center gap-2 rounded-full bg-[#0F9B9B] px-4 py-2.5 text-sm font-black text-white transition hover:bg-[#0d8585]"
    >
      <Download className="h-4 w-4" aria-hidden="true" />
      {label}
    </a>
  );
}
