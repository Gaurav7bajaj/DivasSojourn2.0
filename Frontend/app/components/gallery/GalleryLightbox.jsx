"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";

export default function GalleryLightbox({
  images,
  index,
  onClose,
  onNavigate,
}) {
  const titleId = useId();
  const closeRef = useRef(null);
  const dialogRef = useRef(null);
  const thumbStripRef = useRef(null);
  const touchStart = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const current = images[index];
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const goPrev = useCallback(() => {
    if (!images.length) return;
    onNavigate((index - 1 + images.length) % images.length);
  }, [images.length, index, onNavigate]);

  const goNext = useCallback(() => {
    if (!images.length) return;
    onNavigate((index + 1) % images.length);
  }, [images.length, index, onNavigate]);

  useEffect(() => {
    setLoaded(false);
  }, [current?.src]);

  useEffect(() => {
    if (!current) return;
    const prev = images[(index - 1 + images.length) % images.length];
    const next = images[(index + 1) % images.length];
    [prev, next].forEach((item) => {
      if (!item) return;
      const img = new window.Image();
      img.src = item.src;
    });
  }, [current, index, images]);

  useEffect(() => {
    const previous = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      } else if (event.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      if (previous && typeof previous.focus === "function") previous.focus();
    };
  }, [goNext, goPrev, onClose]);

  useEffect(() => {
    const strip = thumbStripRef.current;
    if (!strip) return;
    const active = strip.querySelector("[data-active='true']");
    active?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [index, prefersReducedMotion]);

  if (!current) return null;

  const onTouchStart = (event) => {
    const touch = event.changedTouches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const onTouchEnd = (event) => {
    if (!touchStart.current) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStart.current.x;
    const dy = touch.clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) < 40 && Math.abs(dy) < 40) return;
    if (Math.abs(dy) > Math.abs(dx) && dy > 60) {
      onClose();
      return;
    }
    if (Math.abs(dx) > 60) {
      if (dx < 0) goNext();
      else goPrev();
    }
  };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-[80] flex flex-col bg-[rgba(5,5,7,0.94)] motion-safe:transition-opacity motion-safe:duration-200"
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="mx-auto flex w-full max-w-[1248px] items-center justify-between px-5 py-4 md:px-8"
        onClick={(event) => event.stopPropagation()}
      >
        <p
          id={titleId}
          className="font-[family-name:var(--font-dm-sans)] text-[15px] text-[#FBF8F1]"
        >
          <span className="font-bold">{current.destination}</span>
          <span className="text-[#8F897D]">
            {" "}
            · {index + 1} / {images.length}
          </span>
        </p>
        <button
          ref={closeRef}
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-[#FBF8F1] transition hover:border-[#D6AE3C] hover:text-[#D6AE3C]"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-16"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Previous photo"
          onClick={goPrev}
          className="absolute left-3 top-1/2 z-10 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(18,18,21,0.72)] text-[#FBF8F1] transition hover:bg-[#D6AE3C] hover:text-[#1A1405] md:flex"
        >
          <ChevronLeft className="h-6 w-6" aria-hidden="true" />
        </button>

        <div className="relative flex max-h-[75vh] max-w-[min(90vw,1040px)] items-center justify-center">
          {!loaded ? (
            <div
              className="absolute inset-0 flex items-center justify-center"
              aria-hidden="true"
            >
              <span className="h-10 w-10 animate-spin rounded-full border-2 border-[#D6AE3C]/30 border-t-[#D6AE3C]" />
            </div>
          ) : null}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.src}
            alt={current.alt}
            width={current.width}
            height={current.height}
            className={`max-h-[75vh] max-w-[min(90vw,1040px)] rounded-xl object-contain shadow-[0_24px_80px_rgba(0,0,0,0.55)] transition-opacity duration-200 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
            style={{ width: "auto", height: "auto" }}
            onLoad={() => setLoaded(true)}
          />
        </div>

        <button
          type="button"
          aria-label="Next photo"
          onClick={goNext}
          className="absolute right-3 top-1/2 z-10 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(18,18,21,0.72)] text-[#FBF8F1] transition hover:bg-[#D6AE3C] hover:text-[#1A1405] md:flex"
        >
          <ChevronRight className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      <div
        className="mx-auto flex w-full max-w-[1248px] items-center justify-center gap-3 px-5 py-4 md:hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Previous photo"
          onClick={goPrev}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(18,18,21,0.85)] text-[#FBF8F1]"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Next photo"
          onClick={goNext}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(18,18,21,0.85)] text-[#FBF8F1]"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div
        ref={thumbStripRef}
        className="mx-auto hidden w-full max-w-[1248px] gap-2 overflow-x-auto px-5 pb-6 md:flex md:px-8"
        onClick={(event) => event.stopPropagation()}
      >
        {images.map((image, thumbIndex) => {
          const active = thumbIndex === index;
          return (
            <button
              key={image.id}
              type="button"
              data-active={active ? "true" : "false"}
              aria-label={`Go to photo ${thumbIndex + 1}`}
              aria-current={active ? "true" : undefined}
              onClick={() => onNavigate(thumbIndex)}
              className={`relative h-12 w-16 shrink-0 overflow-hidden rounded-md transition ${
                active
                  ? "border-2 border-[#D6AE3C] opacity-100"
                  : "border border-transparent opacity-55 hover:opacity-90"
              }`}
            >
              <Image
                src={image.src}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
                style={{ objectPosition: image.focus || "center" }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
