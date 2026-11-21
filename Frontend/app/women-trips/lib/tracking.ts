"use client";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

function pushDataLayer(payload: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

export function trackWomenTripsEvent(
  event: "women_trips_lead" | "women_trips_call_click" | "women_trips_whatsapp_click",
  extra: Record<string, unknown> = {},
) {
  pushDataLayer({ event, ...extra });

  // Optional Google Ads conversion — fill env IDs when the Ads team is ready.
  const conversionId = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID?.trim();
  const conversionLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL?.trim();
  if (
    event === "women_trips_lead" &&
    conversionId &&
    conversionLabel &&
    typeof window.gtag === "function"
  ) {
    window.gtag("event", "conversion", {
      send_to: `${conversionId}/${conversionLabel}`,
      ...extra,
    });
  }
}

export function captureUtmParams(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid"];
  const out: Record<string, string> = {};
  for (const key of keys) {
    const value = params.get(key);
    if (value) out[key] = value.slice(0, 200);
  }
  return out;
}

export const LEAD_TRIP_STORAGE_KEY = "women_trips_lead_trip";
