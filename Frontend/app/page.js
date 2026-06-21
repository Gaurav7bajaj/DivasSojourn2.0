import {
  RomanceEscapesSection,
  HeroSection,
  IndiaTripsSection,
  InternationalTripsSection,
  ReviewsSection,
  UpcomingTripsSection,
  WhyDivasSection,
} from "./components/home";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ReviewsSection />
      <UpcomingTripsSection />
      <IndiaTripsSection />
      <InternationalTripsSection />
      <RomanceEscapesSection />
      <WhyDivasSection />
    </main>
  );
}
