"use client";

import { useId, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { ANALYTICS_EVENTS, track } from "@/lib/analytics";
import { FilterBar } from "@/components/filters/FilterBar";
import type { Category, CategoryId, FilterTag } from "@/lib/types";

type SelectedCategory = CategoryId | "all";

interface CategorySidebarProps {
  categories: Category[];
  selected: SelectedCategory;
  onSelect: (id: SelectedCategory) => void;
  priceMin: number;
  priceMax: number;
  priceValue: number | null;
  onPriceChange: (value: number) => void;
  tags: FilterTag[];
  onTagsChange: (tags: FilterTag[]) => void;
}

function handleSelect(id: SelectedCategory, onSelect: (id: SelectedCategory) => void) {
  onSelect(id);
  track(ANALYTICS_EVENTS.CATEGORY_SELECTED, { category: id });
}

function PriceControl({ priceMin, priceMax, priceValue, onPriceChange }: Pick<CategorySidebarProps, "priceMin" | "priceMax" | "priceValue" | "onPriceChange">) {
  const inputId = useId();
  return (
    <div>
      <label htmlFor={inputId} className="flex items-center justify-between text-sm font-medium text-ink">
        <span>Price</span>
        <span className="font-normal text-ink-muted">Up to ${priceValue ?? priceMax}</span>
      </label>
      <input
        id={inputId}
        type="range"
        min={priceMin}
        max={priceMax}
        value={priceValue ?? priceMax}
        onChange={(e) => onPriceChange(Number(e.target.value))}
        data-analytics-id="filter-price-range"
        className="mt-2 w-full accent-peach"
      />
    </div>
  );
}

function MobileFilterDrawer({
  priceMin,
  priceMax,
  priceValue,
  onPriceChange,
  tags,
  onTagsChange,
}: Pick<CategorySidebarProps, "priceMin" | "priceMax" | "priceValue" | "onPriceChange" | "tags" | "onTagsChange">) {
  const [open, setOpen] = useState(false);
  const activeCount = tags.length + (priceValue !== null ? 1 : 0);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          data-analytics-id="mobile-filter-trigger"
          aria-label={`Open filters${activeCount > 0 ? `, ${activeCount} active` : ""}`}
          className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-border bg-white text-ink hover:border-peach hover:text-peach"
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          {activeCount > 0 && (
            <span
              className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-peach text-[10px] font-medium text-white"
              aria-hidden="true"
            >
              {activeCount}
            </span>
          )}
        </button>
      </Dialog.Trigger>

      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-40 bg-black/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount aria-describedby={undefined}>
              <motion.div
                className="fixed inset-x-0 bottom-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
              >
                <div className="flex items-center justify-between">
                  <Dialog.Title className="font-heading text-lg text-ink">Filters</Dialog.Title>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Close filters"
                      className="flex h-11 w-11 items-center justify-center rounded-full text-ink-muted hover:bg-surface"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </Dialog.Close>
                </div>

                <div className="mt-4">
                  <PriceControl priceMin={priceMin} priceMax={priceMax} priceValue={priceValue} onPriceChange={onPriceChange} />
                </div>

                <div className="mt-6">
                  <span className="text-sm font-medium text-ink">Attributes</span>
                  <div className="mt-2">
                    <FilterBar value={tags} onChange={onTagsChange} />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  data-analytics-id="mobile-filter-apply"
                  className="mt-6 flex min-h-12 w-full items-center justify-center rounded-full bg-peach px-6 font-medium text-white transition hover:opacity-90"
                >
                  Show Results
                </button>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

export function CategorySidebar({
  categories,
  selected,
  onSelect,
  priceMin,
  priceMax,
  priceValue,
  onPriceChange,
  tags,
  onTagsChange,
}: CategorySidebarProps) {
  const allOptions: { id: SelectedCategory; label: string }[] = [{ id: "all", label: "All Products" }, ...categories];

  return (
    <>
      {/* Mobile / tablet: only the sticky category scroll bar + a compact Filter
          drawer trigger -- price and attribute filters live inside the drawer
          so this bar stays a single, short row. */}
      <div className="sticky top-16 z-20 -mx-4 flex items-center gap-2 border-b border-border bg-white/95 px-4 py-2.5 backdrop-blur sm:-mx-6 sm:px-6 lg:hidden">
        <ul className="chip-scroll flex flex-1 gap-2 overflow-x-auto">
          {allOptions.map((option) => {
            const active = selected === option.id;
            return (
              <li key={option.id} className="flex-shrink-0">
                <button
                  type="button"
                  onClick={() => handleSelect(option.id, onSelect)}
                  aria-current={active ? "true" : undefined}
                  data-analytics-id={`category-tab-${option.id}`}
                  className={`flex min-h-11 items-center rounded-full border px-4 text-sm font-medium transition ${
                    active
                      ? "border-peach bg-peach text-white"
                      : "border-border bg-white text-ink hover:border-peach hover:text-peach"
                  }`}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
        <MobileFilterDrawer
          priceMin={priceMin}
          priceMax={priceMax}
          priceValue={priceValue}
          onPriceChange={onPriceChange}
          tags={tags}
          onTagsChange={onTagsChange}
        />
      </div>

      {/* Desktop: vertical sidebar, sticky under the header while the grid scrolls */}
      <aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
        <nav aria-label="Product categories">
          <ul className="flex flex-col gap-1">
            {allOptions.map((option) => {
              const active = selected === option.id;
              return (
                <li key={option.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(option.id, onSelect)}
                    aria-current={active ? "true" : undefined}
                    data-analytics-id={`category-tab-${option.id}`}
                    className={`flex min-h-11 w-full items-center rounded-xl px-4 text-left text-sm font-medium transition ${
                      active ? "bg-peach text-white" : "text-ink hover:bg-surface"
                    }`}
                  >
                    {option.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-6 rounded-2xl border border-border p-4">
          <PriceControl priceMin={priceMin} priceMax={priceMax} priceValue={priceValue} onPriceChange={onPriceChange} />
        </div>
      </aside>
    </>
  );
}
