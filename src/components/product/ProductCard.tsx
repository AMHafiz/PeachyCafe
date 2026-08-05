"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { ProductImage } from "@/components/product/ProductImage";
import { Badge } from "@/components/product/Badge";
import { RatingStars } from "@/components/product/RatingStars";
import { startingPrice } from "@/lib/format";
import { ANALYTICS_EVENTS, track } from "@/lib/analytics";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const content = (
    <>
      <div className="relative aspect-square overflow-hidden rounded-xl bg-surface">
        <ProductImage src={product.image.src} alt={product.image.alt} tone={product.image.tone} className="absolute inset-0" />
        {product.badges && product.badges.length > 0 && (
          <div className="absolute left-2 top-2 flex flex-wrap gap-1.5">
            {product.badges.map((b) => (
              <Badge key={b} id={b} />
            ))}
          </div>
        )}
      </div>
      <div className="mt-3 flex flex-col gap-1">
        <h3 className="font-heading text-base text-ink">{product.name}</h3>
        <p className="line-clamp-2 text-sm text-ink-muted">{product.shortDescription}</p>
        <div className="mt-1 flex items-center justify-between">
          <span className="font-medium text-ink">{startingPrice(product)}</span>
          <RatingStars rating={product.rating} />
        </div>
      </div>
    </>
  );

  const motionProps = {
    whileHover: { y: -4 },
    transition: { type: "tween" as const, duration: 0.18 },
  };

  if (product.size === "small") {
    return (
      <motion.button
        type="button"
        onClick={() => {
          track(ANALYTICS_EVENTS.QUICK_VIEW_OPENED, { productId: product.id, name: product.name });
          onQuickView?.(product);
        }}
        data-analytics-id="product-card-quickview"
        data-product-id={product.id}
        className="group block w-full text-left focus-visible:outline-none"
        {...motionProps}
      >
        {content}
      </motion.button>
    );
  }

  return (
    <motion.div {...motionProps}>
      <Link
        href={`/product/${product.slug}`}
        onClick={() => track(ANALYTICS_EVENTS.PRODUCT_VIEWED, { productId: product.id, name: product.name })}
        data-analytics-id="product-card-link"
        data-product-id={product.id}
        className="group block focus-visible:outline-none"
      >
        {content}
      </Link>
    </motion.div>
  );
}
