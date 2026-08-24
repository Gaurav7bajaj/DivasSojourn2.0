import { notFound } from "next/navigation";
import TripDetailPage from "../../components/india-trip-detail/TripDetailPage";
import { getPublishedTrips, getTripBySlug } from "../../lib/data/trips";
import { formatDualPrice } from "../../utils/formatPrice";

export const dynamic = "force-dynamic";

const pageBaseUrl = "https://divassojourn.com/india-trips";

export async function generateMetadata({ params }) {
  const { "trip-slug": tripSlug } = await params;
  const trip = await getTripBySlug(tripSlug);

  if (!trip || !trip.published || trip.destination !== "India") {
    return {
      title: "India Trip Not Found | Divas Sojourn",
    };
  }

  return {
    title: `${trip.title} | India Trips | Divas Sojourn`,
    description: `${trip.title} by Divas Sojourn. ${trip.dates}, ${trip.duration}. Starting from ${formatDualPrice(trip.price)} per person.`,
    keywords: [
      trip.title,
      trip.shortName,
      "India trips for women",
      "women only group tour",
      "Divas Sojourn",
      ...trip.highlights.slice(0, 8),
    ],
    alternates: {
      canonical: `/india-trips/${trip.slug}`,
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
          alt: `${trip.title} trip`,
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

export default async function IndiaTripDetailRoute({ params }) {
  const { "trip-slug": tripSlug } = await params;
  const trip = await getTripBySlug(tripSlug);

  if (!trip || !trip.published || trip.destination !== "India") {
    notFound();
  }

  const similarTrips = (await getPublishedTrips()).filter(
    (item) => item.destination === "India" && item.slug !== trip.slug,
  );

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
          name: "India Trips",
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
      offers: {
        "@type": "Offer",
        price: String(trip.price),
        priceCurrency: trip.currency,
        availability:
          trip.status === "upcoming"
            ? "https://schema.org/InStock"
            : "https://schema.org/SoldOut",
      },
      itinerary: trip.itinerary.map((day) => ({
        "@type": "TouristAttraction",
        name: day.title,
        description: day.description,
      })),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <TripDetailPage trip={trip} similarTrips={similarTrips} />
    </>
  );
}
