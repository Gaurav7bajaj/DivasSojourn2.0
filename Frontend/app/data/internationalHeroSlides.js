/**
 * International Trips page hero carousel slides.
 * Text/stats stay fixed on the page; only the background image + featured trip change.
 */

import { internationalHeroImages } from "./heroImages";

export const INTERNATIONAL_HERO_INTERVAL_MS = 4000;

function stripCacheBust(src) {
  return String(src || "").split("?")[0];
}

/**
 * @param {{ shortName?: string, name?: string, title?: string, slug?: string }[]} featuredTrips
 * next upcoming international departures (prefer startDate-sorted cards)
 */
export function buildInternationalHeroSlides(featuredTrips = []) {
  return internationalHeroImages.map((image, index) => {
    const trip = featuredTrips.length
      ? featuredTrips[index % featuredTrips.length]
      : null;
    const name = trip?.shortName || trip?.name || trip?.title || "";

    return {
      image: stripCacheBust(image.src),
      alt: image.alt,
      objectPosition: "center 40%",
      featuredTripName: name || "International trip",
      featuredTripLink: trip?.slug
        ? `/international-trips/${trip.slug}`
        : "/international-trips",
    };
  });
}
