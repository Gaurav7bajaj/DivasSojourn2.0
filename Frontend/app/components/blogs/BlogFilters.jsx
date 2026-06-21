"use client";

import { ChevronDown, Search } from "lucide-react";

export default function BlogFilters({
  categories,
  destinations,
  selectedCategory,
  selectedDestination,
  searchQuery,
  onCategoryChange,
  onDestinationChange,
  onSearchChange,
}) {
  return (
    <div className="rounded-3xl border border-[#D4AF37]/30 bg-[#F9F9F9] p-4 shadow-xl">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <label className="relative shrink-0">
            <span className="sr-only">Filter by destination</span>
            <select
              value={selectedDestination}
              onChange={(event) => onDestinationChange(event.target.value)}
              className="appearance-none rounded-full border border-[#D4AF37]/30 bg-white py-3 pl-4 pr-10 text-sm font-black text-[#1A1A1A] outline-none transition focus:border-[#D4AF37]"
            >
              {destinations.map((destination) => (
                <option key={destination} value={destination}>
                  {destination}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#D4AF37]"
              aria-hidden="true"
            />
          </label>

          {categories.map((category) => {
            const isActive = selectedCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => onCategoryChange(category)}
                className={`shrink-0 rounded-full border px-4 py-3 text-sm font-black transition ${
                  isActive
                    ? "border-[#D4AF37] bg-[#D4AF37] text-[#1A1A1A]"
                    : "border-[#D4AF37]/20 bg-white text-[#1A1A1A] hover:border-[#D4AF37]"
                }`}
              >
                {isActive && <span aria-hidden="true">• </span>}
                {category}
              </button>
            );
          })}
        </div>

        <label className="flex min-w-full items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-white px-4 py-3 text-[#1A1A1A] transition focus-within:border-[#D4AF37] lg:min-w-80">
          <Search className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
          <span className="sr-only">Search blogs</span>
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search"
            className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-[#A0A0A0]"
          />
        </label>
      </div>
    </div>
  );
}
