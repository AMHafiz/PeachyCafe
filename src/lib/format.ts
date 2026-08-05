import type { Product, ProductSize } from "@/lib/types";

export function formatPrice(price: number | null): string {
  if (price === null) return "TBA";
  return `$${price.toFixed(2)}`;
}

export function startingPrice(product: Product): string {
  const priced = product.sizes.filter(
    (s): s is ProductSize & { price: number } => s.price !== null
  );
  if (priced.length === 0) return "TBA";
  const min = Math.min(...priced.map((s) => s.price));
  return product.sizes.length > 1 ? `From $${min.toFixed(2)}` : `$${min.toFixed(2)}`;
}

export function isOrderable(product: Product): boolean {
  return product.sizes.some((s) => s.price !== null);
}

export function minPrice(product: Product): number | null {
  const priced = product.sizes.filter((s) => s.price !== null).map((s) => s.price as number);
  return priced.length ? Math.min(...priced) : null;
}

export function getPriceBounds(products: Product[]): { min: number; max: number } {
  const priced = products.map(minPrice).filter((p): p is number => p !== null);
  if (priced.length === 0) return { min: 0, max: 0 };
  return { min: Math.floor(Math.min(...priced)), max: Math.ceil(Math.max(...priced)) };
}
