import { notFound } from "next/navigation";
import TripDetailPage from "../../components/india-trip-detail/TripDetailPage";
import { combinedInternationalTripDetails } from "../../data/internationalTripDetails";

const pageBaseUrl = "https://divassojourn.com/international-trips";

export function generateStaticParams() {
  return combinedInternationalTripDetails.map((trip) => ({
    slug: trip.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const trip = combinedInternationalTripDetails.find((item) => item.slug === slug);

  if (!trip) {
    return {
      title: "International Trip Not Found | Divas Sojourn",
    };
  }

  return {
    title: `${trip.title} | International Trips | Divas Sojourn`,
    description: `${trip.title} by Divas Sojourn. ${trip.dates}, ${trip.duration}. Starting from Rs. ${trip.price}/- per person.`,
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
  const trip = combinedInternationalTripDetails.find((item) => item.slug === slug);

  if (!trip) {
    notFound();
  }

  const similarTrips = combinedInternationalTripDetails.filter((item) => item.slug !== trip.slug);
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
      offers: {
        "@type": "Offer",
        price: String(trip.earlyBirdPrice || trip.price),
        priceCurrency: trip.currency,
        availability: trip.status === "upcoming" ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
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
      <TripDetailPage
        trip={trip}
        similarTrips={similarTrips}
        basePath="/international-trips"
        baseLabel="International Trips"
      />
    </>
  );
}
