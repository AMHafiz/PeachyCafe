"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartContext";
import { ProductImage } from "@/components/product/ProductImage";
import { formatPrice } from "@/lib/format";
import { ANALYTICS_EVENTS, track } from "@/lib/analytics";

export function CartDrawer() {
  const { items, itemCount, subtotal, isOpen, openCart, closeCart, removeItem, updateQuantity } = useCart();

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => (open ? openCart() : closeCart())}>
      <AnimatePresence>
        {isOpen && (
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
                className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
              >
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                  <Dialog.Title className="font-heading text-lg">Your Cart</Dialog.Title>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Close cart"
                      data-analytics-id="cart-close"
                      className="flex h-11 w-11 items-center justify-center rounded-full text-ink-muted hover:bg-surface"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </Dialog.Close>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-4">
                  {items.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-ink-muted">
                      <ShoppingBag className="h-10 w-10" aria-hidden="true" />
                      <p>Your cart is empty.</p>
                    </div>
                  ) : (
                    <ul className="flex flex-col gap-4">
                      {items.map((item) => (
                        <li key={`${item.productId}-${item.sizeLabel}`} className="flex gap-3">
                          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                            <ProductImage src={item.image.src} alt={item.image.alt} tone={item.image.tone} className="absolute inset-0" />
                          </div>
                          <div className="flex flex-1 flex-col">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <Link href={`/product/${item.slug}`} className="font-medium hover:text-peach">
                                  {item.name}
                                </Link>
                                <p className="text-sm text-ink-muted">{item.sizeLabel}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeItem(item.productId, item.sizeLabel)}
                                aria-label={`Remove ${item.name} from cart`}
                                data-analytics-id="cart-remove-item"
                                className="text-ink-faint hover:text-peach"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="mt-auto flex items-center justify-between pt-2">
                              <div className="flex items-center gap-2 rounded-full border border-border">
                                <button
                                  type="button"
                                  aria-label={`Decrease quantity of ${item.name}`}
                                  onClick={() => updateQuantity(item.productId, item.sizeLabel, item.quantity - 1)}
                                  className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-surface"
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </button>
                                <span className="w-4 text-center text-sm" aria-live="polite">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  aria-label={`Increase quantity of ${item.name}`}
                                  onClick={() => updateQuantity(item.productId, item.sizeLabel, item.quantity + 1)}
                                  className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-surface"
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </button>
                              </div>
                              <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {items.length > 0 && (
                  <div className="border-t border-border px-5 py-4">
                    <div className="mb-4 flex items-center justify-between text-lg">
                      <span className="font-heading">Subtotal ({itemCount})</span>
                      <span className="font-medium">{formatPrice(subtotal)}</span>
                    </div>
                    <Link
                      href="/checkout"
                      onClick={() => {
                        closeCart();
                        track(ANALYTICS_EVENTS.CHECKOUT_STARTED, { itemCount, subtotal });
                      }}
                      data-analytics-id="cart-checkout"
                      className="flex min-h-12 w-full items-center justify-center rounded-full bg-peach px-6 font-medium text-white transition hover:opacity-90"
                    >
                      Checkout
                    </Link>
                  </div>
                )}
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
