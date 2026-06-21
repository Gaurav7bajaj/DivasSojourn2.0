import {
  CuratedEscapesGrid,
  CuratedEscapesHero,
} from "../components/curated-escapes";
import { curatedEscapes, curatedEscapesHero } from "../data/curatedEscapes";

const pageUrl = "https://divassojourn.com/curated-escapes";

export const metadata = {
  title: "Curated Escapes | Specially Designed Trips | Divas Sojourn",
  description:
    "Explore our curated escape experiences: luxury wellness retreats, honeymoon packages, family trips, pet-friendly adventures, and senior citizen journeys.",
  keywords: [
    "curated escapes",
    "wellness retreat",
    "honeymoon packages",
    "family trips",
    "pet friendly travel",
    "senior travel",
    "luxury experiences",
  ],
  alternates: {
    canonical: "/curated-escapes",
  },
  openGraph: {
    title: "Curated Escapes | Specially Designed Trips",
    description:
      "Discover specially curated travel experiences designed for different lifestyles and life stages.",
    url: pageUrl,
    type: "website",
    images: [
      {
        url: curatedEscapesHero.image,
        width: 1200,
        height: 630,
        alt: "Curated Escapes by Divas Sojourn",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Curated Escapes | Specially Designed Trips | Divas Sojourn",
    description:
      "Discover specially curated travel experiences designed for different lifestyles and life stages.",
    images: [curatedEscapesHero.image],
  },
};

export default function CuratedEscapesPage() {
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
          name: "Curated Escapes",
          item: pageUrl,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Curated Escapes by Divas Sojourn",
      itemListElement: curatedEscapes.map((escape, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "TouristTrip",
          name: escape.name,
          description: escape.description,
          image: escape.image,
          url: `${pageUrl}/${escape.slug}`,
        },
      })),
    },
  ];

  return (
    <main className="bg-[#1A1A1A]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <CuratedEscapesHero />
      <CuratedEscapesGrid />
    </main>
  );
}
