import {
  DestinationCards,
  TailoredIntro,
  TailoredTripsHero,
  WhatsAppCommunityCTA,
} from "../components/tailored-trips";

export const metadata = {
  title: "Tailored Trips | Divas Sojourn",
  description:
    "Design specialized women-only tailored trips for Georgia, Armenia, Ladakh, Turkey, Rajasthan, Dubai, Bali, Singapore, Vietnam, Kerala, Rann of Kutch and more with Divas Sojourn.",
  keywords: [
    "tailored trips",
    "custom women travel",
    "women only itinerary",
    "Georgia Armenia travel",
    "Ladakh women trip",
    "Divas Sojourn tailored",
  ],
  alternates: {
    canonical: "/tailored-trips",
  },
  openGraph: {
    title: "Tailored Trips | Divas Sojourn",
    description:
      "Pick a destination and enquire — we craft specialized tailored trips for solo women travellers.",
    url: "https://divassojourn.com/tailored-trips",
    type: "website",
  },
};

export default function TailoredTripsPage() {
  return (
    <main className="bg-[#1A1A1A]">
      <TailoredTripsHero />
      <TailoredIntro />
      <DestinationCards />
      <WhatsAppCommunityCTA />
    </main>
  );
}
