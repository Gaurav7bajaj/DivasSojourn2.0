import type { TripCreateInput, TripDestination } from "@/app/lib/data/types";

export function parseTripPayload(raw: string): TripCreateInput | { error: string } {
  try {
    const data = JSON.parse(raw) as Record<string, unknown>;
    const title = String(data.title || "").trim();
    const shortName = String(data.shortName || "").trim();
    const startDate = String(data.startDate || "").trim();
    const endDate = String(data.endDate || "").trim();
    const destination = String(data.destination || "").trim();

    if (!title || !shortName || !startDate || !endDate) {
      return { error: "Title, short name, start date, and end date are required." };
    }
    if (destination !== "India" && destination !== "International") {
      return { error: "Destination must be India or International." };
    }

    const toNum = (value: unknown) => {
      if (value === null || value === undefined || value === "") return undefined;
      const n = Number(value);
      return Number.isFinite(n) ? n : undefined;
    };

    return {
      title,
      shortName,
      slug: data.slug ? String(data.slug).trim() : undefined,
      destination: destination as TripDestination,
      image: data.image ? String(data.image) : undefined,
      galleryImages: Array.isArray(data.galleryImages)
        ? data.galleryImages.map(String)
        : undefined,
      pdfPath: data.pdfPath ? String(data.pdfPath) : undefined,
      sourcePdf: data.sourcePdf ? String(data.sourcePdf) : undefined,
      dates: data.dates ? String(data.dates) : undefined,
      startDate,
      endDate,
      duration: data.duration ? String(data.duration) : undefined,
      nights: toNum(data.nights),
      days: toNum(data.days),
      pickupLocation: data.pickupLocation ? String(data.pickupLocation) : undefined,
      dropLocation: data.dropLocation ? String(data.dropLocation) : undefined,
      route: data.route ? String(data.route) : undefined,
      price: toNum(data.price) ?? 0,
      currency: data.currency ? String(data.currency) : "INR",
      earlyBirdPrice: toNum(data.earlyBirdPrice) ?? null,
      singleSupplement: toNum(data.singleSupplement) ?? null,
      singleOccupancyPrice: toNum(data.singleOccupancyPrice) ?? null,
      soldOut: Boolean(data.soldOut),
      overview: data.overview ? String(data.overview) : undefined,
      highlights: Array.isArray(data.highlights) ? data.highlights.map(String) : [],
      paymentConditions: data.paymentConditions ? String(data.paymentConditions) : undefined,
      notes: Array.isArray(data.notes) ? data.notes.map(String) : [],
      itinerary: Array.isArray(data.itinerary) ? (data.itinerary as TripCreateInput["itinerary"]) : [],
      accommodations: Array.isArray(data.accommodations)
        ? (data.accommodations as TripCreateInput["accommodations"])
        : [],
      inclusions: Array.isArray(data.inclusions) ? data.inclusions.map(String) : [],
      exclusions: Array.isArray(data.exclusions) ? data.exclusions.map(String) : [],
      financialDetails:
        data.financialDetails && typeof data.financialDetails === "object"
          ? (data.financialDetails as TripCreateInput["financialDetails"])
          : {},
      cancellationLinks: Array.isArray(data.cancellationLinks)
        ? data.cancellationLinks.map(String)
        : [],
      published: data.published !== false,
    };
  } catch {
    return { error: "Invalid trip payload." };
  }
}
