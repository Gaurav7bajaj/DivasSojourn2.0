import HeroSection from "./components/home/HeroSection";
import ReviewsSection from "./components/home/ReviewsSection";
import UpcomingTripsSection from "./components/home/UpcomingTripsSection";
import IndiaTripsSection from "./components/home/IndiaTripsSection";
import InternationalTripsSection from "./components/home/InternationalTripsSection";
import RomanceEscapesSection from "./components/home/RomanceEscapesSection";
import WhyDivasSection from "./components/home/WhyDivasSection";

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
