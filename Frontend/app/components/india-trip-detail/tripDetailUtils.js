/** Shared helpers for trip detail redesign (data-driven, no hardcoding). */

export function splitTitleForHighlight(title, highlightWords) {
  const full = String(title || "").trim();
  if (!full) return { lead: "", emphasis: "" };

  const words = Array.isArray(highlightWords)
    ? highlightWords.map((w) => String(w).trim()).filter(Boolean)
    : [];

  if (words.length) {
    const needle = words.join(" ");
    const idx = full.toLowerCase().lastIndexOf(needle.toLowerCase());
    if (idx >= 0) {
      return {
        lead: full.slice(0, idx).trimEnd(),
        emphasis: full.slice(idx).trim(),
      };
    }
  }

  const parts = full.split(/\s+/);
  if (parts.length === 1) return { lead: "", emphasis: full };
  return {
    lead: parts.slice(0, -1).join(" "),
    emphasis: parts[parts.length - 1],
  };
}

export function formatInr(amount) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    Number(amount) || 0,
  );
}

export function formatUsdApprox(amountInr) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(
    Math.round((Number(amountInr) || 0) / 100),
  );
}

export function formatDepartureRange(startDate, endDate, fallbackDates) {
  if (!startDate || !endDate) return fallbackDates || "";
  try {
    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);
    const fmt = new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    return `${fmt.format(start)} – ${fmt.format(end)}`;
  } catch {
    return fallbackDates || `${startDate} – ${endDate}`;
  }
}

export function getTripCategoryLabel(trip) {
  return trip?.destination === "International" ? "International" : "India";
}

export function getTripPlaceLabel(trip) {
  if (trip?.destination === "International") {
    return trip.country || trip.shortName || "Abroad";
  }
  return trip.region || "India";
}

export function getDisplayPrice(trip) {
  if (trip?.earlyBirdPrice && trip.earlyBirdPrice > 0) return trip.earlyBirdPrice;
  return trip?.price || 0;
}

export function getTripGalleryPhotos(trip) {
  const gallery = Array.isArray(trip?.galleryImages)
    ? trip.galleryImages.filter(Boolean)
    : [];
  const hero = trip?.image ? [trip.image] : [];
  const unique = [...new Set([...gallery, ...hero])];
  return unique.map((src, index) => ({
    id: `${trip.slug || "trip"}-photo-${index}`,
    src,
    alt: trip.highlights?.[index] || `${trip.title} photo ${index + 1}`,
    destination: getTripPlaceLabel(trip),
    caption: trip.highlights?.[index] || trip.shortName || trip.title,
  }));
}

export function getDepartures(trip) {
  const seatsLeft =
    typeof trip?.seatsLeft === "number"
      ? trip.seatsLeft
      : typeof trip?.seatsRemaining === "number"
        ? trip.seatsRemaining
        : null;

  return [
    {
      id: `${trip.slug}-dep-1`,
      startDate: trip.startDate,
      endDate: trip.endDate,
      label: formatDepartureRange(trip.startDate, trip.endDate, trip.dates),
      soldOut: Boolean(trip.soldOut),
      seatsLeft,
    },
  ];
}
