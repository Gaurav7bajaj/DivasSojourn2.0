import { notFound } from "next/navigation";
import TripDetailPage from "../../components/india-trip-detail/TripDetailPage";
import { getPublishedTrips, getTripBySlug } from "../../lib/data/trips";
import {
  isItineraryUnlocked,
  redactTripItinerary,
} from "../../lib/itineraryUnlock";
import { isWithinPublicListingWindow } from "../../lib/data/tripMappers";
import { formatDualPrice } from "../../utils/formatPrice";

export const dynamic = "force-dynamic";

const pageBaseUrl = "https://divassojourn.com/international-trips";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const trip = await getTripBySlug(slug);

  if (!trip || !trip.published || trip.destination !== "International") {
    return {
      title: "International Trip Not Found | Divas Sojourn",
    };
  }

  return {
    title: `${trip.title} | International Trips | Divas Sojourn`,
    description: `${trip.title} by Divas Sojourn. ${trip.dates}, ${trip.duration}. Starting from ${formatDualPrice(trip.price)} per person.`,
    keywords: [
      trip.title,
      trip.shortName,
      "international trips for women",
      "women only international group tour",
      "Divas Sojourn",
      ...trip.highlights.slice(0, 8),
    ],
    alternates: {
      canonical: `/international-trips/${trip.slug}`,
    },
    openGraph: {
      title: `${trip.title} | Divas Sojourn`,
      description: trip.overview,
      url: `${pageBaseUrl}/${trip.slug}`,
      type: "website",
      images: [
        {
          url: trip.image,
          width: 1200,
          height: 630,
          alt: `${trip.title} international trip for female travelers`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${trip.title} | Divas Sojourn`,
      description: trip.overview,
      images: [trip.image],
    },
  };
}

export default async function InternationalDestinationPage({ params }) {
  const { slug } = await params;
  const trip = await getTripBySlug(slug);

  if (!trip || !trip.published || trip.destination !== "International") {
    notFound();
  }

  const similarTrips = (await getPublishedTrips()).filter(
    (item) =>
      item.destination === "International" &&
      item.slug !== trip.slug &&
      isWithinPublicListingWindow(item.startDate),
  );

  const unlocked = await isItineraryUnlocked();
  const hasItinerary = Array.isArray(trip.itinerary) && trip.itinerary.length > 0;
  const publicTrip = unlocked ? trip : redactTripItinerary(trip);

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
          name: "International Trips",
          item: pageBaseUrl,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: trip.title,
          item: `${pageBaseUrl}/${trip.slug}`,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "TouristTrip",
      name: trip.title,
      description: trip.overview,
      image: trip.image,
      url: `${pageBaseUrl}/${trip.slug}`,
      touristType: "Women-only group travel",
      offers: {
        "@type": "Offer",
        name: trip.dates || trip.title,
        price: String(trip.earlyBirdPrice || trip.price || 0),
        priceCurrency: trip.currency || "INR",
        availability: trip.soldOut
          ? "https://schema.org/SoldOut"
          : trip.status === "upcoming"
            ? "https://schema.org/InStock"
            : "https://schema.org/SoldOut",
        validFrom: trip.startDate,
      },
      ...(unlocked
        ? {
            itinerary: trip.itinerary.map((day) => ({
              "@type": "TouristAttraction",
              name: day.title || `Day ${day.day}`,
              description: day.description,
            })),
          }
        : {}),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <TripDetailPage
        trip={publicTrip}
        similarTrips={similarTrips}
        basePath="/international-trips"
        baseLabel="International Trips"
        itineraryUnlocked={unlocked}
        hasItinerary={hasItinerary}
      />
    </>
  );
}
