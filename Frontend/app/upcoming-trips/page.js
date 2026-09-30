import { Suspense } from "react";
import { UpcomingTripsClient, UpcomingTripsHeader } from "../components/upcoming";
import ContactForm from "../components/international/ContactForm";
import { buildMonthsFromTrips } from "../lib/data/tripMappers";
import { getTripNavItems, getUpcomingTrips } from "../lib/data/trips";

export const dynamic = "force-dynamic";

const pageUrl = "https://divassojourn.com/upcoming-trips";
const heroImage = "https://divassojourn.com/heroes/home/upcomingCommunityTrips.png";

export const metadata = {
  title: "Upcoming Women Travel Packages 2026",
  description:
    "Discover upcoming community trips for women travelers in 2026. Browse destinations, dates, prices, and book your adventure with Divas Sojourn.",
  keywords: [
    "upcoming trips 2026",
    "women travel packages",
    "community trips",
    "group tours",
    "scheduled trips",
    "women only tours",
  ],
  alternates: {
    canonical: "/upcoming-trips",
  },
  openGraph: {
    title: "Upcoming Women Travel Packages 2026 | Divas Sojourn",
    description:
      "Explore upcoming women's travel packages with flexible filtering by destination, dates, duration, and budget.",
    url: pageUrl,
    type: "website",
    images: [
      {
        url: heroImage,
        width: 1200,
        height: 630,
        alt: "Upcoming community trips for women travelers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Upcoming Women Travel Packages 2026 | Divas Sojourn",
    description:
      "Browse upcoming women-only community trips by destination, date, duration and budget.",
    images: [heroImage],
  },
};

export default async function UpcomingTripsPage() {
  const [trips, destinationOptions] = await Promise.all([
    getUpcomingTrips(),
    getTripNavItems(),
  ]);
  const months = buildMonthsFromTrips(trips);

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://divassojourn.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Upcoming Trips",
          item: pageUrl,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Upcoming Women Travel Packages",
      itemListElement: trips.map((trip, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Trip",
          name: trip.title,
          description: trip.description,
          image: trip.image,
          url:
            trip.destination === "India"
              ? `https://divassojourn.com/india-trips/${trip.slug}`
              : `https://divassojourn.com/international-trips/${trip.slug}`,
          offers: {
            "@type": "Offer",
            price: String(trip.currentPrice),
            priceCurrency: "INR",
          },
          startDate: trip.startDate,
          endDate: trip.endDate,
        },
      })),
    },
  ];

  return (
    <main className="bg-[#0B0B0C]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <UpcomingTripsHeader />
      <Suspense
        fallback={
          <div className="border-t border-white/8 px-5 py-16 text-[#C9C3B6] md:px-12 xl:px-24">
            Loading trips…
          </div>
        }
      >
        <UpcomingTripsClient trips={trips} months={months} />
      </Suspense>
      <ContactForm
        destinationOptions={destinationOptions}
        storageKey="divasUpcomingLeads"
        pageLabel="Upcoming Trips"
      />
    </main>
  );
}
