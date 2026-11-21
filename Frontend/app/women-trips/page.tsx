import type { Metadata } from "next";
import WomenTripsLandingClient from "./WomenTripsLandingClient";
import { loadWomenTripsLandingData } from "./lib/loadLandingData";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Women-Only International Group Tours | Divas Sojourn",
  description:
    "Join Divas Sojourn women-only group tours to Japan, Russia, Sri Lanka, Taiwan and more. Get the itinerary and price on WhatsApp.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "/women-trips",
  },
  openGraph: {
    title: "Women-Only International Group Tours | Divas Sojourn",
    description:
      "Travel the world with women like you. Dedicated trip leaders, thoughtfully planned itineraries, and 14,000+ travellers since 2015.",
    url: "https://divassojourn.com/women-trips",
    type: "website",
  },
};

export default async function WomenTripsLandingPage() {
  const data = await loadWomenTripsLandingData();

  return (
    <WomenTripsLandingClient
      trips={data.trips}
      faqs={data.faqs}
      reviews={data.reviews}
      stats={data.stats}
    />
  );
}
