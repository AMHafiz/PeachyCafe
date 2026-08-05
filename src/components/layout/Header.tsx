"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu as MenuIcon, Search, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import { SearchBar } from "@/components/search/SearchBar";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const { itemCount, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="font-heading text-xl tracking-wide text-ink" data-analytics-id="nav-logo">
          The Peachy
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-analytics-id={`nav-link-${link.label.toLowerCase()}`}
              className="text-sm font-medium text-ink transition hover:text-peach"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            aria-label={searchOpen ? "Close search" : "Open search"}
            aria-expanded={searchOpen}
            data-analytics-id="nav-search-toggle"
            className="flex h-11 w-11 items-center justify-center rounded-full text-ink hover:bg-surface"
          >
            {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </button>
          <button
            type="button"
            onClick={openCart}
            aria-label={`Open cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
            data-analytics-id="nav-cart-toggle"
            className="relative flex h-11 w-11 items-center justify-center rounded-full text-ink hover:bg-surface"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-peach text-[10px] font-medium text-white" aria-hidden="true">
                {itemCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            data-analytics-id="nav-mobile-toggle"
            className="flex h-11 w-11 items-center justify-center rounded-full text-ink hover:bg-surface md:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-border px-4 py-3 sm:px-6">
          <SearchBar autoFocus />
        </div>
      )}

      {mobileMenuOpen && (
        <nav aria-label="Mobile" className="border-t border-border px-4 py-3 md:hidden">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex min-h-12 items-center text-base font-medium text-ink hover:text-peach"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
