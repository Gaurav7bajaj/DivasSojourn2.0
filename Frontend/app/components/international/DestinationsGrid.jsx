import { internationalDestinations } from "../../data/internationalTrips";
import DestinationCard from "./DestinationCard";

export default function DestinationsGrid() {
  return (
    <section id="destinations" className="bg-[#1A1A1A] px-4 py-16" aria-labelledby="destinations-heading">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-lg font-bold text-white">Explore Our International Destinations</p>
          <h2 id="destinations-heading" className="mt-2 text-4xl font-black text-white md:text-5xl">
            Destinations
          </h2>
          <div className="mx-auto mt-5 h-1 w-24 rounded-full bg-[#D4AF37]" aria-hidden="true" />
          <p className="mt-5 leading-7 text-white">
            Choose from international trips for women across beaches, safaris, cultural cities,
            heritage trails and premium escapes. Each destination is planned with safety, comfort and
            a warm women-only community at the center.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {internationalDestinations.map((destination) => (
            <DestinationCard key={destination.slug} destination={destination} />
          ))}
        </div>
      </div>
    </section>
  );
}
