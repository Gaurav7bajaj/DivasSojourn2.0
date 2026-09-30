"use client";

import CategoryHero from "../shared/CategoryHero";

/** India Trips page hero — thin wrapper around shared CategoryHero. */
export default function IndiaTripsHeader({
  slides = [],
  upcomingCount = 0,
  startingPriceLabel = "₹—",
}) {
  return (
    <CategoryHero
      slides={slides}
      upcomingCount={upcomingCount}
      startingPriceLabel={startingPriceLabel}
      breadcrumbLabel="India Trips"
      eyebrow="Explore"
      title="India"
      titleItalic="trips"
      description="Mountains, coastlines, deserts and old cities — explored in small groups of women who become friends along the way."
      ariaLabel="India Trips"
      titleClassName="md:text-[clamp(3rem,6vw,5.25rem)]"
    />
  );
}
