"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, ImageIcon, X } from "lucide-react";
import { inrToUsd } from "../../utils/formatPrice";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const FILTERS = [
  { value: "all", label: "All trips" },
  { value: "india", label: "India" },
  { value: "international", label: "International" },
];
const MAX_LANES = 2;
const DEFAULT_MONTH = "2026-07";

const inrFmt = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
const usdFmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const shortDateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

function pad2(n) {
  return String(n).padStart(2, "0");
}

function toMonthKey(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}`;
}

function parseMonthKey(value) {
  const match = /^(\d{4})-(\d{2})$/.exec(String(value || ""));
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  if (!Number.isFinite(year) || month < 0 || month > 11) return null;
  return new Date(year, month, 1);
}

function parseType(value) {
  const v = String(value || "all").toLowerCase();
  if (v === "india" || v === "international") return v;
  return "all";
}

function typeMatches(tripType, filter) {
  if (filter === "all") return true;
  return tripType.toLowerCase() === filter;
}

function tripHref(trip) {
  return trip.type === "India"
    ? `/india-trips/${trip.slug}`
    : `/international-trips/${trip.slug}`;
}

function formatRoute(trip) {
  if (trip.route) {
    return trip.route
      .split(/\s*[-–—>→]+\s*/)
      .filter(Boolean)
      .slice(0, 3)
      .join(" → ");
  }
  const pickup = (trip.pickupLocation || "").trim();
  const drop = (trip.dropLocation || "").trim();
  if (pickup && drop && pickup !== drop) return `${pickup} → ${drop}`;
  return pickup || drop || "";
}

function durationLabel(trip) {
  if (trip.nights && trip.days) return `${trip.nights}N / ${trip.days}D`;
  return trip.duration || "";
}

function displayPrice(trip) {
  return trip.earlyBirdPrice || trip.price || 0;
}

function buildCalendarCells(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const prevMonthTotal = new Date(year, month, 0).getDate();
  const cells = [];

  for (let i = firstDay - 1; i >= 0; i -= 1) {
    const d = prevMonthTotal - i;
    const pMonth = month === 0 ? 11 : month - 1;
    const pYear = month === 0 ? year - 1 : year;
    cells.push({
      day: d,
      month: pMonth,
      year: pYear,
      isCurrentMonth: false,
      dateString: `${pYear}-${pad2(pMonth + 1)}-${pad2(d)}`,
    });
  }

  for (let d = 1; d <= totalDays; d += 1) {
    cells.push({
      day: d,
      month,
      year,
      isCurrentMonth: true,
      dateString: `${year}-${pad2(month + 1)}-${pad2(d)}`,
    });
  }

  const remaining = 42 - cells.length;
  const nMonth = month === 11 ? 0 : month + 1;
  const nYear = month === 11 ? year + 1 : year;
  for (let d = 1; d <= remaining; d += 1) {
    cells.push({
      day: d,
      month: nMonth,
      year: nYear,
      isCurrentMonth: false,
      dateString: `${nYear}-${pad2(nMonth + 1)}-${pad2(d)}`,
    });
  }

  return cells;
}

function rangesOverlap(aStart, aSpan, bStart, bSpan) {
  const aEnd = aStart + aSpan;
  const bEnd = bStart + bSpan;
  return aStart < bEnd && bStart < aEnd;
}

/**
 * Build per-week trip segments with greedy lane assignment.
 */
function buildWeekLayouts(trips, weeks, monthStart, monthEnd) {
  return weeks.map((weekCells) => {
    const segments = [];

    trips.forEach((trip) => {
      const clipStart = trip.startDate < monthStart ? monthStart : trip.startDate;
      const clipEnd = trip.endDate > monthEnd ? monthEnd : trip.endDate;
      if (clipStart > clipEnd) return;

      let firstIdx = -1;
      let lastIdx = -1;
      weekCells.forEach((cell, idx) => {
        if (cell.dateString >= clipStart && cell.dateString <= clipEnd) {
          if (firstIdx === -1) firstIdx = idx;
          lastIdx = idx;
        }
      });
      if (firstIdx === -1) return;

      const startCol = firstIdx + 1;
      const span = lastIdx - firstIdx + 1;
      const roundLeft = trip.startDate === weekCells[firstIdx].dateString;
      const roundRight = trip.endDate === weekCells[lastIdx].dateString;

      segments.push({
        trip,
        startCol,
        span,
        roundLeft,
        roundRight,
        dateFrom: weekCells[firstIdx].dateString,
        dateTo: weekCells[lastIdx].dateString,
      });
    });

    segments.sort((a, b) => a.startCol - b.startCol || b.span - a.span);

    const lanes = [];
    const placed = [];
    const overflow = [];

    segments.forEach((seg) => {
      let lane = 0;
      for (;;) {
        if (!lanes[lane]) lanes[lane] = [];
        const conflict = lanes[lane].some((range) =>
          rangesOverlap(seg.startCol, seg.span, range.start, range.span),
        );
        if (!conflict) break;
        lane += 1;
      }
      if (lane >= MAX_LANES) {
        overflow.push(seg);
        return;
      }
      lanes[lane].push({ start: seg.startCol, span: seg.span });
      placed.push({ ...seg, lane: lane + 1 });
    });

    const overflowByDay = {};
    overflow.forEach((seg) => {
      for (let col = seg.startCol; col < seg.startCol + seg.span; col += 1) {
        const cell = weekCells[col - 1];
        if (!cell) continue;
        if (!overflowByDay[cell.dateString]) overflowByDay[cell.dateString] = [];
        if (!overflowByDay[cell.dateString].some((t) => t.id === seg.trip.id)) {
          overflowByDay[cell.dateString].push(seg.trip);
        }
      }
    });

    return { weekCells, segments: placed, overflowByDay };
  });
}

function TripCard({ trip, selected, onSelect, cardRef }) {
  const price = displayPrice(trip);
  const isIndia = trip.type === "India";
  const accent = isIndia ? "#D6AE3C" : "#6EA8E0";
  const typeColor = isIndia ? "#E2BB4D" : "#8FBDE8";
  const route = formatRoute(trip);
  const duration = durationLabel(trip);

  return (
    <article
      ref={cardRef}
      role="button"
      tabIndex={0}
      onClick={() => onSelect(trip.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(trip.id);
        }
      }}
      className={`flex cursor-pointer gap-3.5 rounded-2xl border p-3.5 transition ${
        selected
          ? ""
          : "border-white/8 hover:border-[#D6AE3C]"
      }`}
      style={selected ? { borderColor: accent } : undefined}
      aria-pressed={selected}
    >
      <div className="relative h-[76px] w-[76px] shrink-0 overflow-hidden rounded-xl bg-[#1C1C20]">
        {trip.image ? (
          <Image
            src={trip.image}
            alt=""
            fill
            sizes="76px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#8F897D]">
            <ImageIcon className="h-6 w-6" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <p className="font-[family-name:var(--font-dm-sans)] text-[11px] font-bold uppercase tracking-[0.12em]">
          <span style={{ color: typeColor }}>{trip.type}</span>
          {duration ? (
            <span className="text-[#C9C3B6]"> · {duration}</span>
          ) : null}
        </p>
        <h4 className="line-clamp-2 font-[family-name:var(--font-dm-sans)] text-[16px] font-bold leading-snug text-[#FBF8F1]">
          {trip.title}
        </h4>
        <p className="line-clamp-2 font-[family-name:var(--font-dm-sans)] text-[13px] text-[#C9C3B6]">
          {shortDateFmt.format(new Date(`${trip.startDate}T00:00:00`))} –{" "}
          {shortDateFmt.format(new Date(`${trip.endDate}T00:00:00`))}
          {route ? ` · ${route}` : ""}
        </p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-1">
          <p className="font-[family-name:var(--font-dm-sans)]">
            <span className="text-[15px] font-bold text-[#FBF8F1]">
              ₹{inrFmt.format(price)}
            </span>{" "}
            <span className="text-[12px] text-[#C9C3B6]">
              ${usdFmt.format(inrToUsd(price))}
            </span>
          </p>
          <Link
            href={tripHref(trip)}
            onClick={(event) => event.stopPropagation()}
            className="shrink-0 font-[family-name:var(--font-dm-sans)] text-[13px] font-bold text-[#D6AE3C] transition hover:text-[#E6BF4C]"
          >
            Details →
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function TripCalendar({ trips = [] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialMonth =
    parseMonthKey(searchParams.get("month")) || parseMonthKey(DEFAULT_MONTH);
  const [currentDate, setCurrentDate] = useState(initialMonth);
  const [filterType, setFilterType] = useState(parseType(searchParams.get("type")));
  const [selectedTripId, setSelectedTripId] = useState(null);
  const [mobileDay, setMobileDay] = useState(null);
  const [overflowPopover, setOverflowPopover] = useState(null);
  const [focusCellIndex, setFocusCellIndex] = useState(null);
  const cardRefs = useRef({});
  const gridRef = useRef(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = MONTH_NAMES[month];
  const monthKey = toMonthKey(currentDate);
  const monthStart = `${year}-${pad2(month + 1)}-01`;
  const monthEnd = `${year}-${pad2(month + 1)}-${pad2(new Date(year, month + 1, 0).getDate())}`;
  const todayStr = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;
  }, []);

  useEffect(() => {
    const nextMonth = parseMonthKey(searchParams.get("month"));
    const nextType = parseType(searchParams.get("type"));
    if (nextMonth && toMonthKey(nextMonth) !== monthKey) {
      setCurrentDate(nextMonth);
    }
    if (nextType !== filterType) {
      setFilterType(nextType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync from URL only
  }, [searchParams]);

  const pushUrl = useCallback(
    (nextMonth, nextType) => {
      const params = new URLSearchParams();
      params.set("month", toMonthKey(nextMonth));
      if (nextType !== "all") params.set("type", nextType);
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  const allTrips = useMemo(
    () =>
      trips.map((trip) => ({
        ...trip,
        type: trip.destination === "International" ? "International" : "India",
      })),
    [trips],
  );

  const filteredTrips = useMemo(
    () => allTrips.filter((trip) => typeMatches(trip.type, filterType)),
    [allTrips, filterType],
  );

  const tripsInMonth = useMemo(
    () =>
      filteredTrips
        .filter((trip) => trip.startDate <= monthEnd && trip.endDate >= monthStart)
        .sort((a, b) => a.startDate.localeCompare(b.startDate)),
    [filteredTrips, monthStart, monthEnd],
  );

  const calendarCells = useMemo(() => buildCalendarCells(year, month), [year, month]);
  const weeks = useMemo(() => {
    const rows = [];
    for (let i = 0; i < calendarCells.length; i += 7) {
      rows.push(calendarCells.slice(i, i + 7));
    }
    return rows;
  }, [calendarCells]);

  const weekLayouts = useMemo(
    () => buildWeekLayouts(tripsInMonth, weeks, monthStart, monthEnd),
    [tripsInMonth, weeks, monthStart, monthEnd],
  );

  const tripsByDate = useMemo(() => {
    const map = {};
    tripsInMonth.forEach((trip) => {
      const start = trip.startDate < monthStart ? monthStart : trip.startDate;
      const end = trip.endDate > monthEnd ? monthEnd : trip.endDate;
      const cursor = new Date(`${start}T00:00:00`);
      const last = new Date(`${end}T00:00:00`);
      while (cursor <= last) {
        const key = `${cursor.getFullYear()}-${pad2(cursor.getMonth() + 1)}-${pad2(cursor.getDate())}`;
        if (!map[key]) map[key] = [];
        map[key].push(trip);
        cursor.setDate(cursor.getDate() + 1);
      }
    });
    return map;
  }, [tripsInMonth, monthStart, monthEnd]);

  const mobileList = useMemo(() => {
    if (!mobileDay) return tripsInMonth;
    return (tripsByDate[mobileDay] || []).slice().sort((a, b) => a.startDate.localeCompare(b.startDate));
  }, [mobileDay, tripsInMonth, tripsByDate]);

  const clearSelection = useCallback(() => {
    setSelectedTripId(null);
  }, []);

  const selectTrip = useCallback(
    (tripId) => {
      setSelectedTripId((current) => {
        const next = current === tripId ? null : tripId;
        if (next) {
          requestAnimationFrame(() => {
            cardRefs.current[next]?.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
            });
          });
        }
        return next;
      });
    },
    [],
  );

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") {
        clearSelection();
        setOverflowPopover(null);
        setMobileDay(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [clearSelection]);

  useEffect(() => {
    clearSelection();
    setMobileDay(null);
    setOverflowPopover(null);
  }, [monthKey, filterType, clearSelection]);

  const goMonth = (delta) => {
    const next = new Date(year, month + delta, 1);
    setCurrentDate(next);
    pushUrl(next, filterType);
  };

  const setFilter = (value) => {
    setFilterType(value);
    pushUrl(currentDate, value);
  };

  const onGridKeyDown = (event) => {
    if (focusCellIndex == null) return;
    const cols = 7;
    let next = focusCellIndex;
    if (event.key === "ArrowRight") next = Math.min(calendarCells.length - 1, focusCellIndex + 1);
    else if (event.key === "ArrowLeft") next = Math.max(0, focusCellIndex - 1);
    else if (event.key === "ArrowDown") next = Math.min(calendarCells.length - 1, focusCellIndex + cols);
    else if (event.key === "ArrowUp") next = Math.max(0, focusCellIndex - cols);
    else return;
    event.preventDefault();
    setFocusCellIndex(next);
    const el = gridRef.current?.querySelector(`[data-cell-index="${next}"]`);
    el?.focus();
  };

  const monthTitleWidth = "11ch";

  return (
    <div className="bg-[#0B0B0C]">
      {/* Controls */}
      <div className="mx-0 flex flex-col gap-4 border-b border-white/8 px-5 py-2 pb-6 md:flex-row md:items-center md:justify-between md:px-12 md:pb-6 xl:px-24">
        <div className="flex flex-wrap items-center gap-3 md:gap-4">
          <button
            type="button"
            onClick={() => goMonth(-1)}
            aria-label="Previous month"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-[#FBF8F1] transition hover:border-[#D6AE3C] hover:text-[#D6AE3C]"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <h2
            className="text-center font-[family-name:var(--font-playfair)] text-[28px] font-semibold text-[#FBF8F1] md:text-[36px]"
            style={{ minWidth: monthTitleWidth }}
          >
            {monthName}{" "}
            <span className="text-[#D6AE3C]">{year}</span>
          </h2>

          <button
            type="button"
            onClick={() => goMonth(1)}
            aria-label="Next month"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-[#FBF8F1] transition hover:border-[#D6AE3C] hover:text-[#D6AE3C]"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="ml-1 hidden items-center gap-4 sm:flex">
            <span className="inline-flex items-center gap-2 font-[family-name:var(--font-dm-sans)] text-[13px] text-[#C9C3B6]">
              <span className="h-2.5 w-2.5 rounded-[2px] bg-[#D6AE3C]" aria-hidden="true" />
              India
            </span>
            <span className="inline-flex items-center gap-2 font-[family-name:var(--font-dm-sans)] text-[13px] text-[#C9C3B6]">
              <span className="h-2.5 w-2.5 rounded-[2px] bg-[#6EA8E0]" aria-hidden="true" />
              International
            </span>
          </div>
        </div>

        <div
          className="flex w-full rounded-full bg-[#16161A] p-1 md:w-auto"
          role="tablist"
          aria-label="Trip type filter"
        >
          {FILTERS.map((option) => {
            const active = filterType === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(option.value)}
                className={`h-[42px] flex-1 whitespace-nowrap rounded-full px-4 font-[family-name:var(--font-dm-sans)] text-[13px] font-bold transition md:flex-none md:px-5 ${
                  active
                    ? "bg-[#D6AE3C] text-[#1A1405]"
                    : "text-[#C9C3B6] hover:text-[#FBF8F1]"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Layout */}
      <div className="flex flex-col items-start gap-7 px-5 py-7 pb-20 md:px-12 lg:flex-row xl:px-24">
        {/* Desktop month grid */}
        <div className="hidden min-w-0 flex-1 md:block">
          <div
            ref={gridRef}
            role="grid"
            aria-label={`${monthName} ${year} trip calendar`}
            onKeyDown={onGridKeyDown}
            className="overflow-hidden rounded-[20px] border border-white/8 bg-[#141417] p-2"
          >
            <div
              role="row"
              className="grid h-11 grid-cols-7"
            >
              {WEEKDAYS.map((day) => (
                <div
                  key={day}
                  role="columnheader"
                  className="flex items-center justify-center font-[family-name:var(--font-dm-sans)] text-[12px] font-bold uppercase tracking-[0.14em] text-[#C9C3B6]"
                >
                  {day}
                </div>
              ))}
            </div>

            {weekLayouts.map((layout, weekIndex) => (
              <div
                key={`week-${weekIndex}`}
                role="row"
                className="relative h-[128px] border-t border-white/[0.07]"
              >
                {/* Day cells */}
                <div className="absolute inset-0 grid grid-cols-7">
                  {layout.weekCells.map((cell, colIndex) => {
                    const cellIndex = weekIndex * 7 + colIndex;
                    const isToday = cell.dateString === todayStr;
                    const overflowTrips = layout.overflowByDay[cell.dateString] || [];
                    return (
                      <div
                        key={cell.dateString}
                        role="gridcell"
                        tabIndex={focusCellIndex === cellIndex || (focusCellIndex == null && cellIndex === 0) ? 0 : -1}
                        data-cell-index={cellIndex}
                        onFocus={() => setFocusCellIndex(cellIndex)}
                        className={`relative border-r border-white/[0.07] last:border-r-0 ${
                          cell.isCurrentMonth ? "" : "bg-black/25"
                        }`}
                      >
                        <span
                          className={`absolute right-2 top-2 flex h-7 w-7 items-center justify-center font-[family-name:var(--font-dm-sans)] text-[14px] font-semibold ${
                            isToday
                              ? "rounded-full bg-[#D6AE3C] text-[#1A1405]"
                              : cell.isCurrentMonth
                                ? "text-[#ECE7DC]"
                                : "text-[#55524C]"
                          }`}
                        >
                          {cell.day}
                        </span>
                        {overflowTrips.length > 0 ? (
                          <button
                            type="button"
                            className="absolute bottom-2 left-2 z-[3] min-h-11 font-[family-name:var(--font-dm-sans)] text-[11px] font-bold text-[#D6AE3C] hover:underline"
                            onClick={(event) => {
                              event.stopPropagation();
                              setOverflowPopover({
                                dateString: cell.dateString,
                                trips: overflowTrips,
                                x: event.clientX,
                                y: event.clientY,
                              });
                            }}
                          >
                            +{overflowTrips.length} more
                          </button>
                        ) : null}
                      </div>
                    );
                  })}
                </div>

                {/* Bars layer */}
                <div
                  className="pointer-events-none absolute inset-x-0 top-11 bottom-0 grid grid-cols-7 gap-y-1.5 px-0"
                  style={{ gridAutoRows: "30px", alignContent: "start" }}
                >
                  {layout.segments.map((seg) => {
                    const isIndia = seg.trip.type === "India";
                    const isSelected = selectedTripId === seg.trip.id;
                    const faded = selectedTripId && !isSelected;
                    const label = `${seg.trip.title}, ${shortDateFmt.format(new Date(`${seg.trip.startDate}T00:00:00`))}–${shortDateFmt.format(new Date(`${seg.trip.endDate}T00:00:00`))}`;

                    let bg = isIndia ? "rgba(214,174,60,.16)" : "rgba(110,168,224,.16)";
                    let border = isIndia ? "rgba(214,174,60,.45)" : "rgba(110,168,224,.45)";
                    let color = isIndia ? "#ECC95E" : "#A9CDF2";
                    if (isSelected) {
                      bg = isIndia ? "#D6AE3C" : "#6EA8E0";
                      border = bg;
                      color = isIndia ? "#1A1405" : "#0B1320";
                    }

                    const radius = [
                      seg.roundLeft ? "8px" : "0",
                      seg.roundRight ? "8px" : "0",
                      seg.roundRight ? "8px" : "0",
                      seg.roundLeft ? "8px" : "0",
                    ].join(" ");

                    return (
                      <button
                        key={`${seg.trip.id}-${seg.dateFrom}`}
                        type="button"
                        aria-label={label}
                        onClick={() => selectTrip(seg.trip.id)}
                        className="pointer-events-auto z-[2] flex h-[30px] items-center overflow-hidden border px-2.5 text-left font-[family-name:var(--font-dm-sans)] text-[12px] font-bold transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#D6AE3C]"
                        style={{
                          gridColumn: `${seg.startCol} / span ${seg.span}`,
                          gridRow: seg.lane,
                          marginLeft: seg.roundLeft ? 6 : 0,
                          marginRight: seg.roundRight ? 6 : 0,
                          borderRadius: radius,
                          background: bg,
                          borderColor: border,
                          color,
                          opacity: faded ? 0.45 : 1,
                        }}
                      >
                        <span className="truncate">{seg.trip.shortName || seg.trip.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile compact month */}
        <div className="w-full md:hidden">
          <div className="mb-3 flex items-center gap-4">
            <span className="inline-flex items-center gap-2 font-[family-name:var(--font-dm-sans)] text-[13px] text-[#C9C3B6]">
              <span className="h-2.5 w-2.5 rounded-[2px] bg-[#D6AE3C]" aria-hidden="true" />
              India
            </span>
            <span className="inline-flex items-center gap-2 font-[family-name:var(--font-dm-sans)] text-[13px] text-[#C9C3B6]">
              <span className="h-2.5 w-2.5 rounded-[2px] bg-[#6EA8E0]" aria-hidden="true" />
              International
            </span>
          </div>
          <div className="rounded-[20px] border border-white/8 bg-[#141417] p-3">
            <div className="mb-2 grid grid-cols-7 text-center font-[family-name:var(--font-dm-sans)] text-[11px] font-bold uppercase tracking-[0.12em] text-[#C9C3B6]">
              {WEEKDAYS.map((d) => (
                <div key={d} className="py-2">
                  {d.slice(0, 1)}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarCells.map((cell) => {
                const dayTrips = cell.isCurrentMonth ? tripsByDate[cell.dateString] || [] : [];
                const hasIndia = dayTrips.some((t) => t.type === "India");
                const hasIntl = dayTrips.some((t) => t.type === "International");
                const active = mobileDay === cell.dateString;
                const isToday = cell.dateString === todayStr;
                return (
                  <button
                    key={cell.dateString}
                    type="button"
                    disabled={!cell.isCurrentMonth}
                    onClick={() => {
                      if (!cell.isCurrentMonth) return;
                      setMobileDay((current) =>
                        current === cell.dateString ? null : cell.dateString,
                      );
                    }}
                    className={`flex min-h-11 flex-col items-center justify-center rounded-xl py-1.5 font-[family-name:var(--font-dm-sans)] text-[14px] font-semibold transition ${
                      !cell.isCurrentMonth
                        ? "text-[#55524C]"
                        : active
                          ? "bg-[#D6AE3C] text-[#1A1405]"
                          : isToday
                            ? "ring-1 ring-[#D6AE3C] text-[#ECE7DC]"
                            : "text-[#ECE7DC] hover:bg-white/5"
                    }`}
                  >
                    {cell.day}
                    {cell.isCurrentMonth && (hasIndia || hasIntl) ? (
                      <span className="mt-1 flex gap-0.5">
                        {hasIndia ? (
                          <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-[#1A1405]" : "bg-[#D6AE3C]"}`} />
                        ) : null}
                        {hasIntl ? (
                          <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-[#1A1405]/70" : "bg-[#6EA8E0]"}`} />
                        ) : null}
                      </span>
                    ) : (
                      <span className="mt-1 h-1.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right / mobile panel */}
        <aside className="w-full shrink-0 lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:w-[400px] lg:overflow-y-auto">
          <div className="flex flex-col gap-3.5 rounded-[20px] border border-white/8 bg-[#141417] p-[22px]">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-[family-name:var(--font-playfair)] text-[22px] font-semibold text-[#FBF8F1] md:text-[24px]">
                {mobileDay
                  ? `Departing ${shortDateFmt.format(new Date(`${mobileDay}T00:00:00`))}`
                  : `Departing in ${monthName}`}
              </h3>
              <p className="shrink-0 font-[family-name:var(--font-dm-sans)] text-[13px] text-[#C9C3B6]">
                {mobileList.length} trip{mobileList.length === 1 ? "" : "s"}
              </p>
            </div>

            {mobileDay ? (
              <button
                type="button"
                onClick={() => setMobileDay(null)}
                className="self-start font-[family-name:var(--font-dm-sans)] text-[13px] font-bold text-[#D6AE3C] md:hidden"
              >
                Show all in {monthName}
              </button>
            ) : null}

            {mobileList.length === 0 ? (
              <div className="py-10 text-center">
                <p className="font-[family-name:var(--font-dm-sans)] text-[15px] text-[#C9C3B6]">
                  No trips this month.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3.5">
                {mobileList.map((trip) => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    selected={selectedTripId === trip.id}
                    onSelect={selectTrip}
                    cardRef={(node) => {
                      if (node) cardRefs.current[trip.id] = node;
                      else delete cardRefs.current[trip.id];
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Overflow popover */}
      {overflowPopover ? (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="More trips">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close"
            onClick={() => setOverflowPopover(null)}
          />
          <div className="absolute left-1/2 top-1/2 w-[min(100%-2rem,360px)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/8 bg-[#141417] p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-[family-name:var(--font-dm-sans)] text-[14px] font-bold text-[#FBF8F1]">
                More on{" "}
                {shortDateFmt.format(new Date(`${overflowPopover.dateString}T00:00:00`))}
              </p>
              <button
                type="button"
                onClick={() => setOverflowPopover(null)}
                className="rounded-full border border-white/15 p-2 text-[#FBF8F1]"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <ul className="space-y-2">
              {overflowPopover.trips.map((trip) => (
                <li key={trip.id}>
                  <button
                    type="button"
                    onClick={() => {
                      selectTrip(trip.id);
                      setOverflowPopover(null);
                    }}
                    className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/8 px-3 py-3 text-left transition hover:border-[#D6AE3C]"
                  >
                    <span className="font-[family-name:var(--font-dm-sans)] text-[14px] font-semibold text-[#FBF8F1]">
                      {trip.shortName || trip.title}
                    </span>
                    <span
                      className="shrink-0 font-[family-name:var(--font-dm-sans)] text-[11px] font-bold uppercase tracking-[0.12em]"
                      style={{ color: trip.type === "India" ? "#E2BB4D" : "#8FBDE8" }}
                    >
                      {trip.type}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}
