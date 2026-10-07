"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import MarketFilter, { type MarketFilterValues } from "./MarketFilter";

const FILTER_KEYS: ReadonlyArray<keyof MarketFilterValues> = [
  "minPrice",
  "maxPrice",
  "minArea",
  "maxArea",
  "minBedrooms",
  "maxBedrooms",
  "minBathrooms",
  "maxBathrooms",
  "minYearBuilt",
  "maxYearBuilt",
];

interface MarketFilterToggleProps {
  activeFilters?: MarketFilterValues;
}

export default function MarketFilterToggle({
  activeFilters = {},
}: MarketFilterToggleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function applyFilters(filters: MarketFilterValues) {
    const params = new URLSearchParams(searchParams.toString());
    FILTER_KEYS.forEach((key) => params.delete(key));
    params.delete("currentPage");
    FILTER_KEYS.forEach((key) => {
      const value = filters[key];
      if (value !== undefined && String(value) !== "") params.set(key, String(value));
    });
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  const activeCount = Object.values(activeFilters).filter((value) =>
    typeof value === "string"
      ? value.trim().length > 0
      : value !== undefined && Number.isFinite(value),
  ).length;
  const hasActiveFilters = activeCount > 0;

  return (
    <div className="mt-6">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="market-filter-panel"
        onClick={() => setIsOpen((open) => !open)}
        className={`inline-flex items-center gap-2 rounded-md border-2 px-4 py-2 text-sm font-bold transition focus:outline-none focus:ring-4 focus:ring-yellow-300/30 ${
          hasActiveFilters
            ? "border-yellow-300 bg-yellow-300 text-slate-950 hover:bg-yellow-200"
            : "border-slate-500 bg-slate-800 text-white hover:border-yellow-300 hover:text-yellow-300"
        }`}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          className="h-5 w-5"
        >
          <path
            d="M3 5h14M5.5 10h9M8 15h4"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
          />
        </svg>
        Filters
        {hasActiveFilters && (
          <span className="rounded-full bg-slate-950/15 px-2 py-0.5 text-xs">
            {activeCount}
          </span>
        )}
      </button>
      <div
        id="market-filter-panel"
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`grid grid-cols-[minmax(0,1fr)] overflow-hidden transition-[grid-template-rows,opacity,margin] duration-300 ease-in-out motion-reduce:transition-none ${
          isOpen
            ? "mt-4 grid-rows-[1fr] opacity-100"
            : "mt-0 grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <MarketFilter
            onApply={applyFilters}
            initialValues={activeFilters}
          />
        </div>
      </div>
    </div>
  );
}
