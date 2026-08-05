"use client";

import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { ANALYTICS_EVENTS, track } from "@/lib/analytics";

interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  autoFocus?: boolean;
  placeholder?: string;
}

/**
 * Standalone (header): manages its own text and redirects to /menu?q= on submit.
 * Controlled (menu page): pass value/onChange to filter results live, no navigation.
 */
export function SearchBar({ value, onChange, autoFocus, placeholder = "Search cakes, drinks, flavors…" }: SearchBarProps) {
  const router = useRouter();
  const inputId = useId();
  const isControlled = value !== undefined && onChange !== undefined;
  const [internalValue, setInternalValue] = useState(value ?? "");

  const current = isControlled ? value! : internalValue;

  function handleChange(next: string) {
    if (isControlled) {
      onChange!(next);
    } else {
      setInternalValue(next);
    }
    if (next.trim().length > 1) {
      track(ANALYTICS_EVENTS.SEARCH_USED, { query: next });
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isControlled && current.trim()) {
      router.push(`/menu?q=${encodeURIComponent(current.trim())}`);
    }
  }

  return (
    <form role="search" onSubmit={handleSubmit} className="relative">
      <label htmlFor={inputId} className="sr-only">
        Search products
      </label>
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
      <input
        id={inputId}
        type="text"
        autoFocus={autoFocus}
        value={current}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        data-analytics-id="search-input"
        className="min-h-12 w-full rounded-full border border-border bg-surface pl-11 pr-11 text-sm text-ink placeholder:text-ink-faint focus:border-peach focus:bg-white focus:outline-none"
      />
      {current && (
        <button
          type="button"
          onClick={() => handleChange("")}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-ink-faint hover:bg-white"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </form>
  );
}
