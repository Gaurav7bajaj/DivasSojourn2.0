import { indiaTripsData } from "../../data/indiaTrips";
import IndiaTripsCard from "./IndiaTripsCard";

export default function IndiaTripsGrid() {
  return (
    <section id="destinations" className="bg-[#1A1A1A] px-4 py-16" aria-labelledby="destinations-heading">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-lg font-bold text-white">Explore Our India Destinations</p>
          <h2 id="destinations-heading" className="mt-2 text-4xl font-black text-white md:text-5xl">
            Destinations
          </h2>
          <div className="mx-auto mt-5 h-1 w-24 rounded-full bg-[#D4AF37]" aria-hidden="true" />
          <p className="mt-5 leading-7 text-white">
            Choose from India trips for women across mountains, temples, palaces, backwaters,
            wildlife trails and cultural routes. Each destination is planned with safety, comfort and
            a warm women-only community at the center.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {indiaTripsData.map((trip) => (
            <IndiaTripsCard key={trip.slug} trip={trip} />
          ))}
        </div>
      </div>
    </section>
  );
}
