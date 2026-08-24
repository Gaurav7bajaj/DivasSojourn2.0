"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Trip } from "@/app/lib/data/types";

export default function TripsAdminClient() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

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
    // Fetch on mount without calling setState synchronously in the effect
    // body (react-hooks/set-state-in-effect fails `next build`'s lint step
    // otherwise). `loading`/`error` already start at the right values, so
    // this only needs to set state after the request resolves.
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

      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm">
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
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[#666666]">
                  Loading trips...
                </td>
              </tr>
            ) : trips.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-[#666666]">
                  No trips yet.
                </td>
              </tr>
            ) : (
              trips.map((trip) => (
                <tr key={trip.id} className="border-t border-black/5">
                  <td className="px-4 py-3 font-semibold">{trip.shortName || trip.title}</td>
                  <td className="px-4 py-3">{trip.destination}</td>
                  <td className="px-4 py-3 text-[#555555]">{trip.dates || `${trip.startDate} → ${trip.endDate}`}</td>
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
                        onClick={() => handleDelete(trip)}
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
    </div>
  );
}
