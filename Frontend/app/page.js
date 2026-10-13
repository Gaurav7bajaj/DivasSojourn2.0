import {
  HeroSection,
  IndiaTripsSection,
  InternationalTripsSection,
  ReviewsSection,
  UpcomingTripsSection,
  WhyDivasSection,
} from "./components/home";
import ShortContactForm from "./components/international/ShortContactForm";
import GoogleReviews from "./components/shared/GoogleReviews";
import { GOOGLE } from "./data/googleReviews";
import { getPlatformStats } from "./lib/data/siteReviews";

export const dynamic = "force-dynamic";

export default async function Home() {
  const platforms = await getPlatformStats();
  const platformReviews = platforms.map((p) => ({
    platform: p.platform,
    rating: p.rating ?? undefined,
    ratingLabel: p.ratingLabel || undefined,
    countLabel: p.countLabel || `${p.count}+ reviews`,
    href: p.href,
  }));

  const google = platforms.find((p) => p.id === "google");
  const reviewsSchema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "Divas Sojourn",
    url: "https://divassojourn.com",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: google?.rating ?? GOOGLE.rating,
      reviewCount: google?.count ?? GOOGLE.count,
      bestRating: 5,
      worstRating: 1,
    },
  };

  return (
    <main className="bg-[#0B0B0C]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsSchema) }}
      />
      <HeroSection />
      <ReviewsSection reviews={platformReviews} />
      <IndiaTripsSection />
      <InternationalTripsSection />
      <UpcomingTripsSection />
      <WhyDivasSection />
      <GoogleReviews title="Don't take" titleAccent="our word" suffix=" for it" />
      <ShortContactForm pageLabel="Home" storageKey="divasHomeLeads" />
    </main>
  );
}
