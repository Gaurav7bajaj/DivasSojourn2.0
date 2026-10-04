/**
 * Static metadata for known gallery assets (dimensions + destination).
 * Destinations inferred from path/caption; flagged unknowns listed at bottom of file.
 */

export const GALLERY_DIMENSIONS = {
  "/heroes/home/homeHero1.webp": { width: 1600, height: 1200 },
  "/heroes/home/homeHero2.webp": { width: 4284, height: 5712 },
  "/heroes/home/homeHero3.webp": { width: 4284, height: 5712 },
  "/heroes/home/homeHero4.webp": { width: 3024, height: 4032 },
  "/heroes/home/HeroHome5.webp": { width: 3024, height: 4032 },
  "/heroes/home/HeroHome6.webp": { width: 3024, height: 4032 },
  "/heroes/home/HeroHome7.webp": { width: 3024, height: 3137 },
  "/heroes/home/upcomingCommunityTrips-v2.jpg": { width: 2000, height: 1333 },
  "/heroes/india/indianHero1.webp": { width: 2400, height: 1800 },
  "/heroes/india/indianHero2.webp": { width: 2400, height: 1800 },
  "/heroes/india/indianHero3.webp": { width: 2400, height: 1800 },
  "/heroes/india/indianHero4.webp": { width: 2400, height: 1800 },
  "/heroes/india/indianHero5.webp": { width: 2400, height: 1800 },
  "/heroes/international/internationalHero1.webp": { width: 2268, height: 1891 },
  "/heroes/international/internationalHero2.webp": { width: 2400, height: 1800 },
  "/heroes/international/internationalHero3.webp": { width: 3024, height: 2398 },
  "/heroes/international/internationalHero4.webp": { width: 2400, height: 1800 },
  "/heroes/international/internationalHero5.webp": { width: 2400, height: 1800 },
  "/heroes/calendar/calendarHero1.webp": { width: 2400, height: 1600 },
  "/heroes/calendar/calendarHero2.webp": { width: 2400, height: 1600 },
  "/heroes/calendar/calendarHero3.webp": { width: 2400, height: 1600 },
  "/heroes/calendar/calendarHero4.webp": { width: 2400, height: 1600 },
  "/heroes/calendar/calendarHero5.webp": { width: 2400, height: 1600 },
  "/heroes/calendar/calendarHero6.webp": { width: 2400, height: 1600 },
  "/heroes/calendar/calendarHero7.webp": { width: 2400, height: 1600 },
  "/uploads/gallery/d312cec4-ab03-424d-b61f-ce1c63e02a7c.jpg": { width: 2560, height: 1440 },
};

/** Place labels for filter chips — keyed by imageUrl */
export const GALLERY_DESTINATIONS = {
  "/heroes/india/indianHero1.webp": "India",
  "/heroes/india/indianHero2.webp": "India",
  "/heroes/india/indianHero3.webp": "India",
  "/heroes/india/indianHero4.webp": "India",
  "/heroes/india/indianHero5.webp": "India",
  // Calendar heroes inferred from subject (traditional attire / temple / tropical / mountains)
  "/heroes/calendar/calendarHero1.webp": "South Korea",
  "/heroes/calendar/calendarHero2.webp": "India",
  "/heroes/calendar/calendarHero3.webp": "Mauritius",
  "/heroes/calendar/calendarHero5.webp": "India",
  "/heroes/calendar/calendarHero7.webp": "India",
};

/**
 * Could not confidently map a specific place — fall back to a broad label:
 * - Home heroes → "Community"
 * - International folder + calendar 4/6 → "International"
 * - Uploaded gallery file without caption → "Community"
 */
export const GALLERY_DESTINATION_FALLBACKS = {
  "/heroes/home/homeHero1.webp": "Community",
  "/heroes/home/homeHero2.webp": "Community",
  "/heroes/home/homeHero3.webp": "Community",
  "/heroes/home/homeHero4.webp": "Community",
  "/heroes/home/HeroHome5.webp": "Community",
  "/heroes/home/HeroHome6.webp": "Community",
  "/heroes/home/HeroHome7.webp": "Community",
  "/heroes/home/upcomingCommunityTrips-v2.jpg": "Community",
  "/heroes/international/internationalHero1.webp": "International",
  "/heroes/international/internationalHero2.webp": "International",
  "/heroes/international/internationalHero3.webp": "International",
  "/heroes/international/internationalHero4.webp": "International",
  "/heroes/international/internationalHero5.webp": "International",
  "/heroes/calendar/calendarHero4.webp": "International",
  "/heroes/calendar/calendarHero6.webp": "International",
  "/uploads/gallery/d312cec4-ab03-424d-b61f-ce1c63e02a7c.jpg": "Community",
};

/** Optional object-position hints for cropped contexts (About teaser, lightbox thumbs). */
export const GALLERY_FOCUS = {
  "/heroes/home/homeHero1.webp": "center 35%",
  "/heroes/home/upcomingCommunityTrips-v2.jpg": "center 40%",
  "/heroes/calendar/calendarHero5.webp": "center 30%",
};

export function resolveGalleryDestination(imageUrl, category, caption) {
  if (GALLERY_DESTINATIONS[imageUrl]) return GALLERY_DESTINATIONS[imageUrl];
  if (GALLERY_DESTINATION_FALLBACKS[imageUrl]) return GALLERY_DESTINATION_FALLBACKS[imageUrl];

  const haystack = `${category || ""} ${caption || ""} ${imageUrl}`.toLowerCase();
  if (haystack.includes("india") || haystack.includes("/india/")) return "India";
  if (haystack.includes("korea") || haystack.includes("hanbok")) return "South Korea";
  if (haystack.includes("mauritius") || haystack.includes("island")) return "Mauritius";
  if (haystack.includes("kenya") || haystack.includes("safari")) return "Kenya";
  if (haystack.includes("international") || haystack.includes("/international/")) {
    return "International";
  }
  return "Community";
}

export function resolveGalleryDimensions(imageUrl) {
  return GALLERY_DIMENSIONS[imageUrl] || { width: 1600, height: 1200 };
}

export function resolveGalleryFocus(imageUrl) {
  return GALLERY_FOCUS[imageUrl] || "center";
}
