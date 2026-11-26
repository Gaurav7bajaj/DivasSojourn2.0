import { faqItems } from "../../data/faqs";
import { REVIEWS } from "../../data/googleReviews";
import { getPublishedFaqs } from "../../lib/data/faqs";
import { getPlatformStats } from "../../lib/data/siteReviews";
import { getTripBySlug } from "../../lib/data/trips";
import { deriveCountryLabel } from "../../lib/data/tripCountry";
import {
  FAQ_IDS_FOR_LANDING,
  LANDING_REVIEW_IDS,
  LANDING_REVIEW_TRIP_LABEL,
  WOMEN_TRIP_FALLBACKS,
  WOMEN_TRIP_SLUGS,
  type WomenTripSlug,
} from "../constants";

export type WomenTripCard = {
  slug: WomenTripSlug;
  title: string;
  shortName: string;
  country: string;
  dates: string;
  startDate: string;
  endDate: string;
  route: string;
  priceFrom: number;
  image: string;
  selectLabel: string;
  monthBadge: string;
};

export type LandingFaq = {
  id: string;
  question: string;
  answer: string;
};

export type LandingReview = {
  id: number;
  name: string;
  text: string;
  rating: number;
  tripLabel: string;
};

function formatMonthBadge(startDate: string): string {
  const date = new Date(`${startDate}T12:00:00`);
  if (Number.isNaN(date.getTime())) return "";
  return date
    .toLocaleString("en-US", { month: "short", year: "numeric" })
    .toUpperCase();
}

function buildSelectLabel(shortName: string, dates: string): string {
  return `${shortName} · ${dates}`;
}

async function resolveTrip(slug: WomenTripSlug): Promise<WomenTripCard> {
  const fallback = WOMEN_TRIP_FALLBACKS[slug];
  try {
    const trip = await getTripBySlug(slug);
    if (trip) {
      const remaining = Math.max(
        0,
        (trip.earlyBirdSlots ?? 3) - (trip.earlyBirdSlotsUsed ?? 0),
      );
      const earlyAvailable =
        trip.earlyBirdPrice != null &&
        trip.earlyBirdPrice > 0 &&
        trip.earlyBirdPrice < trip.price &&
        remaining > 0;
      const priceFrom = earlyAvailable ? trip.earlyBirdPrice! : trip.price;
      const country = deriveCountryLabel(trip) || fallback.country;
      return {
        slug,
        title: trip.title || fallback.title,
        shortName: trip.shortName || fallback.shortName,
        country,
        dates: trip.dates || fallback.dates,
        startDate: trip.startDate || fallback.startDate,
        endDate: trip.endDate || fallback.endDate,
        route: trip.route || fallback.route,
        priceFrom,
        image: trip.image || fallback.image,
        selectLabel: buildSelectLabel(
          trip.shortName || trip.title || fallback.shortName,
          trip.dates || fallback.dates,
        ),
        monthBadge: formatMonthBadge(trip.startDate || fallback.startDate),
      };
    }
  } catch (error) {
    console.error(`women-trips: failed to load trip ${slug}`, error);
  }

  return {
    slug,
    title: fallback.title,
    shortName: fallback.shortName,
    country: fallback.country,
    dates: fallback.dates,
    startDate: fallback.startDate,
    endDate: fallback.endDate,
    route: fallback.route,
    priceFrom: fallback.earlyBirdPrice || fallback.price,
    image: fallback.image,
    selectLabel: buildSelectLabel(fallback.shortName, fallback.dates),
    monthBadge: formatMonthBadge(fallback.startDate),
  };
}

function trimAtSentence(text: string, maxChars = 420): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= maxChars) return cleaned;
  const slice = cleaned.slice(0, maxChars);
  const boundary = Math.max(
    slice.lastIndexOf(". "),
    slice.lastIndexOf("! "),
    slice.lastIndexOf("? "),
  );
  if (boundary > maxChars * 0.5) {
    return slice.slice(0, boundary + 1).trim();
  }
  return `${slice.trim()}…`;
}

export async function loadWomenTripsLandingData() {
  const [tripsRaw, platforms, faqsFromDb] = await Promise.all([
    Promise.all(WOMEN_TRIP_SLUGS.map((slug) => resolveTrip(slug))),
    getPlatformStats().catch(() => []),
    getPublishedFaqs().catch(() => faqItems),
  ]);

  // Ascending by departure date (cards + form dropdown stay in sync).
  const trips = [...tripsRaw].sort((a, b) =>
    String(a.startDate).localeCompare(String(b.startDate)),
  );

  const google = platforms.find((p) => p.id === "google");
  const tripadvisor = platforms.find((p) => p.id === "tripadvisor");

  const faqSource = Array.isArray(faqsFromDb) && faqsFromDb.length ? faqsFromDb : faqItems;
  const faqs: LandingFaq[] = FAQ_IDS_FOR_LANDING.map((id) => {
    const staticItem = faqItems.find((f) => f.id === id);
    const item =
      faqSource.find(
        (f: { id?: string; slug?: string; question?: string }) =>
          f.slug === id || f.id === id || (staticItem && f.question === staticItem.question),
      ) || staticItem;
    if (!item) return null;
    return {
      id,
      question: item.question,
      answer: item.answer,
    };
  }).filter(Boolean) as LandingFaq[];

  const reviews: LandingReview[] = LANDING_REVIEW_IDS.map((id) => {
    const review = REVIEWS.find((r) => r.id === id);
    if (!review) return null;
    return {
      id: review.id,
      name: review.name,
      text: trimAtSentence(review.text),
      rating: review.rating,
      tripLabel: LANDING_REVIEW_TRIP_LABEL[id] || "",
    };
  }).filter(Boolean) as LandingReview[];

  return {
    trips,
    faqs,
    reviews,
    stats: {
      womenTravelled: "14,000+",
      since: "2015",
      googleRating: google?.rating ?? 4.8,
      googleCount: google?.count ?? 320,
      googleCountLabel: google?.countLabel || "320+ reviews",
      tripadvisorRating: tripadvisor?.rating ?? 5.0,
      tripadvisorCount: tripadvisor?.count ?? 80,
      tripadvisorCountLabel: tripadvisor?.countLabel || "80+ reviews",
    },
  };
}
