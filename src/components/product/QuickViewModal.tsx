"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { ProductImage } from "@/components/product/ProductImage";
import { Badge } from "@/components/product/Badge";
import { RatingStars } from "@/components/product/RatingStars";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { formatPrice } from "@/lib/format";

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  return (
    <Dialog.Root open={product !== null} onOpenChange={(open) => !open && onClose()}>
      <AnimatePresence>
        {product && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-40 bg-black/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>
            {/* Keyed by product.id so size selection resets automatically for a new product,
                instead of syncing local state to a prop change via an effect. */}
            <QuickViewContent key={product.id} product={product} />
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

function QuickViewContent({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]?.label ?? "");

  return (
    <Dialog.Content asChild forceMount aria-describedby="quick-view-description">
      <motion.div
        className="fixed left-1/2 top-1/2 z-50 grid max-h-[90vh] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-2xl md:h-[520px] md:max-h-[80vh] md:grid-cols-2"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.18 }}
      >
        <Dialog.Close asChild>
          <button
            type="button"
            aria-label="Close quick view"
            data-analytics-id="quickview-close"
            className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-ink hover:bg-white"
          >
            <X className="h-5 w-5" />
          </button>
        </Dialog.Close>

        {/* Left column: crisp, uncropped-looking square image. On desktop the grid row has
            a definite height (md:h-[520px] on the container), so md:h-full resolves cleanly
            -- unlike a flex row sized only by max-height, which leaves h-full ambiguous. */}
        <div className="relative aspect-square w-full flex-shrink-0 overflow-hidden bg-neutral-100 md:aspect-auto md:h-full">
          <ProductImage
            src={product.image.src}
            alt={product.image.alt}
            tone={product.image.tone}
            className="absolute inset-0 object-cover object-center"
            sizes="(min-width: 768px) 50vw, 100vw"
            priority
          />
        </div>

        {/* Right column: independently scrollable so long ingredient/allergen copy never
            pushes the image or forces the whole modal taller. min-h-0 overrides the grid
            item's default min-height:auto, which would otherwise stop it from shrinking to
            fit the row and disable the scroll. */}
        <div className="flex min-h-0 flex-col overflow-y-auto">
          <div className="flex-1 p-6 pb-0">
            {product.badges && product.badges.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-1.5">
                {product.badges.map((b) => (
                  <Badge key={b} id={b} />
                ))}
              </div>
            )}
            <Dialog.Title className="font-heading text-2xl text-ink">{product.name}</Dialog.Title>
            <div className="mt-1">
              <RatingStars rating={product.rating} />
            </div>
            <p id="quick-view-description" className="mt-3 text-sm text-ink-muted">
              {product.description}
            </p>

            {product.sizes.length > 1 && (
              <div className="mt-4">
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
              </div>
            )}

            <dl className="mt-5 grid gap-3 text-sm">
              <div>
                <dt className="font-medium text-ink">Ingredients</dt>
                <dd className="text-ink-muted">{product.ingredients.join(", ")}</dd>
              </div>
              <div>
                <dt className="font-medium text-ink">Allergens</dt>
                <dd className="text-ink-muted">{product.allergens.length ? `Contains: ${product.allergens.join(", ")}` : "No major allergens listed"}</dd>
              </div>
              <div>
                <dt className="font-medium text-ink">Storage &amp; Serving</dt>
                <dd className="text-ink-muted">{product.storage} {product.servingInfo}</dd>
              </div>
              <div>
                <dt className="font-medium text-ink">Shelf Life</dt>
                <dd className="text-ink-muted">{product.shelfLife}</dd>
              </div>
            </dl>
          </div>

          {/* Sticky footer: stays pinned to the bottom of this scroll container so price/Add
              to Cart are always reachable without hunting through long product details. */}
          <div className="sticky bottom-0 mt-6 flex items-center justify-between gap-4 border-t border-border bg-white px-6 py-4">
            <span className="font-heading text-xl text-ink">
              {formatPrice(product.sizes.find((s) => s.label === selectedSize)?.price ?? null)}
            </span>
            <AddToCartButton product={product} sizeLabel={selectedSize} analyticsId="quickview-add-to-cart" />
          </div>
        </div>
      </motion.div>
    </Dialog.Content>
  );
}
