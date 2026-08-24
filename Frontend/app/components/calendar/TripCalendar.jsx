"use client";

import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Calendar, MapPin, DollarSign, Globe, Compass, ArrowRight } from "lucide-react";
import { formatDualPrice } from "../../utils/formatPrice";

export default function TripCalendar({ trips = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date("2026-07-01"));
  const [filterType, setFilterType] = useState("All"); // "All", "India", "International"
  const [hoveredTripId, setHoveredTripId] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);

  const allTrips = useMemo(() => {
    return trips.map((trip) => {
      const type = trip.destination === "International" ? "International" : "India";
      const isIndia = type === "India";
      return {
        ...trip,
        type,
        color: isIndia ? "#D4AF37" : "#06B6D4",
        bgClass: isIndia
          ? "bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30"
          : "bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/30",
        dotClass: isIndia ? "bg-[#D4AF37]" : "bg-[#06B6D4]",
      };
    });
  }, [trips]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedCell(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedCell(null);
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const currentMonthName = monthNames[month];

  // Helper to check if a trip overlaps with the currently selected month
  const isTripInMonth = (trip, m, y) => {
    const tripStart = new Date(trip.startDate);
    const tripEnd = new Date(trip.endDate);
    const monthStart = new Date(y, m, 1);
    const monthEnd = new Date(y, m + 1, 0); // Last day of month
    return tripStart <= monthEnd && tripEnd >= monthStart;
  };

  // Trips in the current month matching the filter
  const tripsInMonth = useMemo(() => {
    return allTrips.filter((trip) => {
      const matchesFilter = filterType === "All" || trip.type === filterType;
      const matchesMonth = isTripInMonth(trip, month, year);
      return matchesFilter && matchesMonth;
    }).sort((a, b) => a.startDate.localeCompare(b.startDate));
  }, [allTrips, month, year, filterType]);

  // Generate calendar days
  const calendarCells = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthTotalDays = new Date(year, month, 0).getDate();
    
    const cells = [];

    // Padding from previous month
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = prevMonthTotalDays - i;
      const pMonth = month === 0 ? 11 : month - 1;
      const pYear = month === 0 ? year - 1 : year;
      const dateStr = `${pYear}-${String(pMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      cells.push({
        day: d,
        month: pMonth,
        year: pYear,
        isCurrentMonth: false,
        dateString: dateStr,
      });
    }

    // Days of current month
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      cells.push({
        day: d,
        month: month,
        year: year,
        isCurrentMonth: true,
        dateString: dateStr,
      });
    }

    // Padding for next month to make perfect grid of weeks
    const remaining = 42 - cells.length;
    const nMonth = month === 11 ? 0 : month + 1;
    const nYear = month === 11 ? year + 1 : year;
    for (let d = 1; d <= remaining; d++) {
      const dateStr = `${nYear}-${String(nMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      cells.push({
        day: d,
        month: nMonth,
        year: nYear,
        isCurrentMonth: false,
        dateString: dateStr,
      });
    }

    return cells;
  }, [year, month]);

  // Find active trips for a specific date
  const getTripsForDate = useCallback(
    (dateString) => {
      return allTrips.filter((trip) => {
        const matchesFilter = filterType === "All" || trip.type === filterType;
        const isActive = dateString >= trip.startDate && dateString <= trip.endDate;
        return matchesFilter && isActive;
      });
    },
    [allTrips, filterType],
  );

  // Selected cell trips
  const selectedCellTrips = useMemo(() => {
    if (!selectedCell) return [];
    return getTripsForDate(selectedCell.dateString);
  }, [selectedCell, getTripsForDate]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Category Tabs & Navigation Row */}
      <div className="mb-8 flex flex-col items-center justify-between gap-6 border-b border-white/10 pb-6 md:flex-row">
        {/* Month Selector */}
        <div className="flex items-center gap-4">
          <button
            onClick={handlePrevMonth}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-neutral-900 transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <h2 className="min-w-44 text-center text-xl font-bold tracking-tight text-white sm:text-2xl">
            {currentMonthName} {year}
          </h2>

          <button
            onClick={handleNextMonth}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-neutral-900 transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex rounded-full border border-white/10 bg-[#000000] p-1">
          {["All", "India", "International"].map((type) => (
            <button
              key={type}
              onClick={() => {
                setFilterType(type);
                setSelectedCell(null);
              }}
              className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                filterType === type
                  ? "bg-[#D4AF37] text-black font-bold shadow-[0_4px_12px_rgba(212,175,55,0.2)]"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {type} Trips
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Side: Calendar (2/3 width) */}
        <div className="lg:col-span-2">
          <div className="rounded-3xl border border-white/10 bg-[#000000] p-4 shadow-2xl md:p-6">
            {/* Days of week header */}
            <div className="grid grid-cols-7 mb-4 text-center text-xs font-bold uppercase tracking-wider text-white/50">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="py-2">{day}</div>
              ))}
            </div>

            {/* Grid of days */}
            <div className="grid grid-cols-7 gap-1.5 md:gap-2">
              {calendarCells.map((cell, idx) => {
                const cellTrips = getTripsForDate(cell.dateString);
                const hasTrips = cellTrips.length > 0;
                const isSelected = selectedCell && selectedCell.dateString === cell.dateString;
                
                // Highlight states
                const isHovered = hoveredDate === cell.dateString;
                const matchesHoveredTrip = hoveredTripId && cellTrips.some(t => t.id === hoveredTripId);

                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredDate(cell.dateString)}
                    onMouseLeave={() => setHoveredDate(null)}
                    onClick={() => {
                      if (hasTrips) {
                        setSelectedCell(isSelected ? null : cell);
                      }
                    }}
                    className={`relative min-h-[90px] sm:min-h-[110px] rounded-2xl border p-2 flex flex-col justify-between transition-all duration-300 cursor-pointer ${
                      cell.isCurrentMonth
                        ? "bg-neutral-900/60 hover:bg-neutral-900 border-white/5"
                        : "bg-neutral-950/20 border-white/0 text-white/20"
                    } ${
                      isSelected
                        ? "ring-2 ring-[#D4AF37] bg-neutral-900 border-[#D4AF37]/50 shadow-[0_0_15px_rgba(212,175,55,0.15)]"
                        : ""
                    } ${
                      matchesHoveredTrip
                        ? "border-[#D4AF37]/80 bg-[#D4AF37]/5 shadow-[0_0_20px_rgba(212,175,55,0.1)] scale-[1.01]"
                        : ""
                    } ${
                      isHovered && hasTrips
                        ? "border-white/20 bg-neutral-900"
                        : ""
                    }`}
                  >
                    {/* Day number */}
                    <span className={`self-end text-xs font-bold sm:text-sm ${
                      cell.isCurrentMonth
                        ? isSelected
                          ? "text-[#D4AF37]"
                          : "text-white/60"
                        : "text-white/10"
                    }`}>
                      {cell.day}
                    </span>

                    {/* Trips list inside cell */}
                    <div className="mt-1 space-y-1">
                      {cell.isCurrentMonth && cellTrips.slice(0, 2).map((trip) => {
                        const isTripActive = hoveredTripId === trip.id;
                        return (
                          <div
                            key={trip.id + trip.type}
                            onMouseEnter={() => setHoveredTripId(trip.id)}
                            onMouseLeave={() => setHoveredTripId(null)}
                            className={`group relative text-[9px] sm:text-[10px] font-semibold truncate rounded-lg px-2 py-0.5 border transition-all duration-300 ${trip.bgClass} ${
                              isTripActive ? "ring-1 ring-white/30 scale-[1.02] shadow-lg" : ""
                            }`}
                          >
                            {trip.shortName}
                          </div>
                        );
                      })}
                      {cell.isCurrentMonth && cellTrips.length > 2 && (
                        <div className="text-[9px] sm:text-[10px] font-bold text-center text-[#D4AF37] pt-0.5">
                          +{cellTrips.length - 2} more
                        </div>
                      )}
                    </div>

                    {/* Subtle dot at the bottom for mobile */}
                    {hasTrips && (
                      <div className="flex justify-center gap-1 mt-1 sm:hidden">
                        {cellTrips.map((trip) => (
                          <span key={trip.id + trip.type} className={`h-1.5 w-1.5 rounded-full ${trip.dotClass}`} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Trips in Selected Month / selected day details */}
        <div className="lg:col-span-1">
          {/* Selected Day View Details (Populates when clicking a date in the calendar) */}
          {selectedCell && selectedCellTrips.length > 0 ? (
            <div className="mb-6 rounded-3xl border border-[#D4AF37]/30 bg-neutral-900/60 p-5 shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#D4AF37]">
                  Trips on {selectedCell.day} {currentMonthName}
                </h3>
                <button
                  onClick={() => setSelectedCell(null)}
                  className="text-xs font-semibold text-white/50 hover:text-white"
                >
                  Clear Selection
                </button>
              </div>

              <div className="space-y-4">
                {selectedCellTrips.map((trip) => (
                  <div key={trip.id + trip.type} className="group relative rounded-2xl bg-black p-3 border border-white/5 hover:border-white/10 transition duration-300">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-white text-sm line-clamp-1 flex-1">{trip.title}</h4>
                      {trip.soldOut && (
                        <span className="rounded-full bg-red-500/15 text-red-400 border border-red-500/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider shrink-0">
                          Sold Out
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/60 mt-1 flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-[#D4AF37]" />
                      {trip.dates}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs font-semibold text-[#D4AF37]">
                        {formatDualPrice(trip.price, { useRupeeSymbol: true })}
                      </span>
                      <Link
                        href={trip.type === "India" ? `/india-trips/${trip.slug}` : `/international-trips/${trip.slug}`}
                        className="text-xs font-bold text-white flex items-center gap-1 group-hover:text-[#D4AF37] transition"
                      >
                        Details <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Month Summary panel */}
          <div className="rounded-3xl border border-white/10 bg-[#000000] p-6 shadow-2xl">
            <h3 className="mb-5 text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <Compass className="h-5 w-5 text-[#D4AF37]" />
              Scheduled in {currentMonthName}
            </h3>

            {tripsInMonth.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-white/40">
                <Calendar className="h-10 w-10 text-white/20 mb-3" />
                <p className="text-sm font-semibold">No group trips scheduled</p>
                <p className="text-xs mt-1 text-white/30">Select another month or apply different filter.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1 scrollbar-hide">
                {tripsInMonth.map((trip) => {
                  // Check if this card's trip is active on the hovered date
                  const isHighlighted = hoveredDate && (hoveredDate >= trip.startDate && hoveredDate <= trip.endDate);
                  const isCardHovered = hoveredTripId === trip.id;

                  return (
                    <div
                      key={trip.id + trip.type}
                      onMouseEnter={() => setHoveredTripId(trip.id)}
                      onMouseLeave={() => setHoveredTripId(null)}
                      className={`group flex items-start gap-4 rounded-2xl border p-3.5 transition-all duration-300 ${
                        isHighlighted || isCardHovered
                          ? "bg-neutral-900 border-[#D4AF37]/50 shadow-[0_8px_20px_rgba(212,175,55,0.08)] scale-[1.02]"
                          : "bg-neutral-950 border-white/5 hover:bg-neutral-900 hover:border-white/10"
                      }`}
                    >
                      {/* Image Thumbnail */}
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-neutral-800">
                        <img
                          src={trip.image}
                          alt={trip.shortName}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                            trip.type === "India"
                              ? "bg-[#D4AF37]/10 text-[#D4AF37]"
                              : "bg-[#06B6D4]/10 text-[#06B6D4]"
                          }`}>
                            {trip.type}
                          </span>
                          {trip.soldOut && (
                            <span className="rounded-full bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                              Sold Out
                            </span>
                          )}
                          <span className="text-[10px] text-white/40 font-semibold uppercase tracking-wider">
                            {trip.duration}
                          </span>
                        </div>

                        <h4 className="mt-1 text-sm font-bold text-white truncate group-hover:text-[#D4AF37] transition">
                          {trip.title}
                        </h4>

                        <p className="mt-1 text-xs text-white/60 line-clamp-1 flex items-center gap-1 font-medium">
                          <MapPin className="h-3.5 w-3.5 text-[#D4AF37] shrink-0" />
                          {trip.route ? trip.route.split(" - ").slice(0, 3).join(" → ") : trip.pickupLocation}
                        </p>

                        <div className="mt-2.5 flex items-center justify-between">
                          <div className="flex items-baseline gap-0.5">
                            <span className="text-[10px] font-semibold text-white/40">From</span>
                            <span className="text-sm font-extrabold text-white">
                              {formatDualPrice(trip.price, { useRupeeSymbol: true })}
                            </span>
                          </div>
                          
                          <Link
                            href={trip.type === "India" ? `/india-trips/${trip.slug}` : `/international-trips/${trip.slug}`}
                            className="flex items-center gap-1 rounded-full bg-white/5 hover:bg-[#D4AF37] px-3 py-1 text-[11px] font-bold text-white hover:text-black transition-all duration-300"
                          >
                            Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
