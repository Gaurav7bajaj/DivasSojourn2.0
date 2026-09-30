"use client";

import Image from "next/image";
import Link from "next/link";
import { Expand } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import GalleryLightbox from "./GalleryLightbox";

const PAGE_SIZE = 24;
const ALL = "all";

function slugifyPlace(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function GalleryClient({ images }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const placeParam = searchParams.get("place");
  const triggerRef = useRef(null);

  const destinations = useMemo(() => {
    const set = new Set();
    images.forEach((image) => {
      if (image.destination) set.add(image.destination);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [images]);

  const activePlace = useMemo(() => {
    if (!placeParam) return ALL;
    const match = destinations.find((d) => slugifyPlace(d) === placeParam);
    return match || ALL;
  }, [destinations, placeParam]);

  const filtered = useMemo(() => {
    if (activePlace === ALL) return images;
    return images.filter((image) => image.destination === activePlace);
  }, [activePlace, images]);

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activePlace]);

  const visibleImages = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const setPlace = useCallback(
    (place) => {
      const params = new URLSearchParams(searchParams.toString());
      if (place === ALL) params.delete("place");
      else params.set("place", slugifyPlace(place));
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const openLightbox = (indexInFiltered, buttonEl) => {
    triggerRef.current = buttonEl || null;
    setLightboxIndex(indexInFiltered);
    const photo = filtered[indexInFiltered];
    if (photo) {
      const hash = `photo-${photo.index}`;
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#${hash}`);
    }
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    const { pathname: path, search } = window.location;
    window.history.replaceState(null, "", `${path}${search}`);
    window.requestAnimationFrame(() => {
      triggerRef.current?.focus?.();
    });
  };

  const navigateLightbox = (nextIndex) => {
    setLightboxIndex(nextIndex);
    const photo = filtered[nextIndex];
    if (photo) {
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}#photo-${photo.index}`,
      );
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash.replace(/^#/, "");
    const match = /^photo-(\d+)$/.exec(hash);
    if (!match) return;
    const photoIndex = Number(match[1]);
    const filteredIndex = filtered.findIndex((image) => image.index === photoIndex);
    if (filteredIndex < 0) return;
    setLightboxIndex(filteredIndex);
    setVisibleCount((count) => Math.max(count, filteredIndex + 1, PAGE_SIZE));
    // Only honor the initial deep link once per place filter
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePlace, filtered]);

  return (
    <>
      <header className="bg-[#0B0B0C] px-6 pb-9 pt-16 md:px-12 xl:px-24">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <nav
              aria-label="Breadcrumb"
              className="font-[family-name:var(--font-dm-sans)] text-[13px] text-[#C9C3B6]"
            >
              <Link href="/" className="transition hover:text-[#D6AE3C]">
                Home
              </Link>
              <span className="mx-2 text-white/30" aria-hidden="true">
                /
              </span>
              <span className="text-[#FBF8F1]">Gallery</span>
            </nav>

            <div className="mt-5 flex items-center gap-3">
              <span className="h-0.5 w-9 shrink-0 bg-[#D6AE3C]" aria-hidden="true" />
              <p className="font-[family-name:var(--font-dm-sans)] text-[13px] font-bold uppercase tracking-[0.24em] text-[#D6AE3C]">
                Our Journeys
              </p>
            </div>

            <h1 className="mt-4 font-[family-name:var(--font-playfair)] text-[clamp(2.75rem,5vw,4.5rem)] font-semibold leading-[1.08] text-[#FBF8F1]">
              Moments{" "}
              <em className="font-[family-name:var(--font-playfair)] font-medium italic text-[#E2BB4D]">
                that define us
              </em>
            </h1>

            <p className="mt-4 max-w-2xl font-[family-name:var(--font-dm-sans)] text-[18px] leading-[1.55] text-[#D9D3C6]">
              Real women, real trips — every photo here is from a Divas Sojourn journey. Tap any
              photo to see it full size.
            </p>
          </div>

          <p className="shrink-0 font-[family-name:var(--font-dm-sans)] text-[14px] text-[#8F897D]">
            {filtered.length} {filtered.length === 1 ? "photo" : "photos"}
          </p>
        </div>
      </header>

      <div className="bg-[#0B0B0C] px-6 pb-8 md:px-12 xl:px-24">
        <div
          className="mx-auto flex max-w-[1280px] flex-wrap gap-2.5"
          role="toolbar"
          aria-label="Filter by destination"
        >
          <button
            type="button"
            aria-pressed={activePlace === ALL}
            onClick={() => setPlace(ALL)}
            className={`inline-flex h-11 items-center rounded-full px-5 font-[family-name:var(--font-dm-sans)] text-[14px] font-semibold transition ${
              activePlace === ALL
                ? "bg-[#D6AE3C] text-[#1A1405]"
                : "border border-[rgba(245,241,232,0.22)] text-[#C9C3B6] hover:border-[#D6AE3C] hover:text-[#D6AE3C]"
            }`}
          >
            All photos
          </button>
          {destinations.map((destination) => {
            const pressed = activePlace === destination;
            return (
              <button
                key={destination}
                type="button"
                aria-pressed={pressed}
                onClick={() => setPlace(destination)}
                className={`inline-flex h-11 items-center rounded-full px-5 font-[family-name:var(--font-dm-sans)] text-[14px] font-semibold transition ${
                  pressed
                    ? "bg-[#D6AE3C] text-[#1A1405]"
                    : "border border-[rgba(245,241,232,0.22)] text-[#C9C3B6] hover:border-[#D6AE3C] hover:text-[#D6AE3C]"
                }`}
              >
                {destination}
              </button>
            );
          })}
        </div>
      </div>

      <section className="bg-[#0B0B0C] px-6 pb-20 md:px-12 md:pb-24 xl:px-24" aria-label="Photo gallery">
        <div className="mx-auto max-w-[1280px]">
          {filtered.length === 0 ? (
            <p className="rounded-[18px] border border-dashed border-[rgba(214,174,60,0.45)] px-6 py-12 text-center font-[family-name:var(--font-dm-sans)] text-[16px] text-[#D9D3C6]">
              No photos match this destination yet.
            </p>
          ) : (
            <>
              <div className="columns-1 [column-gap:16px] min-[421px]:columns-2 min-[769px]:columns-3 min-[1201px]:columns-4">
                {visibleImages.map((image, index) => (
                  <button
                    key={image.id}
                    type="button"
                    aria-label={`Open photo: ${image.destination}`}
                    onClick={(event) => openLightbox(index, event.currentTarget)}
                    className="group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-[18px] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D6AE3C]"
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.04]"
                      style={{ width: "100%", height: "auto" }}
                      loading={index < 4 ? "eager" : "lazy"}
                      priority={index < 2}
                    />
                    <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-[rgba(8,8,10,0.85)] to-transparent px-4 pb-4 pt-16 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                      <span className="font-[family-name:var(--font-dm-sans)] text-[14px] font-semibold text-[#FBF8F1]">
                        {image.destination}
                        {image.trip ? (
                          <span className="mt-0.5 block text-[12px] font-normal text-[#C9C3B6]">
                            {image.trip}
                          </span>
                        ) : null}
                      </span>
                      <Expand className="h-5 w-5 shrink-0 text-[#D6AE3C]" aria-hidden="true" />
                    </span>
                  </button>
                ))}
              </div>

              {hasMore ? (
                <div className="mt-10 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                    className="inline-flex h-12 items-center rounded-full border-[1.5px] border-[#D6AE3C] px-7 font-[family-name:var(--font-dm-sans)] text-[15px] font-bold text-[#D6AE3C] transition hover:bg-[#D6AE3C] hover:text-[#1A1405]"
                  >
                    Load more
                  </button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </section>

      {lightboxIndex !== null ? (
        <GalleryLightbox
          images={filtered}
          index={lightboxIndex}
          onClose={closeLightbox}
          onNavigate={navigateLightbox}
        />
      ) : null}
    </>
  );
}
