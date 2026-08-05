"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";
import { ProductGallery } from "@/components/product/ProductGallery";
import { Badge } from "@/components/product/Badge";
import { RatingStars } from "@/components/product/RatingStars";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { PairingsSection } from "@/components/product/PairingsSection";
import { formatPrice } from "@/lib/format";
import { getPairings, getRelatedProducts } from "@/data/products";
import { ANALYTICS_EVENTS, track } from "@/lib/analytics";

export function ProductDetail({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]?.label ?? "");
  const price = product.sizes.find((s) => s.label === selectedSize)?.price ?? null;
  const pairings = getPairings(product);
  const related = getRelatedProducts(product);

  useEffect(() => {
    track(ANALYTICS_EVENTS.PRODUCT_PAGE_VIEWED, { productId: product.id, name: product.name });
  }, [product.id, product.name]);

  return (
    <div className="pb-24 md:pb-0">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <ProductGallery product={product} />

          <div>
            {product.badges && product.badges.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-1.5">
                {product.badges.map((b) => (
                  <Badge key={b} id={b} />
                ))}
              </div>
            )}
            <h1 className="font-heading text-h2 text-ink">{product.name}</h1>
            <div className="mt-2">
              <RatingStars rating={product.rating} />
            </div>
            <p className="mt-4 text-ink-muted">{product.description}</p>

            {product.flavorNotes && product.flavorNotes.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {product.flavorNotes.map((note) => (
                  <span key={note} className="rounded-full bg-cream px-3 py-1 text-xs font-medium text-ink-muted">
                    {note}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-6 rounded-2xl border border-border bg-white p-5 shadow-sm">
              <span className="text-sm font-medium text-ink">Size</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size.label}
                    type="button"
                    onClick={() => setSelectedSize(size.label)}
                    disabled={size.price === null}
                    aria-pressed={selectedSize === size.label}
                    className={`flex min-h-11 items-center rounded-full border px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                      selectedSize === size.label
                        ? "border-peach bg-peach text-white"
                        : "border-border text-ink hover:border-peach"
                    }`}
                  >
                    {size.label} · {formatPrice(size.price)}
                  </button>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between gap-4">
                <span className="font-heading text-2xl text-ink">{formatPrice(price)}</span>
                <AddToCartButton product={product} sizeLabel={selectedSize} className="flex-1 sm:flex-none" analyticsId="product-page-add-to-cart" />
              </div>
            </div>

            <dl className="mt-8 grid gap-5 text-sm">
              <div>
                <dt className="font-heading text-base text-ink">Ingredients</dt>
                <dd className="mt-1 text-ink-muted">{product.ingredients.join(", ")}</dd>
              </div>
              <div>
                <dt className="font-heading text-base text-ink">Allergens</dt>
                <dd className="mt-1 text-ink-muted">
                  {product.allergens.length ? `Contains: ${product.allergens.join(", ")}` : "No major allergens listed"}
                </dd>
              </div>
              <div>
                <dt className="font-heading text-base text-ink">Storage</dt>
                <dd className="mt-1 text-ink-muted">{product.storage}</dd>
              </div>
              <div>
                <dt className="font-heading text-base text-ink">Serving Guide</dt>
                <dd className="mt-1 text-ink-muted">{product.servingInfo}</dd>
              </div>
              <div>
                <dt className="font-heading text-base text-ink">Shelf Life</dt>
                <dd className="mt-1 text-ink-muted">{product.shelfLife}</dd>
              </div>
              {product.nutrition && (
                <div>
                  <dt className="font-heading text-base text-ink">Nutrition</dt>
                  <dd className="mt-1 text-ink-muted">{product.nutrition}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        <PairingsSection title="Perfect Pairings" products={pairings} analyticsId="pairing-card" event={ANALYTICS_EVENTS.PAIRING_CLICKED} />
        <PairingsSection
          title="Customers Also Bought"
          products={related}
          analyticsId="recommendation-card"
          event={ANALYTICS_EVENTS.RECOMMENDATION_CLICKED}
        />
      </div>

      {/* Mobile sticky add-to-cart, sits above the bottom nav bar */}
      <div className="fixed inset-x-0 bottom-16 z-20 flex items-center justify-between gap-4 border-t border-border bg-white/95 px-4 py-3 backdrop-blur md:hidden">
        <span className="font-heading text-lg text-ink">{formatPrice(price)}</span>
        <AddToCartButton product={product} sizeLabel={selectedSize} className="flex-1" analyticsId="product-page-sticky-add-to-cart" />
      </div>
    </div>
  );
}
