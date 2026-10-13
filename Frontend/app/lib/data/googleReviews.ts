import type { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { reviews as mockPlatformReviews } from "../../data/mockData";
import { travelerReviews as fallbackTravelerReviews } from "../../data/travelerReviews";

const CACHE_ID = "default";

export type CachedGoogleReview = {
  authorName: string;
  rating: number;
  text: string;
  relativeTime: string;
  profilePhotoUrl?: string;
  time?: number;
};

export type GooglePlaceUi = {
  rating: number;
  count: number;
  reviews: Array<{
    id: string;
    name: string;
    destination: string;
    image: string;
    rating: number;
    review: string;
    date: string;
    badge: string;
  }>;
  mapsUri: string | null;
  source: "google" | "fallback";
  placeName: string;
};

function asCachedReviews(value: Prisma.JsonValue | null | undefined): CachedGoogleReview[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is Prisma.JsonObject => Boolean(item) && typeof item === "object" && !Array.isArray(item))
    .map((item) => ({
      authorName: String(item.authorName || "").trim(),
      rating: Number(item.rating) || 0,
      text: String(item.text || "").trim(),
      relativeTime: String(item.relativeTime || "").trim(),
      profilePhotoUrl: item.profilePhotoUrl ? String(item.profilePhotoUrl) : undefined,
      time: item.time != null ? Number(item.time) : undefined,
    }))
    .filter((item) => item.authorName || item.text);
}

function mapFallbackReviews(): GooglePlaceUi["reviews"] {
  return fallbackTravelerReviews.map((review) => ({
    id: String(review.id),
    name: String(review.name),
    destination: String(review.destination),
    image: String(review.image),
    rating: Number(review.rating) || 5,
    review: String(review.review),
    date: String(review.date),
    badge: String(review.badge),
  }));
}

function fallbackUi(): GooglePlaceUi {
  const google = mockPlatformReviews.find((item) => item.platform === "Google");
  return {
    rating: google?.rating ?? 4.8,
    count: 300,
    reviews: mapFallbackReviews(),
    mapsUri: typeof google?.href === "string" ? google.href : null,
    source: "fallback",
    placeName: "Divas Sojourn",
  };
}

function toUiFromCache(row: {
  name: string;
  rating: number | null;
  userRatingsTotal: number | null;
  reviews: Prisma.JsonValue;
  mapsUri: string | null;
}): GooglePlaceUi {
  const cachedReviews = asCachedReviews(row.reviews);
  const googleFallback = mockPlatformReviews.find((item) => item.platform === "Google");

  if (!cachedReviews.length && row.rating == null && row.userRatingsTotal == null) {
    return fallbackUi();
  }

  return {
    rating: row.rating ?? googleFallback?.rating ?? 4.8,
    count: row.userRatingsTotal ?? 300,
    reviews: cachedReviews.length
      ? cachedReviews.map((review, index) => ({
          id: `google-${review.time ?? index}`,
          name: review.authorName || "Google reviewer",
          destination: "Google Review",
          image:
            review.profilePhotoUrl ||
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
          rating: Math.max(1, Math.min(5, Math.round(review.rating || 5))),
          review: review.text || "Great experience with Divas Sojourn.",
          date: review.relativeTime || "Recently",
          badge: "Google Review",
        }))
      : mapFallbackReviews(),
    mapsUri: row.mapsUri,
    source: "google",
    placeName: row.name || "Divas Sojourn",
  };
}

export async function getCachedGooglePlace() {
  return prisma.googlePlaceCache.findUnique({ where: { id: CACHE_ID } });
}

/** Google Places API fetch removed — reviews are static. Keeps cron/API shape. */
export async function refreshGooglePlaceIfStale(_options: { force?: boolean } = {}) {
  const existing = await getCachedGooglePlace();
  return { refreshed: false, cache: existing, skipped: "disabled" as const };
}

/** Returns cached DB row if present, otherwise static fallback. Never calls Google. */
export async function getGoogleReviewsForUi(): Promise<GooglePlaceUi> {
  try {
    const existing = await getCachedGooglePlace();
    if (existing) return toUiFromCache(existing);
    return fallbackUi();
  } catch (error) {
    console.error("getGoogleReviewsForUi failed", error);
    return fallbackUi();
  }
}

export function mergePlatformReviewsWithGoogle(
  google: Pick<GooglePlaceUi, "rating" | "count" | "source" | "mapsUri">,
) {
  return mockPlatformReviews.map((item) => {
    if (item.platform === "Google" && google.mapsUri) {
      return { ...item, href: google.mapsUri };
    }
    return item;
  });
}
