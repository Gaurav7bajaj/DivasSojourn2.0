"use client";

import { Search } from "lucide-react";

type AdminSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  resultCount?: number;
  totalCount?: number;
};

export default function AdminSearchBar({
  value,
  onChange,
  placeholder = "Search…",
  label = "Search",
  resultCount,
  totalCount,
}: AdminSearchBarProps) {
  const showCount =
    typeof resultCount === "number" &&
    typeof totalCount === "number" &&
    value.trim().length > 0;

  return (
    <div className="mt-5">
      <label className="block text-sm font-bold text-[#333333]">
        {label}
        <span className="mt-2 flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-3 shadow-sm focus-within:border-[#0F9B9B]">
          <Search className="h-4 w-4 shrink-0 text-[#0F9B9B]" aria-hidden="true" />
          <input
            type="search"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className="w-full bg-transparent text-sm outline-none placeholder:text-[#999999]"
          />
        </span>
      </label>
      {showCount ? (
        <p className="mt-2 text-xs font-semibold text-[#666666]">
          Showing {resultCount} of {totalCount}
        </p>
      ) : null}
    </div>
  );
}

export function matchesAdminQuery(query: string, fields: Array<string | null | undefined>) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  return fields.some((field) => (field || "").toLowerCase().includes(normalized));
}
