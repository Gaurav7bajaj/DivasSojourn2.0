import UpcomingTripCard from "./UpcomingTripCard";

export default function UpcomingTripsGrid({ trips, totalCount }) {
  return (
    <section aria-labelledby="upcoming-grid-heading">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="upcoming-grid-heading" className="text-2xl font-black text-white md:text-3xl">
            All Upcoming Trips
          </h2>
          <p className="mt-1 text-sm font-semibold text-white">
            Showing {trips.length} of {totalCount} upcoming trips
          </p>
        </div>
      </div>

      {trips.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {trips.map((trip) => (
            <UpcomingTripCard key={trip.id} trip={trip} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-[#D4AF37]/30 bg-[#1A1A1A] p-10 text-center">
          <p className="text-xl font-black text-white">No trips match these filters.</p>
          <p className="mt-2 text-white">Try clearing filters or selecting a wider budget range.</p>
        </div>
      )}
    </section>
  );
}
