/**
 * Derive a display country/region label for international trips.
 * There is no country column in the DB yet — slug is the most reliable key.
 */
const COUNTRY_BY_SLUG = {
  bali: "Bali",
  kenya: "Kenya",
  "seychelles-island-discovery": "Seychelles",
  "georgia-armenia": "Georgia & Armenia",
  "south-africa": "South Africa",
  turkey: "Turkey",
  greece: "Greece",
  russia: "Russia",
  "south-korea": "South Korea",
  "balkan-cruise": "Balkans",
  "essence-of-laos": "Laos",
  "mauritius-island": "Mauritius",
  "yoga-by-the-backwaters": "India",
  "singapore-malaysia": "Singapore & Malaysia",
  "japan-christmas-new-year": "Japan",
};

export function deriveCountryLabel(trip) {
  const slug = String(trip?.slug || "").toLowerCase();
  if (COUNTRY_BY_SLUG[slug]) return COUNTRY_BY_SLUG[slug];

  const shortName = String(trip?.shortName || trip?.title || "")
    .replace(/\b(getaway|escape|sojourn|trails|island|festive|cruise|retreat|wellness)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  return shortName || "International";
}

export function buildCountryOptions(trips = []) {
  const counts = new Map();
  trips.forEach((trip) => {
    const label = trip.country || deriveCountryLabel(trip);
    counts.set(label, (counts.get(label) || 0) + 1);
  });

  return Array.from(counts.entries())
    .map(([label, count]) => ({
      value: label,
      label,
      count,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
