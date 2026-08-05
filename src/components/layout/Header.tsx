"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  function closeSearch() {
    setSearchOpen(false);
    // If a search is currently filtering /menu results, drop the ?q= param so
    // closing the search bar restores the default menu view -- client-side
    // navigation only, no page refresh. Read window.location directly (rather
    // than useSearchParams/usePathname) so Header -- rendered on every page via
    // the root layout -- doesn't force the whole app out of static rendering.
    if (window.location.pathname === "/menu") {
      const params = new URLSearchParams(window.location.search);
      if (params.has("q")) {
        params.delete("q");
        const qs = params.toString();
        router.replace(qs ? `/menu?${qs}` : "/menu");
      }
    }
  }

  function handleSearchToggle() {
    if (searchOpen) {
      closeSearch();
    } else {
      setSearchOpen(true);
    }
  }

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
            onClick={handleSearchToggle}
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
          <SearchBar autoFocus onClear={closeSearch} />
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
