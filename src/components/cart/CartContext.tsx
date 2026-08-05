"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getProductById } from "@/data/products";
import type { CartLine } from "@/lib/types";
import { ANALYTICS_EVENTS, track } from "@/lib/analytics";

const STORAGE_KEY = "peachy-cart-v1";

export interface CartItem extends CartLine {
  name: string;
  price: number;
  image: { src: string | null; alt: string; tone: "peach" | "blush" | "cream" | "chocolate" };
  slug: string;
}

interface CartContextValue {
  lines: CartLine[];
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (productId: string, sizeLabel: string, quantity?: number) => void;
  removeItem: (productId: string, sizeLabel: string) => void;
  updateQuantity: (productId: string, sizeLabel: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Reads an external store (localStorage) once after mount, deliberately after the
    // server-rendered empty-cart paint so SSR output and first client paint always match.
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setLines(JSON.parse(raw));
    } catch {
      // ignore corrupt/blocked storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  function addItem(productId: string, sizeLabel: string, quantity = 1) {
    const product = getProductById(productId);
    setLines((prev) => {
      const existing = prev.find((l) => l.productId === productId && l.sizeLabel === sizeLabel);
      if (existing) {
        return prev.map((l) =>
          l.productId === productId && l.sizeLabel === sizeLabel
            ? { ...l, quantity: l.quantity + quantity }
            : l
        );
      }
      return [...prev, { productId, sizeLabel, quantity }];
    });
    track(ANALYTICS_EVENTS.PRODUCT_ADDED_TO_CART, { productId, sizeLabel, quantity, name: product?.name });
    setIsOpen(true);
  }

  function removeItem(productId: string, sizeLabel: string) {
    setLines((prev) => prev.filter((l) => !(l.productId === productId && l.sizeLabel === sizeLabel)));
  }

  function updateQuantity(productId: string, sizeLabel: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(productId, sizeLabel);
      return;
    }
    setLines((prev) =>
      prev.map((l) => (l.productId === productId && l.sizeLabel === sizeLabel ? { ...l, quantity } : l))
    );
  }

  function clearCart() {
    setLines([]);
  }

  const items: CartItem[] = useMemo(
    () =>
      lines
        .map((line) => {
          const product = getProductById(line.productId);
          if (!product) return null;
          const size = product.sizes.find((s) => s.label === line.sizeLabel);
          if (!size || size.price === null) return null;
          const item: CartItem = {
            ...line,
            name: product.name,
            price: size.price,
            image: product.image,
            slug: product.slug,
          };
          return item;
        })
        .filter((i): i is CartItem => i !== null),
    [lines]
  );

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const value: CartContextValue = {
    lines,
    items,
    itemCount,
    subtotal,
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
