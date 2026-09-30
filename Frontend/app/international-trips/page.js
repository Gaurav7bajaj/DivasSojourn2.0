import { Suspense } from "react";
import { BlogsSection } from "../components/international";
import ShortContactForm from "../components/international/ShortContactForm";
import CategoryHero from "../components/shared/CategoryHero";
import InternationalTripsClient from "../components/international/InternationalTripsClient";
import WhyDivasSection from "../components/home/WhyDivasSection";
import { buildInternationalHeroSlides } from "../data/internationalHeroSlides";
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
    "women-only tours",
  ],
  alternates: {
    canonical: "/international-trips",
  },
  openGraph: {
    title: "International Trip Packages for Solo Female Travelers | Divas Sojourn",
    description:
      "Discover amazing international destinations designed for female travelers. Safe, inclusive, and unforgettable experiences.",
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

  const sortedForHero = [...trips].sort((a, b) => a.startDate.localeCompare(b.startDate));
  const heroSlides = buildInternationalHeroSlides(
    sortedForHero.length ? sortedForHero : internationalNav,
  );

  const prices = trips
    .map((trip) => Number(trip.currentPrice) || 0)
    .filter((price) => price > 0);
  const lowestPrice = prices.length ? Math.min(...prices) : 0;
  const startingPriceLabel = lowestPrice
    ? `₹${new Intl.NumberFormat("en-IN").format(lowestPrice)}`
    : "₹—";

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
  ];

  return (
    <main className="bg-[#0B0B0C]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <CategoryHero
        slides={heroSlides}
        upcomingCount={trips.length}
        startingPriceLabel={startingPriceLabel}
        breadcrumbLabel="International Trips"
        eyebrow="Explore"
        title="International"
        titleItalic="trips"
        description="Northern lights, autumn in Seoul, misty Laos and New Year in Japan — small-group journeys abroad, just for women."
        ariaLabel="International Trips"
        titleClassName="md:text-[clamp(2.75rem,5.5vw,4.75rem)]"
      />

      <div className="bg-[#0B0B0C] px-5 pt-16 md:px-12 xl:px-24">
        <div className="mx-auto max-w-none text-center md:text-left">
          <h2 className="font-[family-name:var(--font-playfair)] text-[36px] font-semibold text-[#FBF8F1] md:text-[44px]">
            International{" "}
            <em className="font-[family-name:var(--font-playfair)] font-medium italic text-[#E2BB4D]">
              departures
            </em>
          </h2>
          <p className="mt-3 font-[family-name:var(--font-dm-sans)] text-[16px] text-[#C9C3B6]">
            Filter by country, month, duration or budget.
          </p>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="border-t border-white/8 px-5 py-16 text-[#C9C3B6] md:px-12 xl:px-24">
            Loading trips…
          </div>
        }
      >
        <InternationalTripsClient trips={trips} months={months} />
      </Suspense>

      <BlogsSection posts={blogCards} />
      <WhyDivasSection />
      <ShortContactForm pageLabel="International Trips" storageKey="divasInternationalLeads" />
    </main>
  );
}
