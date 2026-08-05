"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";
import { QuickViewModal } from "@/components/product/QuickViewModal";
import { ANALYTICS_EVENTS, track, type AnalyticsEvent } from "@/lib/analytics";

interface PairingsSectionProps {
  title: string;
  products: Product[];
  analyticsId: string;
  event?: AnalyticsEvent;
}

export function PairingsSection({ title, products, analyticsId, event = ANALYTICS_EVENTS.PAIRING_CLICKED }: PairingsSectionProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  if (products.length === 0) return null;

  return (
    <section aria-labelledby={`${analyticsId}-heading`} className="py-8">
      <h2 id={`${analyticsId}-heading`} className="font-heading text-h3 text-ink">
        {title}
      </h2>
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => track(event, { productId: product.id, source: analyticsId })}
            data-analytics-id={analyticsId}
          >
            <ProductCard product={product} onQuickView={setQuickViewProduct} />
          </div>
        ))}
      </div>
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </section>
  );
}
