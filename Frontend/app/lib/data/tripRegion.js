/**
 * Derive a display region label for India trips.
 * There is no region column in the DB yet — slug is the most reliable key.
 */

const REGION_BY_SLUG = {
  "wonders-of-ladakh": "North India",
  "jyotirlingas-ellora-divine-historic-odyssey": "West India",
  "tawang-dirang-beyond": "Northeast",
  "tawang-dirang-2027": "Northeast",
  "north-east-cherry-blossom-trails": "Northeast",
  "coorg-ooty-coonoor-mysore": "South India",
  "north-east-trip": "Northeast",
  "rameshwaram-spiritual-gateway": "South India",
  "dwarka-somnath-divine-gujarat": "West India",
  "yoga-by-the-backwaters": "South India",
  "rann-of-kutch-2027": "West India",
  "pondicherry-mahabalipuram-2027": "South India",
  "jagannath-puri-2027": "East India",
  "varanasi-prayagraj-ayodhya-2027": "North India",
  "ujjain-2027": "Central India",
  "tripura-mizoram-2027": "Northeast",
  "gateway-to-ladakh-2027": "North India",
  "guwahati-shillong-cherrapunji-2027": "Northeast",
  "spiti-mystique-2027": "North India",
};

export function deriveRegionLabel(trip) {
  const slug = String(trip?.slug || "").toLowerCase();
  if (REGION_BY_SLUG[slug]) return REGION_BY_SLUG[slug];

  const haystack = `${trip?.shortName || ""} ${trip?.title || ""} ${trip?.route || ""}`.toLowerCase();
  if (/north\s*east|northeast|tawang|dirang|meghalaya|assam|sikkim|tripura|mizoram|guwahati|shillong|cherrapunji/.test(haystack)) {
    return "Northeast";
  }
  if (/coorg|ooty|mysore|rameshwaram|kerala|madurai|tamil|karnataka|hampi|pondicherry|mahabalipuram|chennai/.test(haystack)) {
    return "South India";
  }
  if (/gujarat|dwarka|somnath|ellora|jyotirling|nashik|pune|maharashtra|goa|rajasthan|kutch|dholavira|bhuj|ahmedabad/.test(haystack)) {
    return "West India";
  }
  if (/ladakh|leh|spiti|manali|kashmir|himachal|uttarakhand|varanasi|prayagraj|ayodhya/.test(haystack)) {
    return "North India";
  }
  if (/puri|jagannath|konark|bhubaneswar|odisha|orissa/.test(haystack)) {
    return "East India";
  }
  if (/ujjain|mahakal|indore|omkareshwar|madhya/.test(haystack)) {
    return "Central India";
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
