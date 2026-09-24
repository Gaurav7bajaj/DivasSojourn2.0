import {
  HeroSection,
  IndiaTripsSection,
  InternationalTripsSection,
  ReviewsSection,
  UpcomingTripsSection,
  WhyDivasSection,
} from "./components/home";
import ShortContactForm from "./components/international/ShortContactForm";
import TravelerReviews from "./components/international/TravelerReviews";
import {
  getGoogleReviewsForUi,
  mergePlatformReviewsWithGoogle,
} from "./lib/data/googleReviews";

// Re-render at most once an hour; Google data itself is cached in the DB for 24h.
export const revalidate = 3600;

export default async function Home() {
  const google = await getGoogleReviewsForUi();
  const platformReviews = mergePlatformReviewsWithGoogle(google);
  const isLiveGoogle = google.source === "google";

  return (
    <main>
      <HeroSection />
      <ReviewsSection
        reviews={platformReviews}
        mapsUri={isLiveGoogle ? google.mapsUri : null}
        attributionLabel={
          isLiveGoogle ? `${google.placeName} rating powered by Google.` : null
        }
      />
      {/* Only show individual reviews when they are real Google reviews —
          never the placeholder sample reviews. */}
      {isLiveGoogle && google.reviews?.length ? (
        <TravelerReviews
          reviews={google.reviews}
          title="What Travelers Say on Google"
          subtitle="Real Google reviews from the Divas Sojourn community"
          mapsUri={google.mapsUri}
        />
      ) : null}
      <UpcomingTripsSection />
      <IndiaTripsSection />
      <InternationalTripsSection />
      <WhyDivasSection />
      <ShortContactForm pageLabel="Home" storageKey="divasHomeLeads" />
    </main>
  );
}
