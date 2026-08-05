"use client";

import type { FilterTag } from "@/lib/types";
import { ANALYTICS_EVENTS, track } from "@/lib/analytics";

const TAG_FILTERS: { id: FilterTag; label: string }[] = [
  { id: "best-seller", label: "Best Sellers" },
  { id: "new", label: "New" },
  { id: "seasonal", label: "Seasonal" },
  { id: "chocolate", label: "Chocolate" },
  { id: "fruit", label: "Fruit" },
  { id: "coffee", label: "Coffee" },
];

interface FilterBarProps {
  value: FilterTag[];
  onChange: (next: FilterTag[]) => void;
}

/** Attribute-tag filters only -- category selection and price live in CategorySidebar. */
export function FilterBar({ value, onChange }: FilterBarProps) {
  function toggleTag(tag: FilterTag) {
    const active = value.includes(tag);
    onChange(active ? value.filter((t) => t !== tag) : [...value, tag]);
    track(ANALYTICS_EVENTS.FILTER_APPLIED, { type: "tag", tag, active: !active });
  }

  return (
    <div className="chip-scroll flex flex-wrap items-center gap-2 overflow-x-auto py-1">
      {TAG_FILTERS.map((filter) => {
        const active = value.includes(filter.id);
        return (
          <button
            key={filter.id}
            type="button"
            onClick={() => toggleTag(filter.id)}
            aria-pressed={active}
            data-analytics-id={`filter-chip-${filter.id}`}
            className={`flex min-h-11 items-center rounded-full border px-4 text-sm font-medium transition ${
              active
                ? "border-peach bg-peach/10 text-peach"
                : "border-border bg-white text-ink-muted hover:border-peach hover:text-peach"
            }`}
          >
            {filter.label}
          </button>
        );
      })}

      {value.length > 0 && (
        <button
          type="button"
          onClick={() => onChange([])}
          data-analytics-id="filter-clear-all"
          className="flex min-h-11 items-center px-2 text-sm font-medium text-ink-muted underline hover:text-peach"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
