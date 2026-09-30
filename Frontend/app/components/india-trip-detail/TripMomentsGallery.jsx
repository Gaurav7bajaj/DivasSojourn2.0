"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import GalleryLightbox from "../gallery/GalleryLightbox";
import { getTripGalleryPhotos, getTripPlaceLabel } from "./tripDetailUtils";

export default function TripMomentsGallery({ trip }) {
  const photos = useMemo(() => getTripGalleryPhotos(trip), [trip]);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  if (photos.length < 3) return null;

  const place = getTripPlaceLabel(trip);
  const galleryHref = `/gallery?place=${encodeURIComponent(place)}`;
  const display = photos.slice(0, 5);

  return (
    <section id="gallery" className="scroll-mt-40">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="h-[2px] w-9 shrink-0 bg-[#D6AE3C]" aria-hidden="true" />
            <p className="font-[family-name:var(--font-dm-sans)] text-[13px] font-bold uppercase tracking-[0.24em] text-[#D6AE3C]">
              Gallery
            </p>
          </div>
          <h2 className="font-[family-name:var(--font-playfair)] text-[clamp(1.85rem,3vw,2.6rem)] font-semibold leading-tight text-[#FBF8F1]">
            Moments from <em className="italic text-[#E2BB4D]">this trip</em>
          </h2>
        </div>
        <Link
          href={galleryHref}
          className="inline-flex items-center gap-1.5 font-[family-name:var(--font-dm-sans)] text-[14px] font-bold text-[#D6AE3C] transition hover:text-[#E6BF4C]"
        >
          View all photos
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 grid-rows-[160px_160px] gap-3 md:grid-cols-4 md:grid-rows-[220px_220px]">
        {display.map((photo, index) => {
          const isHero = index === 0;
          return (
            <button
              key={photo.id}
              type="button"
              onClick={() => setLightboxIndex(index)}
              className={[
                "group relative h-full w-full overflow-hidden rounded-2xl bg-[#18181C] text-left",
                isHero ? "col-span-2 row-span-2" : "",
              ].join(" ")}
              aria-label={`Open photo: ${photo.caption}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes={isHero ? "(max-width:768px) 100vw, 50vw" : "(max-width:768px) 50vw, 25vw"}
                className="object-cover object-center transition duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <span className="absolute bottom-3 left-3 rounded-full bg-[rgba(8,8,10,0.72)] px-3 py-1 font-[family-name:var(--font-dm-sans)] text-[12px] font-semibold text-[#FBF8F1]">
                {photo.caption}
              </span>
            </button>
          );
        })}
      </div>

      {lightboxIndex != null ? (
        <GalleryLightbox
          images={photos}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      ) : null}
    </section>
  );
}
