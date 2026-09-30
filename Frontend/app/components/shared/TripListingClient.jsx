"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import TripFilters, { formatMonthLabel } from "./TripFilters";
import UpcomingTripCard from "../upcoming/UpcomingTripCard";
import { buildCountryOptions } from "../../lib/data/tripCountry";
import { buildRegionOptions } from "../../lib/data/tripRegion";

const DEFAULT_DURATION = [2, 16];
const DEFAULT_BUDGET = [23000, 1000000];
const SORT_OPTIONS = [
  { value: "soonest", label: "Soonest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

function primaryParamKey(primaryGroup) {
  if (primaryGroup === "country") return "country";
  if (primaryGroup === "region") return "region";
  return "destination";
}

function tripPrimaryValue(trip, primaryGroup) {
  if (primaryGroup === "country") return trip.country;
  if (primaryGroup === "region") return trip.region;
  return trip.destination;
}

function parseFilters(searchParams, primaryGroup) {
  const primaryKey = primaryParamKey(primaryGroup);
  const primaryValue = searchParams.get(primaryKey) || "all";
  const month = searchParams.get("month") || "all";
  const durationMin = Number(searchParams.get("durationMin") || DEFAULT_DURATION[0]);
  const durationMax = Number(searchParams.get("durationMax") || DEFAULT_DURATION[1]);
  const budgetMin = Number(searchParams.get("budgetMin") || DEFAULT_BUDGET[0]);
  const budgetMax = Number(searchParams.get("budgetMax") || DEFAULT_BUDGET[1]);
  const sort = searchParams.get("sort") || "soonest";

  return {
    primaryValue,
    month,
    duration: [
      Number.isFinite(durationMin) ? durationMin : DEFAULT_DURATION[0],
      Number.isFinite(durationMax) ? durationMax : DEFAULT_DURATION[1],
    ],
    budget: [
      Number.isFinite(budgetMin) ? budgetMin : DEFAULT_BUDGET[0],
      Number.isFinite(budgetMax) ? budgetMax : DEFAULT_BUDGET[1],
    ],
    sort: SORT_OPTIONS.some((option) => option.value === sort) ? sort : "soonest",
  };
}

function filtersToParams(filters, primaryGroup) {
  const params = new URLSearchParams();
  const primaryKey = primaryParamKey(primaryGroup);
  if (filters.primaryValue !== "all") params.set(primaryKey, filters.primaryValue);
  if (filters.month !== "all") params.set("month", filters.month);
  if (filters.duration[0] !== DEFAULT_DURATION[0] || filters.duration[1] !== DEFAULT_DURATION[1]) {
    params.set("durationMin", String(filters.duration[0]));
    params.set("durationMax", String(filters.duration[1]));
  }
  if (filters.budget[0] !== DEFAULT_BUDGET[0] || filters.budget[1] !== DEFAULT_BUDGET[1]) {
    params.set("budgetMin", String(filters.budget[0]));
    params.set("budgetMax", String(filters.budget[1]));
  }
  if (filters.sort !== "soonest") params.set("sort", filters.sort);
  return params;
}

/**
 * Shared trip listing: sticky TripFilters + results grid + URL sync.
 */
export default function TripListingClient({
  trips = [],
  months = [],
  primaryGroup = "destination",
  showMobileDestinationChips = true,
  getBadgeLabel,
  sectionId = "departures",
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState(() => parseFilters(searchParams, primaryGroup));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef(null);
  const drawerRef = useRef(null);
  const filterTriggerRef = useRef(null);
  const sliderTimer = useRef(null);

  useEffect(() => {
    setFilters(parseFilters(searchParams, primaryGroup));
  }, [searchParams, primaryGroup]);

  const pushFilters = useCallback(
    (next) => {
      const params = filtersToParams(next, primaryGroup);
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, primaryGroup, router],
  );

  const updateFilters = useCallback(
    (patch, { debounceMs = 0 } = {}) => {
      setFilters((current) => {
        const next = { ...current, ...patch };
        if (debounceMs > 0) {
          window.clearTimeout(sliderTimer.current);
          sliderTimer.current = window.setTimeout(() => pushFilters(next), debounceMs);
        } else {
          pushFilters(next);
        }
        return next;
      });
    },
    [pushFilters],
  );

  useEffect(() => () => window.clearTimeout(sliderTimer.current), []);

  useEffect(() => {
    if (!isSortOpen && !isDrawerOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsSortOpen(false);
        setIsDrawerOpen(false);
        filterTriggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isSortOpen, isDrawerOpen]);

  useEffect(() => {
    if (!isSortOpen) return undefined;
    const onPointer = (event) => {
      if (!sortRef.current?.contains(event.target)) setIsSortOpen(false);
    };
    window.addEventListener("pointerdown", onPointer);
    return () => window.removeEventListener("pointerdown", onPointer);
  }, [isSortOpen]);

  useEffect(() => {
    if (!isDrawerOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusable = drawerRef.current?.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    focusable?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isDrawerOpen]);

  const primaryOptions = useMemo(() => {
    if (primaryGroup === "country") {
      const countries = buildCountryOptions(trips);
      return [
        { value: "all", label: "All countries", count: trips.length },
        ...countries,
      ];
    }
    if (primaryGroup === "region") {
      const regions = buildRegionOptions(trips);
      return [
        { value: "all", label: "All regions", count: trips.length },
        ...regions,
      ];
    }
    return [
      { value: "all", label: "All trips", count: trips.length },
      {
        value: "India",
        label: "India",
        count: trips.filter((trip) => trip.destination === "India").length,
      },
      {
        value: "International",
        label: "International",
        count: trips.filter((trip) => trip.destination === "International").length,
      },
    ];
  }, [primaryGroup, trips]);

  const monthCounts = useMemo(() => {
    const counts = {};
    trips.forEach((trip) => {
      const key = trip.startDate.slice(0, 7);
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [trips]);

  const filteredTrips = useMemo(() => {
    const list = trips.filter((trip) => {
      const tripMonth = trip.startDate.slice(0, 7);
      const primaryMatches =
        filters.primaryValue === "all" ||
        tripPrimaryValue(trip, primaryGroup) === filters.primaryValue;
      const monthMatches = filters.month === "all" || tripMonth === filters.month;
      const durationMatches =
        trip.duration.nights >= filters.duration[0] &&
        trip.duration.nights <= filters.duration[1];
      const budgetMatches =
        trip.currentPrice >= filters.budget[0] && trip.currentPrice <= filters.budget[1];
      return primaryMatches && monthMatches && durationMatches && budgetMatches;
    });

    const sorted = [...list];
    if (filters.sort === "price-asc") sorted.sort((a, b) => a.currentPrice - b.currentPrice);
    else if (filters.sort === "price-desc") sorted.sort((a, b) => b.currentPrice - a.currentPrice);
    else sorted.sort((a, b) => a.startDate.localeCompare(b.startDate));
    return sorted;
  }, [filters, primaryGroup, trips]);

  const activeChips = useMemo(() => {
    const chips = [];
    if (filters.primaryValue !== "all") {
      chips.push({
        id: "primary",
        label: filters.primaryValue,
        clear: () => updateFilters({ primaryValue: "all" }),
      });
    }
    if (filters.month !== "all") {
      chips.push({
        id: "month",
        label: formatMonthLabel(filters.month),
        clear: () => updateFilters({ month: "all" }),
      });
    }
    if (
      filters.duration[0] !== DEFAULT_DURATION[0] ||
      filters.duration[1] !== DEFAULT_DURATION[1]
    ) {
      chips.push({
        id: "duration",
        label: `${filters.duration[0]}–${filters.duration[1]}N`,
        clear: () => updateFilters({ duration: DEFAULT_DURATION }),
      });
    }
    if (filters.budget[0] !== DEFAULT_BUDGET[0] || filters.budget[1] !== DEFAULT_BUDGET[1]) {
      chips.push({
        id: "budget",
        label: `₹${Math.round(filters.budget[0] / 1000)}K–₹${
          filters.budget[1] >= 100000
            ? `${Math.round(filters.budget[1] / 100000)}L`
            : `${Math.round(filters.budget[1] / 1000)}K`
        }`,
        clear: () => updateFilters({ budget: DEFAULT_BUDGET }),
      });
    }
    return chips;
  }, [filters, updateFilters]);

  const activeFilterCount = activeChips.length;
  const sortLabel =
    SORT_OPTIONS.find((option) => option.value === filters.sort)?.label || "Soonest first";

  const clearAll = () => {
    const next = {
      primaryValue: "all",
      month: "all",
      duration: DEFAULT_DURATION,
      budget: DEFAULT_BUDGET,
      sort: filters.sort,
    };
    setFilters(next);
    pushFilters(next);
  };

  const sidebarProps = {
    primaryGroup,
    primaryValue: filters.primaryValue,
    primaryOptions,
    onPrimaryChange: (primaryValue) => updateFilters({ primaryValue }),
    month: filters.month,
    duration: filters.duration,
    budget: filters.budget,
    months,
    monthCounts,
    totalTripCount: trips.length,
    onMonthChange: (month) => updateFilters({ month }),
    onDurationChange: (duration) => updateFilters({ duration }, { debounceMs: 250 }),
    onBudgetChange: (budget) => updateFilters({ budget }, { debounceMs: 250 }),
    onClear: clearAll,
  };

  return (
    <section
      id={sectionId || undefined}
      className="scroll-mt-28 border-t border-white/8 bg-[#0B0B0C] px-5 pb-16 pt-8 md:px-12 md:pb-20 xl:px-24"
    >
      {showMobileDestinationChips && primaryGroup === "destination" ? (
        <div className="mb-4 md:hidden">
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {primaryOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => updateFilters({ primaryValue: option.value })}
                className={`snap-start whitespace-nowrap rounded-full px-4 py-2 font-[family-name:var(--font-dm-sans)] text-[13px] font-bold ${
                  filters.primaryValue === option.value
                    ? "bg-[#D6AE3C] text-[#1A1405]"
                    : "border border-white/15 text-[#FBF8F1]"
                }`}
              >
                {option.label}
              </button>
            ))}
            {months.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() =>
                  updateFilters({ month: filters.month === item.value ? "all" : item.value })
                }
                className={`snap-start whitespace-nowrap rounded-full px-4 py-2 font-[family-name:var(--font-dm-sans)] text-[13px] font-bold ${
                  filters.month === item.value
                    ? "bg-[#D6AE3C] text-[#1A1405]"
                    : "border border-white/15 text-[#FBF8F1]"
                }`}
              >
                {formatMonthLabel(item.value)}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {primaryGroup === "country" || primaryGroup === "region" ? (
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1 md:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {primaryOptions.slice(0, 8).map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => updateFilters({ primaryValue: option.value })}
              className={`snap-start whitespace-nowrap rounded-full px-4 py-2 font-[family-name:var(--font-dm-sans)] text-[13px] font-bold ${
                filters.primaryValue === option.value
                  ? "bg-[#D6AE3C] text-[#1A1405]"
                  : "border border-white/15 text-[#FBF8F1]"
              }`}
            >
              {option.label}
            </button>
          ))}
          {months.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() =>
                updateFilters({ month: filters.month === item.value ? "all" : item.value })
              }
              className={`snap-start whitespace-nowrap rounded-full px-4 py-2 font-[family-name:var(--font-dm-sans)] text-[13px] font-bold ${
                filters.month === item.value
                  ? "bg-[#D6AE3C] text-[#1A1405]"
                  : "border border-white/15 text-[#FBF8F1]"
              }`}
            >
              {formatMonthLabel(item.value)}
            </button>
          ))}
        </div>
      ) : null}

      <div className="flex items-start gap-10">
        <div className="sticky top-28 hidden max-h-[calc(100vh-8rem)] w-[300px] shrink-0 self-start overflow-y-auto overscroll-contain lg:block [scrollbar-width:thin] [scrollbar-color:rgba(214,174,60,0.55)_rgba(255,255,255,0.08)] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-white/8 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[rgba(214,174,60,0.55)] [&::-webkit-scrollbar-thumb:hover]:bg-[#D6AE3C]">
          <TripFilters {...sidebarProps} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex min-h-12 flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
              <p className="font-[family-name:var(--font-dm-sans)] text-[15px] text-[#C9C3B6]">
                Showing{" "}
                <strong className="font-bold text-[#FBF8F1]">{filteredTrips.length}</strong> of{" "}
                {trips.length} trips
              </p>
              <div className="hidden flex-wrap gap-2 md:flex">
                {activeChips.map((chip) => (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={chip.clear}
                    aria-label={`Remove filter ${chip.label}`}
                    className="inline-flex h-[34px] items-center gap-1.5 rounded-full border border-[rgba(214,174,60,0.5)] bg-[rgba(214,174,60,0.12)] px-3 font-[family-name:var(--font-dm-sans)] text-[13px] font-bold text-[#D6AE3C]"
                  >
                    {chip.label}
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                ref={filterTriggerRef}
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="inline-flex h-12 items-center gap-2 rounded-[14px] border border-[rgba(245,241,232,0.2)] px-4 font-[family-name:var(--font-dm-sans)] text-[14px] font-semibold text-[#FBF8F1] lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                Filters
                {activeFilterCount > 0 ? (
                  <span className="rounded-full bg-[#D6AE3C] px-1.5 py-0.5 text-[11px] font-bold text-[#1A1405]">
                    {activeFilterCount}
                  </span>
                ) : null}
              </button>

              <div className="relative" ref={sortRef}>
                <button
                  type="button"
                  aria-haspopup="listbox"
                  aria-expanded={isSortOpen}
                  onClick={() => setIsSortOpen((open) => !open)}
                  className="inline-flex h-12 items-center gap-2 rounded-[14px] border border-[rgba(245,241,232,0.2)] px-4 font-[family-name:var(--font-dm-sans)] text-[14px] font-semibold text-[#FBF8F1]"
                >
                  Sort: <span className="text-[#D6AE3C]">{sortLabel}</span>
                  <ChevronDown className="h-4 w-4" aria-hidden="true" />
                </button>
                {isSortOpen ? (
                  <ul
                    role="listbox"
                    className="absolute right-0 z-20 mt-2 min-w-[220px] overflow-hidden rounded-[14px] border border-white/8 bg-[#141417] py-1 shadow-xl"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <li key={option.value}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={filters.sort === option.value}
                          onClick={() => {
                            updateFilters({ sort: option.value });
                            setIsSortOpen(false);
                          }}
                          className={`flex w-full px-4 py-3 text-left font-[family-name:var(--font-dm-sans)] text-[14px] ${
                            filters.sort === option.value
                              ? "bg-[rgba(214,174,60,0.12)] font-bold text-[#D6AE3C]"
                              : "text-[#FBF8F1] hover:bg-white/5"
                          }`}
                        >
                          {option.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          </div>

          {filteredTrips.length === 0 ? (
            <div className="mt-6 rounded-[20px] border border-dashed border-white/15 px-6 py-16 text-center">
              <p className="font-[family-name:var(--font-dm-sans)] text-[16px] text-[#C9C3B6]">
                No trips match these filters.
              </p>
              <button
                type="button"
                onClick={clearAll}
                className="mt-5 inline-flex h-11 items-center rounded-full bg-[#D6AE3C] px-6 font-[family-name:var(--font-dm-sans)] text-[14px] font-bold text-[#1A1405] transition hover:bg-[#E6BF4C]"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-7 md:grid-cols-2">
              {filteredTrips.map((trip, index) => (
                <UpcomingTripCard
                  key={trip.id}
                  trip={trip}
                  priority={index < 2}
                  variant="dark"
                  badgeLabel={getBadgeLabel?.(trip)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {isDrawerOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            aria-label="Close filters"
            onClick={() => {
              setIsDrawerOpen(false);
              filterTriggerRef.current?.focus();
            }}
          />
          <div
            ref={drawerRef}
            className="absolute inset-y-0 left-0 flex w-[min(100%,340px)] flex-col bg-[#0B0B0C] shadow-2xl max-md:inset-x-0 max-md:top-auto max-md:bottom-0 max-md:h-[85vh] max-md:w-full max-md:rounded-t-[24px]"
          >
            <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
              <p className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-[#FBF8F1]">
                Filters
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsDrawerOpen(false);
                  filterTriggerRef.current?.focus();
                }}
                className="rounded-full border border-white/15 p-2 text-[#FBF8F1]"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <TripFilters {...sidebarProps} />
            </div>
            <div className="sticky bottom-0 flex gap-3 border-t border-white/8 bg-[#0B0B0C] p-4">
              <button
                type="button"
                onClick={clearAll}
                className="h-12 flex-1 rounded-full border border-white/20 font-[family-name:var(--font-dm-sans)] text-[14px] font-bold text-[#FBF8F1]"
              >
                Clear all
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsDrawerOpen(false);
                  filterTriggerRef.current?.focus();
                }}
                className="h-12 flex-1 rounded-full bg-[#D6AE3C] font-[family-name:var(--font-dm-sans)] text-[14px] font-bold text-[#1A1405]"
              >
                Show {filteredTrips.length} trips
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
