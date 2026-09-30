/**
 * Derive a display country/region label for international trips.
 * There is no country column in the DB yet — slug is the most reliable key.
 */
const COUNTRY_BY_SLUG = {
  bali: "Bali",
  kenya: "Kenya",
  "kenya-trails-2027": "Kenya",
  "seychelles-island-discovery": "Seychelles",
  "georgia-armenia": "Georgia & Armenia",
  "georgia-armenia-2027": "Georgia & Armenia",
  "south-africa": "South Africa",
  turkey: "Turkey",
  greece: "Greece",
  russia: "Russia",
  "russia-northern-lights-2027": "Russia",
  "south-korea": "South Korea",
  "balkan-cruise": "Balkans",
  "essence-of-laos": "Laos",
  "mauritius-island": "Mauritius",
  "mauritius-bliss-2027": "Mauritius",
  "yoga-by-the-backwaters": "India",
  "singapore-malaysia": "Singapore & Malaysia",
  "japan-christmas-new-year": "Japan",
  "vietnam-wonders-2026": "Vietnam",
  "sri-lanka-soul-2027": "Sri Lanka",
  "taiwan-cherry-blossom-2027": "Taiwan",
  "china-unveiled-2027": "China",
  "croatia-slovenia-2027": "Croatia & Slovenia",
  "scotland-reverie-2027": "Scotland",
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
