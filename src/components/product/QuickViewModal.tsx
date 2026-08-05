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
        className="fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:flex-row"
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

        <div className="relative h-56 flex-shrink-0 sm:h-auto sm:w-2/5">
          <ProductImage
            src={product.image.src}
            alt={product.image.alt}
            tone={product.image.tone}
            className="absolute inset-0"
            sizes="(min-width: 640px) 40vw, 100vw"
          />
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto p-6">
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

          <div className="mt-6 flex items-center justify-between gap-4 border-t border-border pt-6">
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
