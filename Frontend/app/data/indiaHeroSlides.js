/**
 * India Trips page hero carousel slides.
 * Text/stats stay fixed on the page; only the background image + featured trip change.
 * TODO: Replace images with landscape photos, 1920×1080 or larger.
 */

import { indiaHeroImages } from "./heroImages";

export const INDIA_HERO_INTERVAL_MS = 4000;

/** Per-slide object-position overrides (1-based slide numbers in comments). */
const SLIDE_OBJECT_POSITION = {
  0: "center 72%", // 1st — group sits low in frame
  3: "center 70%", // 4th — group + temple sit low in frame
};

function stripCacheBust(src) {
  return String(src || "").split("?")[0];
}

/**
 * @param {{ shortName?: string, name?: string, slug?: string }[]} featuredTrips
 */
export function buildIndiaHeroSlides(featuredTrips = []) {
  return indiaHeroImages.map((image, index) => {
    const trip = featuredTrips.length
      ? featuredTrips[index % featuredTrips.length]
      : null;
    const name = trip?.shortName || trip?.name || "";

    return {
      image: stripCacheBust(image.src),
      alt: image.alt,
      objectPosition: SLIDE_OBJECT_POSITION[index] || "center 40%",
      // TODO: Confirm featured trip names/links if you want fixed pairings per slide.
      featuredTripName: name || "India trip",
      featuredTripLink: trip?.slug ? `/india-trips/${trip.slug}` : "/india-trips",
    };
  });
}
