import Image from "next/image";
import Link from "next/link";
import { galleryImages as defaultGalleryImages } from "../../data/aboutData";

const MOSAIC_CLASSES = [
  "md:col-start-1 md:row-span-2 md:row-start-1",
  "md:col-span-2 md:col-start-2 md:row-start-1",
  "md:col-start-4 md:row-start-1",
  "md:col-start-2 md:row-start-2",
  "md:col-span-2 md:col-start-3 md:row-start-2",
];

export default function PhotoGallery({ images, variant = "preview" }) {
  const galleryImages = images?.length ? images : defaultGalleryImages;
  const isFull = variant === "full";
  const displayImages = isFull ? galleryImages : galleryImages.slice(0, 5);

  return (
    <section
      className="bg-[#0B0B0C] px-6 py-20 md:px-12 md:py-[120px] xl:px-24"
      aria-labelledby="gallery-heading"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-0.5 w-9 shrink-0 bg-[#D6AE3C]" aria-hidden="true" />
              <p className="font-[family-name:var(--font-dm-sans)] text-[13px] font-bold uppercase tracking-[0.24em] text-[#D6AE3C]">
                Our Journeys
              </p>
            </div>
            <h2
              id="gallery-heading"
              className="mt-4 font-[family-name:var(--font-playfair)] text-[36px] font-semibold leading-tight text-[#FBF8F1] md:text-[48px]"
            >
              Moments{" "}
              <em className="font-[family-name:var(--font-playfair)] font-medium italic text-[#E2BB4D]">
                that define us
              </em>
            </h2>
          </div>
          {!isFull ? (
            <Link
              href="/gallery"
              className="inline-flex min-h-11 items-center font-[family-name:var(--font-dm-sans)] text-[15px] font-semibold text-[#D6AE3C] transition hover:text-[#E6BF4C]"
            >
              View full gallery →
            </Link>
          ) : null}
        </div>

        {isFull ? (
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {displayImages.map((img, index) => (
              <div
                key={`${img.src}-${index}`}
                className={`group relative overflow-hidden rounded-[20px] ${
                  index % 5 === 0 ? "row-span-2 min-h-[420px] md:min-h-[560px]" : "min-h-[200px] md:min-h-[270px]"
                }`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 auto-rows-[200px] gap-3 md:grid-cols-4 md:auto-rows-[280px] md:gap-4">
            {displayImages.map((img, index) => (
              <div
                key={`${img.src}-${index}`}
                className={`group relative min-h-0 overflow-hidden rounded-[20px] ${MOSAIC_CLASSES[index] || ""}`}
              >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      style={img.focus ? { objectPosition: img.focus } : undefined}
                      loading="lazy"
                    />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
