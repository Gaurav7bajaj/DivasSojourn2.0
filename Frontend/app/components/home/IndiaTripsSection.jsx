import { indiaTrips } from "../../data/mockData";
import TripSection from "./TripSection";

export default function IndiaTripsSection() {
  return (
    <TripSection
      id="india-trips"
      title="India Trips"
      subtitle="A Journey Through Time, Colour And Culture"
      description="Experience India through thoughtfully planned women-only journeys, from mountain valleys to coastal retreats."
      ctaHref="/india-trips"
      heroImage="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80"
      heroVideo="https://videos.pexels.com/video-files/3724873/3724873-uhd_2560_1440_25fps.mp4"
      heroAlt="Lush waterfall and green Indian landscape"
      trips={indiaTrips}
    />
  );
}
