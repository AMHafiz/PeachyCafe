"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, UtensilsCrossed } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";

const LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/menu", label: "Menu", icon: UtensilsCrossed },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();

  return (
    <nav
      aria-label="Mobile bottom navigation"
      className="fixed inset-x-0 bottom-0 z-30 flex h-16 items-stretch border-t border-border bg-white/95 backdrop-blur md:hidden"
    >
      {LINKS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            data-analytics-id={`bottomnav-${label.toLowerCase()}`}
            aria-current={active ? "page" : undefined}
            className={`flex flex-1 flex-col items-center justify-center gap-1 text-xs font-medium ${active ? "text-peach" : "text-ink-muted"}`}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
            {label}
          </Link>
        );
      })}
      <button
        type="button"
        onClick={openCart}
        data-analytics-id="bottomnav-cart"
        aria-label={`Open cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
        className="relative flex flex-1 flex-col items-center justify-center gap-1 text-xs font-medium text-ink-muted"
      >
        <ShoppingBag className="h-5 w-5" aria-hidden="true" />
        Cart
        {itemCount > 0 && (
          <span className="absolute right-6 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-peach text-[10px] text-white" aria-hidden="true">
            {itemCount}
          </span>
        )}
      </button>
    </nav>
  );
}
