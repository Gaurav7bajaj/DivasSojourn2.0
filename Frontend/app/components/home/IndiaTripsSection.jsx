import { getTripNavItems } from "../../lib/data/trips";
import FeaturedJourneysCarousel from "./FeaturedJourneysCarousel";

export default async function IndiaTripsSection() {
  const trips = (await getTripNavItems("India")).slice(0, 8).map((trip) => ({
    id: trip.id,
    name: trip.shortName || trip.name || trip.title,
    image: trip.image,
    price: trip.price,
    href: `/india-trips/${trip.slug}`,
    badge: "India",
  }));

  return (
    <FeaturedJourneysCarousel
      id="india-trips"
      eyebrow="Featured India"
      title="Where will you go"
      titleEm="next?"
      blurb="A journey through time, colour and culture — from mountain valleys to coastal retreats."
      viewAllHref="/india-trips"
      viewAllLabel="View all India trips →"
      trips={trips}
    />
  );
}
