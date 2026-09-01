import TripSection from "./TripSection";
import { getTripNavItems } from "../../lib/data/trips";

export default async function InternationalTripsSection() {
  const trips = (await getTripNavItems("International")).slice(0, 8).map((trip) => ({
    id: trip.id,
    name: trip.name || trip.shortName || trip.title,
    image: trip.image,
    price: trip.startingPrice || trip.price,
    description: trip.description,
    slug: trip.slug,
    customHref: `/international-trips/${trip.slug}`,
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
      trips={trips}
    />
  );
}
