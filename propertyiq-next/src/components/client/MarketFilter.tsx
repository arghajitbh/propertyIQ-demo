"use client";

import { useState, type FormEvent } from "react";

export interface MarketFilterValues {
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  minYearBuilt?: number;
  maxYearBuilt?: number;
}

interface MarketFilterProps {
  onApply: (filters: MarketFilterValues) => void;
  initialValues?: MarketFilterValues;
}

const rangeFields = [
  { label: "Price", minKey: "minPrice", maxKey: "maxPrice", step: 1000 },
  { label: "Area (sq ft)", minKey: "minArea", maxKey: "maxArea", step: 50 },
  {
    label: "Bedrooms",
    minKey: "minBedrooms",
    maxKey: "maxBedrooms",
    step: 1,
  },
  {
    label: "Bathrooms",
    minKey: "minBathrooms",
    maxKey: "maxBathrooms",
    step: 1,
  },
  {
    label: "Year built",
    minKey: "minYearBuilt",
    maxKey: "maxYearBuilt",
    step: 1,
  },
] as const satisfies ReadonlyArray<{
  label: string;
  minKey: keyof MarketFilterValues;
  maxKey: keyof MarketFilterValues;
  step: number;
}>;

const inputClassName =
  "mt-2 block w-full rounded-md border-2 border-slate-500 bg-slate-950 px-3 py-2 text-white placeholder:text-slate-400 focus:border-yellow-300 focus:outline-none focus:ring-4 focus:ring-yellow-300/30";

export default function MarketFilter({
  onApply,
  initialValues = {},
}: MarketFilterProps) {
  const [filters, setFilters] = useState<MarketFilterValues>(initialValues);


  function updateNumber(
    key: (typeof rangeFields)[number]["minKey" | "maxKey"],
    value: string,
  ) {
    setFilters((current) => ({
      ...current,
      [key]: value === "" ? undefined : Number(value),
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onApply(filters);
  }

  function handleReset() {
    setFilters({});
    onApply({});
  }

  return (
    <section
      className="rounded-xl border-2 border-slate-600 bg-slate-800 p-4 sm:p-6"
      aria-labelledby="market-filter-heading"
    >
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-wider text-yellow-300">
          Refine results
        </p>
        <h2
          id="market-filter-heading"
          className="mt-1 text-lg font-bold text-white sm:text-xl"
        >
          Market filter
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
 

          {rangeFields.map(({ label, minKey, maxKey, step }) => (
            <fieldset
              key={label}
              className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2"
              aria-label={`${label} range`}
            >
              <legend className="col-span-full text-sm font-semibold text-slate-200">
                {label}
              </legend>
              <label className="text-xs text-slate-300">
                Min
                <input
                  type="number"
                  min="0"
                  step={step}
                  inputMode="numeric"
                  placeholder="No min"
                  value={filters[minKey] ?? ""}
                  onChange={(event) => updateNumber(minKey, event.target.value)}
                  className={inputClassName}
                />
              </label>
              <label className="text-xs text-slate-300">
                Max
                <input
                  type="number"
                  min="0"
                  step={step}
                  inputMode="numeric"
                  placeholder="No max"
                  value={filters[maxKey] ?? ""}
                  onChange={(event) => updateNumber(maxKey, event.target.value)}
                  className={inputClassName}
                />
              </label>
            </fieldset>
          ))}
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleReset}
            className="w-full rounded-md border-2 border-slate-500 px-4 py-2 text-sm font-bold text-slate-200 transition hover:border-slate-300 hover:bg-slate-700 focus:outline-none focus:ring-4 focus:ring-yellow-300/30 sm:w-auto"
          >
            Reset
          </button>
          <button
            type="submit"
            className="w-full rounded-md border-2 border-yellow-300 bg-yellow-300 px-5 py-2 text-sm font-bold text-slate-950 transition hover:bg-yellow-200 focus:outline-none focus:ring-4 focus:ring-yellow-300/30 sm:w-auto"
          >
            Apply filters
          </button>
        </div>
      </form>
    </section>
  );
}