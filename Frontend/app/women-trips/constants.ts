/** Shared contact + tracking constants for the Google Ads /women-trips landing. */

export const WOMEN_TRIPS_SOURCE = "google-ads-women-trips";

export const CONTACT = {
  phoneDisplay: "+91 99900 22835",
  phoneTel: "+919990022835",
  whatsappNumber: "919990022835",
  email: "contact@divassojourn.com",
  location: "New Delhi, India",
} as const;

export const WHATSAPP_LANDING_MESSAGE =
  "Hi Divas Sojourn, I'd like details of your women-only international trips";

export const WHATSAPP_THANK_YOU_MESSAGE =
  "Hi, I just sent an enquiry on your website";

export const WOMEN_TRIP_SLUGS = [
  "japan-christmas-new-year",
  "russia-northern-lights-2027",
  "sri-lanka-soul-2027",
  "taiwan-cherry-blossom-2027",
] as const;

export type WomenTripSlug = (typeof WOMEN_TRIP_SLUGS)[number];

/** Fallback trip cards from codebase seed/upsert data when DB row is missing. */
export const WOMEN_TRIP_FALLBACKS: Record<
  WomenTripSlug,
  {
    title: string;
    shortName: string;
    slug: WomenTripSlug;
    country: string;
    dates: string;
    startDate: string;
    endDate: string;
    route: string;
    price: number;
    earlyBirdPrice: number | null;
    image: string;
  }
> = {
  "japan-christmas-new-year": {
    title: "Christmas & New Year in Japan",
    shortName: "Japan Festive Escape",
    slug: "japan-christmas-new-year",
    country: "Japan",
    dates: "24th December 2026 - 01st January 2027",
    startDate: "2026-12-24",
    endDate: "2027-01-01",
    route: "Tokyo - Hakone - Kyoto - Osaka - Tokyo",
    price: 385500,
    earlyBirdPrice: null,
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=85",
  },
  "russia-northern-lights-2027": {
    title: "Northern Lights in Russia",
    shortName: "Russia Northern Lights 2027",
    slug: "russia-northern-lights-2027",
    country: "Russia",
    dates: "19th – 26th March 2027",
    startDate: "2027-03-19",
    endDate: "2027-03-26",
    route: "Russia - Northern Lights",
    price: 372999,
    earlyBirdPrice: 362999,
    image:
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1600&q=85",
  },
  "sri-lanka-soul-2027": {
    title: "Sri Lanka Soul",
    shortName: "Sri Lanka Soul",
    slug: "sri-lanka-soul-2027",
    country: "Sri Lanka",
    dates: "12th – 17th January 2027",
    startDate: "2027-01-12",
    endDate: "2027-01-17",
    route: "Sigiriya - Kandy - Nuwara Eliya - Ella - Yala - Galle - Bentota",
    price: 118000,
    earlyBirdPrice: 113000,
    image:
      "https://images.unsplash.com/photo-1653959699604-1eb000740b57?auto=format&fit=crop&w=1600&q=85",
  },
  "taiwan-cherry-blossom-2027": {
    title: "Cherry Blossom in Taiwan",
    shortName: "Taiwan Cherry Blossom",
    slug: "taiwan-cherry-blossom-2027",
    country: "Taiwan",
    dates: "20th – 25th February 2027",
    startDate: "2027-02-20",
    endDate: "2027-02-25",
    route: "Taiwan",
    price: 150000,
    earlyBirdPrice: 140000,
    image:
      "https://images.unsplash.com/photo-1592912925002-02623714abfb?auto=format&fit=crop&w=1600&q=85",
  },
};

export const FAQ_IDS_FOR_LANDING = [
  "solo-travelers",
  "safety",
  "room-sharing",
  "age",
  "group-size",
  "visa",
  "payments",
  "about",
] as const;

/** Review ids from app/data/googleReviews.ts — safety / solo / trip leader themes. */
export const LANDING_REVIEW_IDS = [2, 4, 1] as const;

export const LANDING_REVIEW_TRIP_LABEL: Record<number, string> = {
  2: "Kenya",
  4: "Jaisalmer",
  1: "Kenya",
};
