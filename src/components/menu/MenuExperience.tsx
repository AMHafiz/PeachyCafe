"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SearchX } from "lucide-react";
import { products } from "@/data/products";
import { CATEGORIES, type CategoryId, type FilterTag, type Product } from "@/lib/types";
import { CategorySidebar } from "@/components/nav/CategorySidebar";
import { FilterBar } from "@/components/filters/FilterBar";
import { ProductCard } from "@/components/product/ProductCard";
import { QuickViewModal } from "@/components/product/QuickViewModal";
import { getPriceBounds, minPrice } from "@/lib/format";

type SelectedCategory = CategoryId | "all";

function matchesQuery(product: Product, query: string): boolean {
  if (!query.trim()) return true;
  const haystack = [
    product.name,
    product.shortDescription,
    product.description,
    ...(product.flavorNotes ?? []),
    product.category,
    ...product.ingredients,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query.trim().toLowerCase());
}

function matchesTags(product: Product, tags: FilterTag[]): boolean {
  if (tags.length === 0) return true;
  const productTags = product.filterTags ?? [];
  return tags.some((t) => productTags.includes(t));
}

function matchesPrice(product: Product, maxPrice: number | null): boolean {
  if (maxPrice === null) return true;
  const price = minPrice(product);
  return price !== null && price <= maxPrice;
}

function isCategoryId(value: string): value is CategoryId {
  return CATEGORIES.some((c) => c.id === value);
}

export function MenuExperience({
  initialQuery = "",
  initialCategory = "",
}: {
  initialQuery?: string;
  initialCategory?: string;
}) {
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? initialQuery;
  const urlCategoryRaw = searchParams.get("category") ?? initialCategory;
  const urlCategory: SelectedCategory = isCategoryId(urlCategoryRaw) ? urlCategoryRaw : "all";

  const [selectedCategory, setSelectedCategory] = useState<SelectedCategory>(urlCategory);
  const [query, setQuery] = useState(urlQuery);
  const [tags, setTags] = useState<FilterTag[]>([]);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Re-sync local query/category when the ?q=/?category= params change via
  // client-side navigation (e.g. a homepage tile linking here while already
  // on /menu). Adjusting state during render -- rather than in an effect --
  // avoids an extra commit.
  const [syncedUrlQuery, setSyncedUrlQuery] = useState(urlQuery);
  if (urlQuery !== syncedUrlQuery) {
    setSyncedUrlQuery(urlQuery);
    setQuery(urlQuery);
  }
  const [syncedUrlCategory, setSyncedUrlCategory] = useState(urlCategory);
  if (urlCategory !== syncedUrlCategory) {
    setSyncedUrlCategory(urlCategory);
    setSelectedCategory(urlCategory);
  }

  const priceBounds = useMemo(() => getPriceBounds(products), []);

  const availableCategories = useMemo(
    () => CATEGORIES.filter((c) => products.some((p) => p.category === c.id)),
    []
  );

  const visibleProducts = useMemo(
    () =>
      products.filter(
        (p) =>
          (selectedCategory === "all" || p.category === selectedCategory) &&
          matchesQuery(p, query) &&
          matchesTags(p, tags) &&
          matchesPrice(p, maxPrice)
      ),
    [selectedCategory, query, tags, maxPrice]
  );

  const headingLabel =
    selectedCategory === "all"
      ? query.trim()
        ? "Search Results"
        : "All Products"
      : (availableCategories.find((c) => c.id === selectedCategory)?.label ?? "");

  return (
    <div>
      <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 lg:grid lg:grid-cols-4 lg:gap-8 lg:py-8">
        <CategorySidebar
          categories={availableCategories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
          priceMin={priceBounds.min}
          priceMax={priceBounds.max}
          priceValue={maxPrice}
          onPriceChange={(v) => setMaxPrice(v >= priceBounds.max ? null : v)}
          tags={tags}
          onTagsChange={setTags}
        />

        <div className="lg:col-span-3">
          <div className="hidden border-b border-border py-4 lg:block lg:pt-0">
            <FilterBar value={tags} onChange={setTags} />
          </div>

          <div className="mt-3 flex items-baseline justify-between gap-4 lg:mt-5">
            <h1 className="font-heading text-h2 text-ink">{headingLabel}</h1>
            <span className="whitespace-nowrap text-sm text-ink-muted" aria-live="polite">
              {visibleProducts.length} item{visibleProducts.length === 1 ? "" : "s"}
            </span>
          </div>

          {visibleProducts.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-20 text-center text-ink-muted">
              <SearchX className="h-10 w-10" aria-hidden="true" />
              <p>No products match your search or filters yet.</p>
            </div>
          ) : (
            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:mt-5">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} onQuickView={setQuickViewProduct} />
              ))}
            </div>
          )}
        </div>
      </div>

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}
