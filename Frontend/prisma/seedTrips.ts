import { PrismaClient } from "@prisma/client";
import { indiaTripDetails } from "../app/data/indiaTripDetails.js";
import { combinedInternationalTripDetails } from "../app/data/internationalTripDetails.js";

type LegacyTrip = Record<string, unknown>;

function mapLegacyTrip(trip: LegacyTrip, destination: "India" | "International", idPrefix: string) {
  const legacyId = trip.id;
  return {
    id: `${idPrefix}-${legacyId}`,
    title: String(trip.title || ""),
    shortName: String(trip.shortName || trip.title || ""),
    slug: String(trip.slug || ""),
    destination,
    image: String(trip.image || ""),
    galleryImages: Array.isArray(trip.galleryImages) ? trip.galleryImages : [],
    pdfPath: trip.pdfPath ? String(trip.pdfPath) : null,
    sourcePdf: trip.sourcePdf ? String(trip.sourcePdf) : null,
    dates: String(trip.dates || ""),
    startDate: String(trip.startDate || ""),
    endDate: String(trip.endDate || ""),
    duration: String(trip.duration || ""),
    nights: Number(trip.nights) || 0,
    days: Number(trip.days) || 0,
    pickupLocation: String(trip.pickupLocation || ""),
    dropLocation: String(trip.dropLocation || ""),
    route: String(trip.route || ""),
    price: Number(trip.price) || 0,
    currency: String(trip.currency || "INR"),
    earlyBirdPrice: trip.earlyBirdPrice != null ? Number(trip.earlyBirdPrice) : null,
    singleSupplement: trip.singleSupplement != null ? Number(trip.singleSupplement) : null,
    singleOccupancyPrice:
      trip.singleOccupancyPrice != null ? Number(trip.singleOccupancyPrice) : null,
    soldOut: Boolean(trip.soldOut),
    overview: String(trip.overview || ""),
    highlights: Array.isArray(trip.highlights) ? trip.highlights : [],
    paymentConditions: String(trip.paymentConditions || ""),
    notes: Array.isArray(trip.notes) ? trip.notes : [],
    itinerary: Array.isArray(trip.itinerary) ? trip.itinerary : [],
    accommodations: Array.isArray(trip.accommodations) ? trip.accommodations : [],
    inclusions: Array.isArray(trip.inclusions) ? trip.inclusions : [],
    exclusions: Array.isArray(trip.exclusions) ? trip.exclusions : [],
    financialDetails:
      trip.financialDetails && typeof trip.financialDetails === "object"
        ? trip.financialDetails
        : {},
    cancellationLinks: Array.isArray(trip.cancellationLinks) ? trip.cancellationLinks : [],
    published: true,
  };
}

export async function seedTrips(prisma: PrismaClient) {
  const india = (indiaTripDetails as LegacyTrip[]).map((trip) =>
    mapLegacyTrip(trip, "India", "india"),
  );
  const international = (combinedInternationalTripDetails as LegacyTrip[]).map((trip) =>
    mapLegacyTrip(trip, "International", "intl"),
  );

  const all = [...india, ...international];

  for (const trip of all) {
    await prisma.trip.upsert({
      where: { slug: trip.slug },
      update: {},
      create: trip,
    });
  }

  return all.length;
}
