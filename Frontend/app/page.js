import {
  RomanceEscapesSection,
  HeroSection,
  IndiaTripsSection,
  InternationalTripsSection,
  ReviewsSection,
  UpcomingTripsSection,
  WhyDivasSection,
} from "./components/home";
import ShortContactForm from "./components/international/ShortContactForm";

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
      <ShortContactForm pageLabel="Home" storageKey="divasHomeLeads" />
    </main>
  );
}
