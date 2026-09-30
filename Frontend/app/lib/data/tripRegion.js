/**
 * Derive a display region label for India trips.
 * There is no region column in the DB yet — slug is the most reliable key.
 */

const REGION_BY_SLUG = {
  "wonders-of-ladakh": "North India",
  "jyotirlingas-ellora-divine-historic-odyssey": "West India",
  "tawang-dirang-beyond": "Northeast",
  "north-east-cherry-blossom-trails": "Northeast",
  "coorg-ooty-coonoor-mysore": "South India",
  "north-east-trip": "Northeast",
  "rameshwaram-spiritual-gateway": "South India",
  "dwarka-somnath-divine-gujarat": "West India",
  "yoga-by-the-backwaters": "South India",
};

export function deriveRegionLabel(trip) {
  const slug = String(trip?.slug || "").toLowerCase();
  if (REGION_BY_SLUG[slug]) return REGION_BY_SLUG[slug];

  const haystack = `${trip?.shortName || ""} ${trip?.title || ""} ${trip?.route || ""}`.toLowerCase();
  if (/north\s*east|northeast|tawang|dirang|meghalaya|assam|sikkim/.test(haystack)) {
    return "Northeast";
  }
  if (/coorg|ooty|mysore|rameshwaram|kerala|madurai|tamil|karnataka|hampi/.test(haystack)) {
    return "South India";
  }
  if (/gujarat|dwarka|somnath|ellora|jyotirling|nashik|pune|maharashtra|goa|rajasthan/.test(haystack)) {
    return "West India";
  }
  if (/ladakh|leh|spiti|manali|kashmir|himachal|uttarakhand/.test(haystack)) {
    return "North India";
  }

  return "India";
}

export function buildRegionOptions(trips = []) {
  const counts = new Map();
  trips.forEach((trip) => {
    const label = trip.region || deriveRegionLabel(trip);
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
