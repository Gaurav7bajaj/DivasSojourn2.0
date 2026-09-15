import type { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { reviews as mockPlatformReviews } from "../../data/mockData";
import { travelerReviews as fallbackTravelerReviews } from "../../data/travelerReviews";

const CACHE_ID = "default";
const STALE_MS = 24 * 60 * 60 * 1000;

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

type PlacesDetailsResult = {
  name?: string;
  rating?: number;
  user_ratings_total?: number;
  url?: string;
  reviews?: Array<{
    author_name?: string;
    rating?: number;
    text?: string;
    relative_time_description?: string;
    profile_photo_url?: string;
    time?: number;
  }>;
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
    name: review.name,
    destination: review.destination,
    image: review.image,
    rating: review.rating,
    review: review.review,
    date: review.date,
    badge: review.badge,
  }));
}

function fallbackUi(): GooglePlaceUi {
  const google = mockPlatformReviews.find((item) => item.platform === "Google");
  return {
    rating: google?.rating ?? 4.9,
    count: google?.count ?? 0,
    reviews: mapFallbackReviews(),
    mapsUri: null,
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
    rating: row.rating ?? googleFallback?.rating ?? 4.9,
    count: row.userRatingsTotal ?? googleFallback?.count ?? 0,
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

async function fetchPlaceDetailsFromGoogle(): Promise<PlacesDetailsResult | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY?.trim();
  const placeId = process.env.GOOGLE_PLACE_ID?.trim();

  if (!apiKey || !placeId) {
    return null;
  }

  const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
  url.searchParams.set("place_id", placeId);
  url.searchParams.set("fields", "name,rating,user_ratings_total,reviews,url");
  url.searchParams.set("key", apiKey);

  const response = await fetch(url.toString(), { cache: "no-store" });
  if (!response.ok) {
    console.error("Google Places Details HTTP error", response.status);
    return null;
  }

  const payload = (await response.json()) as {
    status?: string;
    error_message?: string;
    result?: PlacesDetailsResult;
  };

  if (payload.status !== "OK" || !payload.result) {
    console.error("Google Places Details failed", payload.status, payload.error_message);
    return null;
  }

  return payload.result;
}

export async function refreshGooglePlaceIfStale(options: { force?: boolean } = {}) {
  const placeId = process.env.GOOGLE_PLACE_ID?.trim() || "";
  const existing = await getCachedGooglePlace();
  const isStale =
    !existing || Date.now() - new Date(existing.fetchedAt).getTime() >= STALE_MS;

  if (!options.force && !isStale) {
    return { refreshed: false, cache: existing };
  }

  if (!process.env.GOOGLE_PLACES_API_KEY?.trim() || !placeId) {
    return { refreshed: false, cache: existing, skipped: "missing_env" as const };
  }

  const result = await fetchPlaceDetailsFromGoogle();
  if (!result) {
    return { refreshed: false, cache: existing, skipped: "fetch_failed" as const };
  }

  const reviews: CachedGoogleReview[] = (result.reviews || []).map((review) => ({
    authorName: String(review.author_name || "").trim(),
    rating: Number(review.rating) || 0,
    text: String(review.text || "").trim(),
    relativeTime: String(review.relative_time_description || "").trim(),
    profilePhotoUrl: review.profile_photo_url || undefined,
    time: review.time,
  }));

  const cache = await prisma.googlePlaceCache.upsert({
    where: { id: CACHE_ID },
    create: {
      id: CACHE_ID,
      placeId,
      name: result.name || "Divas Sojourn",
      rating: result.rating ?? null,
      userRatingsTotal: result.user_ratings_total ?? null,
      reviews,
      mapsUri: result.url || null,
      fetchedAt: new Date(),
    },
    update: {
      placeId,
      name: result.name || "Divas Sojourn",
      rating: result.rating ?? null,
      userRatingsTotal: result.user_ratings_total ?? null,
      reviews,
      mapsUri: result.url || null,
      fetchedAt: new Date(),
    },
  });

  return { refreshed: true, cache };
}

export async function getGoogleReviewsForUi(): Promise<GooglePlaceUi> {
  try {
    const { cache } = await refreshGooglePlaceIfStale();
    if (!cache) {
      return fallbackUi();
    }
    return toUiFromCache(cache);
  } catch (error) {
    console.error("getGoogleReviewsForUi failed", error);
    try {
      const existing = await getCachedGooglePlace();
      if (existing) return toUiFromCache(existing);
    } catch {
      // ignore secondary read errors
    }
    return fallbackUi();
  }
}

export function mergePlatformReviewsWithGoogle(
  google: Pick<GooglePlaceUi, "rating" | "count" | "source">,
) {
  return mockPlatformReviews.map((item) => {
    if (item.platform !== "Google") return item;
    return {
      ...item,
      rating: google.rating,
      count: google.count,
    };
  });
}
