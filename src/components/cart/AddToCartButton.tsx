"use client";

import { useCart } from "@/components/cart/CartContext";
import type { Product } from "@/lib/types";

interface AddToCartButtonProps {
  product: Product;
  sizeLabel: string;
  quantity?: number;
  className?: string;
  analyticsId?: string;
}

export function AddToCartButton({ product, sizeLabel, quantity = 1, className = "", analyticsId }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const size = product.sizes.find((s) => s.label === sizeLabel);
  const disabled = !size || size.price === null || !!product.isSoldOut;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => addItem(product.id, sizeLabel, quantity)}
      data-analytics-id={analyticsId ?? "add-to-cart"}
      data-product-id={product.id}
      className={`flex min-h-12 items-center justify-center rounded-full bg-peach px-6 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-border disabled:text-ink-muted disabled:opacity-100 ${className}`}
    >
      {disabled ? (product.isSoldOut ? "Sold Out" : "Coming Soon") : "Add to Cart"}
    </button>
  );
}
