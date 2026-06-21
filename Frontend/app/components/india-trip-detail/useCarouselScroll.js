"use client";

import { useCallback, useEffect, useState } from "react";

export function useCarouselScroll(scrollRef, itemCount) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el || itemCount === 0) return;

    const children = Array.from(el.children);
    let closest = 0;
    let minDist = Infinity;

    children.forEach((child, index) => {
      const dist = Math.abs(child.offsetLeft - el.scrollLeft);
      if (dist < minDist) {
        minDist = dist;
        closest = index;
      }
    });

    const firstChild = children[0];
    const childWidth = firstChild ? firstChild.offsetWidth + 20 : el.clientWidth;
    const slots = Math.max(1, Math.floor(el.clientWidth / childWidth));

    setActiveIndex(closest);
    setVisibleCount(slots);
    setAtStart(el.scrollLeft <= 8);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  }, [scrollRef, itemCount]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [scrollRef, updateScrollState]);

  const scrollBy = useCallback(
    (direction) => {
      const el = scrollRef.current;
      if (!el) return;

      const children = Array.from(el.children);
      const nextIndex = Math.max(0, Math.min(itemCount - 1, activeIndex + direction));
      const target = children[nextIndex];

      if (target) {
        target.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
      }
    },
    [activeIndex, itemCount, scrollRef],
  );

  const rangeStart = activeIndex + 1;
  const rangeEnd = Math.min(activeIndex + visibleCount, itemCount);

  return { activeIndex, visibleCount, rangeStart, rangeEnd, atStart, atEnd, scrollBy };
}

export function getGalleryItems(trip) {
  const images = trip.galleryImages?.length ? trip.galleryImages : [trip.image];
  const captions =
    trip.galleryCaptions ||
    trip.highlights?.slice(0, images.length) ||
    images.map((_, index) => `${trip.shortName} — Moment ${index + 1}`);

  return images.map((src, index) => ({
    src,
    caption: captions[index] || `${trip.shortName} — Moment ${index + 1}`,
  }));
}
