/**
 * Trip data-access layer (Prisma).
 * Function signatures stay stable for admin UI, APIs, and public pages.
 */

import { slugify } from "../slugify";
import { prisma } from "./prisma";
import { toTrip, toUpcomingTripCard, toTripNavItem } from "./tripMappers";
import type {
  Trip,
  TripCreateInput,
  TripDestination,
  TripUpdateInput,
  UpcomingTripCard,
  TripNavItem,
} from "./types";
import { deleteUploadedFileIfLocal } from "../uploads";

async function ensureUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
  let candidate = baseSlug || "untitled";
  let suffix = 2;

  while (true) {
    const existing = await prisma.trip.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === excludeId) {
      return candidate;
    }
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

function jsonOrUndefined<T>(value: T | undefined): T | undefined {
  return value === undefined ? undefined : value;
}

export async function getTrips(): Promise<Trip[]> {
  const rows = await prisma.trip.findMany({ orderBy: { startDate: "asc" } });
  return rows.map(toTrip);
}

export async function getPublishedTrips(): Promise<Trip[]> {
  const rows = await prisma.trip.findMany({
    where: { published: true },
    orderBy: { startDate: "asc" },
  });
  return rows.map(toTrip);
}

export async function getUpcomingTrips(): Promise<UpcomingTripCard[]> {
  const trips = await getPublishedTrips();
  return trips.filter((trip) => trip.status === "upcoming").map(toUpcomingTripCard);
}

export async function getUpcomingTripsByDestination(
  destination: TripDestination,
): Promise<UpcomingTripCard[]> {
  const trips = await getUpcomingTrips();
  return trips.filter((trip) => trip.destination === destination);
}

export async function getTripBySlug(slug: string): Promise<Trip | null> {
  const row = await prisma.trip.findUnique({ where: { slug } });
  return row ? toTrip(row) : null;
}

export async function getTripById(id: string): Promise<Trip | null> {
  const row = await prisma.trip.findUnique({ where: { id } });
  return row ? toTrip(row) : null;
}

export async function getTripNavItems(destination?: TripDestination): Promise<TripNavItem[]> {
  const trips = await getPublishedTrips();
  const filtered = destination
    ? trips.filter((trip) => trip.destination === destination)
    : trips;
  return filtered.map(toTripNavItem);
}

export async function createTrip(input: TripCreateInput): Promise<Trip> {
  const slug = await ensureUniqueSlug(slugify(input.slug || input.title));
  const nights = input.nights ?? 0;
  const days = input.days ?? (nights ? nights + 1 : 0);

  const row = await prisma.trip.create({
    data: {
      title: input.title.trim(),
      shortName: input.shortName.trim(),
      slug,
      destination: input.destination,
      image: input.image?.trim() || "",
      galleryImages: input.galleryImages ?? [],
      pdfPath: input.pdfPath || null,
      sourcePdf: input.sourcePdf || null,
      dates: input.dates?.trim() || "",
      startDate: input.startDate,
      endDate: input.endDate,
      duration: input.duration?.trim() || `${String(nights).padStart(2, "0")} Nights / ${String(days).padStart(2, "0")} Days`,
      nights,
      days,
      pickupLocation: input.pickupLocation?.trim() || "",
      dropLocation: input.dropLocation?.trim() || "",
      route: input.route?.trim() || "",
      price: input.price ?? 0,
      currency: input.currency || "INR",
      earlyBirdPrice: input.earlyBirdPrice ?? null,
      singleSupplement: input.singleSupplement ?? null,
      singleOccupancyPrice: input.singleOccupancyPrice ?? null,
      soldOut: input.soldOut ?? false,
      overview: input.overview?.trim() || "",
      highlights: input.highlights ?? [],
      paymentConditions: input.paymentConditions?.trim() || "",
      notes: input.notes ?? [],
      itinerary: input.itinerary ?? [],
      accommodations: input.accommodations ?? [],
      inclusions: input.inclusions ?? [],
      exclusions: input.exclusions ?? [],
      financialDetails: input.financialDetails ?? {},
      cancellationLinks: input.cancellationLinks ?? [],
      published: input.published ?? true,
    },
  });

  return toTrip(row);
}

export async function updateTrip(id: string, input: TripUpdateInput): Promise<Trip | null> {
  const existing = await prisma.trip.findUnique({ where: { id } });
  if (!existing) return null;

  const nextSlug =
    input.slug !== undefined || input.title !== undefined
      ? await ensureUniqueSlug(slugify(input.slug || input.title || existing.slug), id)
      : existing.slug;

  const nights = input.nights !== undefined ? input.nights : existing.nights;
  const days = input.days !== undefined ? input.days : existing.days;

  const row = await prisma.trip.update({
    where: { id },
    data: {
      title: input.title !== undefined ? input.title.trim() : undefined,
      shortName: input.shortName !== undefined ? input.shortName.trim() : undefined,
      slug: nextSlug,
      destination: input.destination,
      image: input.image !== undefined ? input.image.trim() : undefined,
      galleryImages: jsonOrUndefined(input.galleryImages),
      pdfPath: input.pdfPath === undefined ? undefined : input.pdfPath || null,
      sourcePdf: input.sourcePdf === undefined ? undefined : input.sourcePdf || null,
      dates: input.dates !== undefined ? input.dates.trim() : undefined,
      startDate: input.startDate,
      endDate: input.endDate,
      duration: input.duration !== undefined ? input.duration.trim() : undefined,
      nights: input.nights,
      days: input.days,
      pickupLocation: input.pickupLocation !== undefined ? input.pickupLocation.trim() : undefined,
      dropLocation: input.dropLocation !== undefined ? input.dropLocation.trim() : undefined,
      route: input.route !== undefined ? input.route.trim() : undefined,
      price: input.price,
      currency: input.currency,
      earlyBirdPrice: input.earlyBirdPrice === undefined ? undefined : input.earlyBirdPrice,
      singleSupplement: input.singleSupplement === undefined ? undefined : input.singleSupplement,
      singleOccupancyPrice:
        input.singleOccupancyPrice === undefined ? undefined : input.singleOccupancyPrice,
      soldOut: input.soldOut,
      overview: input.overview !== undefined ? input.overview.trim() : undefined,
      highlights: jsonOrUndefined(input.highlights),
      paymentConditions:
        input.paymentConditions !== undefined ? input.paymentConditions.trim() : undefined,
      notes: jsonOrUndefined(input.notes),
      itinerary: jsonOrUndefined(input.itinerary),
      accommodations: jsonOrUndefined(input.accommodations),
      inclusions: jsonOrUndefined(input.inclusions),
      exclusions: jsonOrUndefined(input.exclusions),
      financialDetails: jsonOrUndefined(input.financialDetails),
      cancellationLinks: jsonOrUndefined(input.cancellationLinks),
      published: input.published,
    },
  });

  // silence unused if duration auto not needed
  void nights;
  void days;

  return toTrip(row);
}

export async function deleteTrip(id: string): Promise<boolean> {
  const existing = await prisma.trip.findUnique({ where: { id } });
  if (!existing) return false;

  try {
    await prisma.trip.delete({ where: { id } });
  } catch {
    return false;
  }

  if (existing.image?.startsWith("/uploads/")) {
    await deleteUploadedFileIfLocal(existing.image);
  }
  if (existing.pdfPath?.startsWith("/uploads/")) {
    await deleteUploadedFileIfLocal(existing.pdfPath);
  }
  const gallery = Array.isArray(existing.galleryImages) ? existing.galleryImages : [];
  for (const url of gallery) {
    if (typeof url === "string" && url.startsWith("/uploads/")) {
      await deleteUploadedFileIfLocal(url);
    }
  }

  return true;
}
