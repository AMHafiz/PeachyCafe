"use client";

import { useState } from "react";
import { ProductImage } from "@/components/product/ProductImage";
import type { Product } from "@/lib/types";

export function ProductGallery({ product }: { product: Product }) {
  const images = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-surface">
        <ProductImage
          src={images[active].src}
          alt={images[active].alt}
          tone={images[active].tone}
          className="absolute inset-0"
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
        />
      </div>
      {images.length > 1 && (
        <div role="tablist" aria-label={`${product.name} gallery`} className="mt-3 flex gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={active === i}
              aria-label={`Show image ${i + 1} of ${images.length}`}
              onClick={() => setActive(i)}
              className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 ${active === i ? "border-peach" : "border-transparent"}`}
            >
              <ProductImage src={img.src} alt="" tone={img.tone} className="absolute inset-0" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
