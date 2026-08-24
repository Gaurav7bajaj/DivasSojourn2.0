import type { Prisma } from "@prisma/client";
import type {
  Trip,
  TripAccommodation,
  TripDestination,
  TripFinancialDetails,
  TripItineraryDay,
  UpcomingTripCard,
  TripNavItem,
} from "./types";

export function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function computeTripStatus(startDate: string): "upcoming" | "past" {
  return startDate >= todayIsoDate() ? "upcoming" : "past";
}

export function asStringArray(value: Prisma.JsonValue | null | undefined): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

export function asItinerary(value: Prisma.JsonValue | null | undefined): TripItineraryDay[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is Prisma.JsonObject => Boolean(item) && typeof item === "object" && !Array.isArray(item))
    .map((item) => ({
      day: Number(item.day) || 0,
      date: String(item.date || ""),
      title: String(item.title || ""),
      location: item.location ? String(item.location) : undefined,
      hotel: item.hotel ? String(item.hotel) : undefined,
      meals: item.meals ? String(item.meals) : undefined,
      description: item.description ? String(item.description) : undefined,
    }));
}

export function asAccommodations(value: Prisma.JsonValue | null | undefined): TripAccommodation[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is Prisma.JsonObject => Boolean(item) && typeof item === "object" && !Array.isArray(item))
    .map((item) => ({
      destination: String(item.destination || ""),
      hotel: String(item.hotel || ""),
      category: item.category ? String(item.category) : undefined,
      nights: (item.nights as number | string) ?? 0,
    }));
}

export function asFinancialDetails(
  value: Prisma.JsonValue | null | undefined,
): TripFinancialDetails {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const obj = value as Record<string, unknown>;
  return {
    company: obj.company ? String(obj.company) : undefined,
    accountNo: obj.accountNo ? String(obj.accountNo) : undefined,
    bankName: obj.bankName ? String(obj.bankName) : undefined,
    ifsc: obj.ifsc ? String(obj.ifsc) : undefined,
    phonePay: obj.phonePay ? String(obj.phonePay) : undefined,
    upi: obj.upi ? String(obj.upi) : undefined,
  };
}

type PrismaTripRow = {
  id: string;
  title: string;
  shortName: string;
  slug: string;
  destination: string;
  image: string;
  galleryImages: Prisma.JsonValue | null;
  pdfPath: string | null;
  sourcePdf: string | null;
  dates: string;
  startDate: string;
  endDate: string;
  duration: string;
  nights: number;
  days: number;
  pickupLocation: string;
  dropLocation: string;
  route: string;
  price: number;
  currency: string;
  earlyBirdPrice: number | null;
  singleSupplement: number | null;
  singleOccupancyPrice: number | null;
  soldOut: boolean;
  overview: string;
  highlights: Prisma.JsonValue | null;
  paymentConditions: string;
  notes: Prisma.JsonValue | null;
  itinerary: Prisma.JsonValue | null;
  accommodations: Prisma.JsonValue | null;
  inclusions: Prisma.JsonValue | null;
  exclusions: Prisma.JsonValue | null;
  financialDetails: Prisma.JsonValue | null;
  cancellationLinks: Prisma.JsonValue | null;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export function toTrip(row: PrismaTripRow): Trip {
  const destination =
    row.destination === "International" ? "International" : ("India" as TripDestination);

  return {
    id: row.id,
    title: row.title,
    shortName: row.shortName,
    slug: row.slug,
    destination,
    image: row.image,
    galleryImages: asStringArray(row.galleryImages),
    pdfPath: row.pdfPath ?? undefined,
    sourcePdf: row.sourcePdf ?? undefined,
    dates: row.dates,
    startDate: row.startDate,
    endDate: row.endDate,
    duration: row.duration,
    nights: row.nights,
    days: row.days,
    pickupLocation: row.pickupLocation,
    dropLocation: row.dropLocation,
    route: row.route,
    price: row.price,
    currency: row.currency,
    earlyBirdPrice: row.earlyBirdPrice ?? undefined,
    singleSupplement: row.singleSupplement ?? undefined,
    singleOccupancyPrice: row.singleOccupancyPrice ?? undefined,
    soldOut: row.soldOut,
    overview: row.overview,
    highlights: asStringArray(row.highlights),
    paymentConditions: row.paymentConditions,
    notes: asStringArray(row.notes),
    itinerary: asItinerary(row.itinerary),
    accommodations: asAccommodations(row.accommodations),
    inclusions: asStringArray(row.inclusions),
    exclusions: asStringArray(row.exclusions),
    financialDetails: asFinancialDetails(row.financialDetails),
    cancellationLinks: asStringArray(row.cancellationLinks),
    published: row.published,
    status: computeTripStatus(row.startDate),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function toUpcomingTripCard(trip: Trip): UpcomingTripCard {
  return {
    id: trip.id,
    title: trip.title,
    slug: trip.slug,
    image: trip.image,
    destination: trip.destination,
    duration: { nights: trip.nights, days: trip.days },
    departure: `${trip.pickupLocation} / ${trip.dropLocation}`,
    startDate: trip.startDate,
    endDate: trip.endDate,
    batches: 1,
    originalPrice: trip.earlyBirdPrice ? trip.price : null,
    currentPrice: trip.earlyBirdPrice || trip.price,
    description: trip.overview,
    soldOut: trip.soldOut,
  };
}

export function toTripNavItem(trip: Trip): TripNavItem {
  const base: TripNavItem = {
    id: trip.id,
    title: trip.title,
    shortName: trip.shortName,
    slug: trip.slug,
    image: trip.image,
    dates: trip.dates,
    duration: trip.duration,
    price: trip.price,
    description: trip.overview,
    featured: trip.status === "upcoming",
  };

  if (trip.destination === "International") {
    return {
      ...base,
      name: trip.shortName,
      subtitle: trip.title,
      startingPrice: trip.earlyBirdPrice || trip.price,
      duration: `${trip.days} days`,
      badge: trip.status === "upcoming" ? "Upcoming" : "Past",
    };
  }

  return base;
}

export function buildMonthsFromTrips(trips: UpcomingTripCard[]) {
  return Array.from(
    new Map(
      trips.map((trip) => {
        const value = trip.startDate.slice(0, 7);
        const date = new Date(`${value}-01T00:00:00`);
        const label = date.toLocaleDateString("en-IN", {
          month: "short",
          year: "2-digit",
        });
        return [value, { label: label.replace(" ", "-"), value }];
      }),
    ).values(),
  ).sort((a, b) => a.value.localeCompare(b.value));
}
