import { getTripNavItems } from "../../lib/data/trips";
import FeaturedJourneysCarousel from "./FeaturedJourneysCarousel";

export default async function InternationalTripsSection() {
  const trips = (await getTripNavItems("International")).slice(0, 8).map((trip) => ({
    id: trip.id,
    name: trip.name || trip.shortName || trip.title,
    image: trip.image,
    price: trip.startingPrice || trip.price,
    href: `/international-trips/${trip.slug}`,
    badge: "International",
  }));

  return (
    <FeaturedJourneysCarousel
      id="international-trips"
      eyebrow="Featured International"
      title="Where will you go"
      titleEm="abroad?"
      blurb="Handpicked global getaways with comfortable stays, trusted support and community-first travel."
      viewAllHref="/international-trips"
      viewAllLabel="View all international trips →"
      trips={trips}
    />
  );
}
