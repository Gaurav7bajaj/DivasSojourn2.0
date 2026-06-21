import { internationalDestinations } from "../../data/internationalTrips";
import TripSection from "./TripSection";

export default function InternationalTripsSection() {
  const featuredTrips = internationalDestinations.slice(0, 4).map((trip) => ({
    id: trip.id,
    name: trip.name,
    image: trip.image,
    price: trip.startingPrice,
    description: trip.description,
  }));

  return (
    <TripSection
      id="international-trips"
      title="International Trips"
      subtitle="Discover the world, one destination at a time"
      description="Handpicked global getaways with comfortable stays, trusted support and community-first travel."
      ctaHref="/international-trips"
      heroImage="https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=80"
      heroVideo="https://videos.pexels.com/video-files/3248250/3248250-uhd_2560_1440_25fps.mp4"
      heroAlt="Scenic international train journey across a mountain bridge"
      trips={featuredTrips}
    />
  );
}
