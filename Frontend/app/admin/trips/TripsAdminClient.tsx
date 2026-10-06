"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Trip } from "@/app/lib/data/types";
import AdminSearchBar, { matchesAdminQuery } from "../AdminSearchBar";

function currentYearMonth(now = new Date()) {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function sortByStartDateAsc(a: Trip, b: Trip) {
  return a.startDate.localeCompare(b.startDate);
}

function sortByStartDateDesc(a: Trip, b: Trip) {
  return b.startDate.localeCompare(a.startDate);
}

export default function TripsAdminClient() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const loadTrips = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/trips", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Unable to load trips.");
        return;
      }
      setTrips(data.trips || []);
    } catch {
      setError("Unable to load trips.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const response = await fetch("/api/admin/trips", { cache: "no-store" });
        const data = await response.json();
        if (!active) return;
        if (!response.ok) {
          setError(data.error || "Unable to load trips.");
          return;
        }
        setTrips(data.trips || []);
      } catch {
        if (active) setError("Unable to load trips.");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const filteredTrips = useMemo(
    () =>
      trips.filter((trip) =>
        matchesAdminQuery(searchQuery, [
          trip.title,
          trip.shortName,
          trip.destination,
          trip.slug,
          trip.status,
          trip.dates,
          trip.startDate,
          trip.endDate,
          trip.route,
          trip.pickupLocation,
          trip.dropLocation,
          trip.published ? "live published" : "draft",
        ]),
      ),
    [searchQuery, trips],
  );

  const { currentMonthUpcoming, otherUpcoming, pastTrips } = useMemo(() => {
    const ym = currentYearMonth();
    const currentMonth: Trip[] = [];
    const other: Trip[] = [];
    const past: Trip[] = [];

    for (const trip of filteredTrips) {
      if (trip.status === "past") {
        past.push(trip);
        continue;
      }
      if (trip.startDate.slice(0, 7) === ym) {
        currentMonth.push(trip);
      } else {
        other.push(trip);
      }
    }

    currentMonth.sort(sortByStartDateAsc);
    other.sort(sortByStartDateAsc);
    past.sort(sortByStartDateDesc);

    return {
      currentMonthUpcoming: currentMonth,
      otherUpcoming: other,
      pastTrips: past,
    };
  }, [filteredTrips]);

  const handleDelete = async (trip: Trip) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${trip.title}"? This cannot be undone.`,
    );
    if (!confirmed) return;

    setMessage("");
    setError("");
    try {
      const response = await fetch(`/api/admin/trips/${trip.id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Unable to delete trip.");
        return;
      }
      setMessage("Trip deleted successfully.");
      await loadTrips();
    } catch {
      setError("Unable to delete trip.");
    }
  };

  const emptyMessage = loading
    ? "Loading trips..."
    : trips.length === 0
      ? "No trips yet."
      : filteredTrips.length === 0
        ? `No trips match “${searchQuery.trim()}”.`
        : null;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black">Trips</h1>
          <p className="mt-1 text-sm text-[#555555]">
            India and International trips shown on listings, detail pages, and calendar.
          </p>
        </div>
        <Link
          href="/admin/trips/new"
          className="rounded-full bg-[#0F9B9B] px-5 py-2.5 text-sm font-black text-white hover:bg-[#0d8585]"
        >
          Add New Trip
        </Link>
      </div>

      {message ? <p className="mt-4 text-sm font-semibold text-[#0F9B9B]">{message}</p> : null}
      {error ? <p className="mt-4 text-sm font-semibold text-red-600">{error}</p> : null}

      <AdminSearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        label="Search trips"
        placeholder="Search by title, destination, dates, status…"
        resultCount={filteredTrips.length}
        totalCount={trips.length}
      />

      {emptyMessage ? (
        <div className="mt-4 rounded-2xl bg-white px-4 py-8 text-center text-sm text-[#666666] shadow-sm">
          {emptyMessage}
        </div>
      ) : (
        <div className="mt-6 space-y-8">
          <TripSection
            title="This month’s upcoming trips"
            description="Departures starting in the current calendar month."
            trips={currentMonthUpcoming}
            emptyLabel="No upcoming trips this month."
            onDelete={handleDelete}
          />
          <TripSection
            title="Other upcoming trips"
            description="All other trips that have not departed yet."
            trips={otherUpcoming}
            emptyLabel="No other upcoming trips."
            onDelete={handleDelete}
          />
          <TripSection
            title="Past trips"
            description="Trips whose start date has already passed."
            trips={pastTrips}
            emptyLabel="No past trips."
            onDelete={handleDelete}
          />
        </div>
      )}
    </div>
  );
}

function TripSection({
  title,
  description,
  trips,
  emptyLabel,
  onDelete,
}: {
  title: string;
  description: string;
  trips: Trip[];
  emptyLabel: string;
  onDelete: (trip: Trip) => void;
}) {
  return (
    <section>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-xl font-black text-[#111111]">{title}</h2>
          <p className="mt-0.5 text-sm text-[#666666]">{description}</p>
        </div>
        <p className="text-xs font-bold uppercase tracking-wide text-[#888888]">
          {trips.length} {trips.length === 1 ? "trip" : "trips"}
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-black/10 bg-[#FAFAFA] text-xs uppercase tracking-wide text-[#666666]">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Destination</th>
              <th className="px-4 py-3">Dates</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trips.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[#666666]">
                  {emptyLabel}
                </td>
              </tr>
            ) : (
              trips.map((trip) => (
                <tr key={trip.id} className="border-t border-black/5">
                  <td className="px-4 py-3 font-semibold">{trip.shortName || trip.title}</td>
                  <td className="px-4 py-3">{trip.destination}</td>
                  <td className="px-4 py-3 text-[#555555]">
                    {trip.dates || `${trip.startDate} → ${trip.endDate}`}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        trip.status === "upcoming"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {trip.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        trip.published ? "bg-teal-50 text-teal-700" : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {trip.published ? "Live" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <Link
                        href={`/admin/trips/${trip.id}/edit`}
                        className="font-bold text-[#0F9B9B] hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => onDelete(trip)}
                        className="font-bold text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
