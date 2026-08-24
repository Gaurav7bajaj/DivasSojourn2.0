import Link from "next/link";
import {
  BlogsSection,
  ContactForm,
  TravelerReviews,
} from "../components/international";
import InternationalTripsHeader from "../components/international/InternationalTripsHeader";
import InternationalTripsClient from "../components/international/InternationalTripsClient";
import WhyDivasSection from "../components/home/WhyDivasSection";
import { getPublishedBlogs } from "../lib/data/blogs";
import { toPublicBlogCard } from "../lib/data/mappers";
import { buildMonthsFromTrips } from "../lib/data/tripMappers";
import { getTripNavItems, getUpcomingTripsByDestination } from "../lib/data/trips";

export const dynamic = "force-dynamic";

const pageUrl = "https://divassojourn.com/international-trips";
const heroImage =
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80";

export const metadata = {
  title: "International Trip Packages for Solo Female Travelers",
  description:
    "Explore real international group departures for female travelers with Divas Sojourn, including Bali, Kenya, Seychelles, Georgia & Armenia, South Africa, Turkey, Greece, Russia, South Korea, Balkan Cruise, Laos and Mauritius.",
  keywords: [
    "international trips for women",
    "solo female travel packages",
    "women travel group",
    "female travelers",
    "international destinations",
    "Bali",
    "Kenya",
    "Mauritius",
    "Georgia",
    "Armenia",
    "South Africa",
    "Greece",
    "Russia",
    "South Korea",
    "Turkey",
    "Seychelles",
    "Laos",
    "Balkan Cruise",
    "women-only tours",
  ],
  alternates: {
    canonical: "/international-trips",
  },
  openGraph: {
    title: "International Trip Packages for Solo Female Travelers | Divas Sojourn",
    description:
      "Discover amazing international destinations designed for female travelers. Safe, inclusive, and unforgettable experiences. Book your trip today with early bird discount.",
    url: pageUrl,
    type: "website",
    images: [
      {
        url: heroImage,
        width: 1200,
        height: 630,
        alt: "International trips for female travelers with Divas Sojourn",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "International Trip Packages for Solo Female Travelers | Divas Sojourn",
    description:
      "Safe, inclusive and unforgettable international destinations for female travelers.",
    images: [heroImage],
  },
};

export default async function InternationalTripsPage() {
  const [blogs, trips, internationalNav] = await Promise.all([
    getPublishedBlogs(),
    getUpcomingTripsByDestination("International"),
    getTripNavItems("International"),
  ]);

  const blogCards = blogs.slice(0, 6).map(toPublicBlogCard);
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
          name: "International Trips",
          item: pageUrl,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "International Trips for Female Travelers",
      itemListElement: internationalNav.map((destination, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "TouristAttraction",
          name: `${destination.name || destination.shortName} International Trip`,
          description: destination.description,
          url: `${pageUrl}/${destination.slug}`,
          image: destination.image,
        },
      })),
    },
    ...blogCards.map((blog) => ({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: blog.title,
      image: blog.image,
      datePublished: blog.datePublished,
      author: {
        "@type": "Organization",
        name: blog.author,
      },
      description: blog.excerpt,
      url: `https://divassojourn.com/blogs/${blog.slug}`,
    })),
  ];

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <InternationalTripsHeader />
      <nav className="bg-[#1A1A1A] px-4 py-4 text-sm text-white" aria-label="Breadcrumb">
        <ol className="mx-auto flex max-w-7xl items-center gap-2">
          <li>
            <Link href="/" className="transition hover:text-[#D4AF37]">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-semibold text-[#D4AF37]">International Trips</li>
        </ol>
      </nav>
      <InternationalTripsClient trips={trips} months={months} />
      <TravelerReviews />
      <BlogsSection posts={blogCards} />
      <WhyDivasSection />
      <ContactForm destinationOptions={internationalNav} />
    </main>
  );
}
