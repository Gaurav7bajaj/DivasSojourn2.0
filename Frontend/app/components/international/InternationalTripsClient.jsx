"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import FilterSidebar from "../upcoming/FilterSidebar";
import MonthFilterButtons from "../upcoming/MonthFilterButtons";
import UpcomingTripsGrid from "../upcoming/UpcomingTripsGrid";

const defaultFilters = {
  destinations: ["International"],
  duration: [2, 16],
  budget: [8000, 400000],
  months: [],
};

export default function InternationalTripsClient({ trips = [], months = [] }) {
  const [draftFilters, setDraftFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const router = useRouter();

  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      const tripMonth = trip.startDate.slice(0, 7);

      const durationMatches =
        trip.duration.nights >= appliedFilters.duration[0] &&
        trip.duration.nights <= appliedFilters.duration[1];
      const budgetMatches =
        trip.currentPrice >= appliedFilters.budget[0] &&
        trip.currentPrice <= appliedFilters.budget[1];
      const monthMatches =
        appliedFilters.months.length === 0 || appliedFilters.months.includes(tripMonth);

      return durationMatches && budgetMatches && monthMatches;
    });
  }, [appliedFilters, trips]);

  const toggleArrayValue = (key, value) => {
    setDraftFilters((currentFilters) => {
      const currentValues = currentFilters[key];
      const nextValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];

      return { ...currentFilters, [key]: nextValues };
    });
  };

  const applyFilters = () => {
    setAppliedFilters(draftFilters);
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    setDraftFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    setIsFilterOpen(false);
  };

  const sidebarProps = {
    months,
    draftFilters,
    onDestinationChange: (destination) => {
      if (destination === "India") {
        router.push("/india-trips");
      }
    },
    onDurationChange: (duration) => setDraftFilters((filters) => ({ ...filters, duration })),
    onBudgetChange: (budget) => setDraftFilters((filters) => ({ ...filters, budget })),
    onMonthChange: (month) => toggleArrayValue("months", month),
    onApply: applyFilters,
    onClear: clearFilters,
  };

  const toggleMonthAndApply = (month) => {
    setDraftFilters((currentFilters) => {
      const nextMonths = currentFilters.months.includes(month)
        ? currentFilters.months.filter((item) => item !== month)
        : [...currentFilters.months, month];
      const nextFilters = { ...currentFilters, months: nextMonths };
      setAppliedFilters(nextFilters);
      return nextFilters;
    });
  };

  return (
    <section className="bg-[#1A1A1A] px-4 pb-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5">
          <MonthFilterButtons
            months={months}
            selectedMonths={draftFilters.months}
            onToggleMonth={toggleMonthAndApply}
          />
        </div>

        <button
          type="button"
          onClick={() => setIsFilterOpen((value) => !value)}
          className="mb-5 flex w-full items-center justify-center gap-2 rounded-full border border-[#D4AF37]/40 px-5 py-3 font-black uppercase tracking-wide text-[#D4AF37] lg:hidden"
          aria-expanded={isFilterOpen}
        >
          <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />
          {isFilterOpen ? "Hide Filters" : "Show Filters"}
        </button>

        <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
          <div className={isFilterOpen ? "block" : "hidden lg:block"}>
            <FilterSidebar {...sidebarProps} destinationOptions={["India", "International"]} />
          </div>
          <UpcomingTripsGrid trips={filteredTrips} totalCount={trips.length} />
        </div>
      </div>
    </section>
  );
}
