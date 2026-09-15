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

export default async function Home() {
  const google = await getGoogleReviewsForUi();
  const platformReviews = mergePlatformReviewsWithGoogle(google);

  return (
    <main>
      <HeroSection />
      <ReviewsSection
        reviews={platformReviews}
        mapsUri={google.source === "google" ? google.mapsUri : null}
        attributionLabel={
          google.source === "google"
            ? `${google.placeName} rating powered by Google.`
            : null
        }
      />
      {google.reviews?.length ? (
        <TravelerReviews
          reviews={google.reviews}
          title="What Travelers Say on Google"
          subtitle="Real Google reviews from the Divas Sojourn community"
          mapsUri={google.source === "google" ? google.mapsUri : null}
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
