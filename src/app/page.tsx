import Link from "next/link";
import { Croissant, Egg, Leaf, Sparkles } from "lucide-react";
import { ProductImage } from "@/components/product/ProductImage";
import { PairingsSection } from "@/components/product/PairingsSection";
import { Hero } from "@/components/home/Hero";
import { CATEGORIES } from "@/lib/types";
import { products, getProductById } from "@/data/products";

const INGREDIENT_HIGHLIGHTS = [
  { icon: Sparkles, title: "Belgian Callebaut Chocolate", description: "Premium chocolate in every chocolate cake and cookie." },
  { icon: Leaf, title: "Organic Vanilla Bean", description: "Real vanilla bean, never artificial flavoring." },
  { icon: Egg, title: "100% Fresh Cream & Eggs", description: "No plant-based or liquid alternatives, ever." },
  { icon: Croissant, title: "Sugar-Free Options", description: "Selected cakes available with less sugar, same flavor." },
];

const FEATURED_IDS = ["wc-strawberry-chocolate", "wc-triple-chocolate-mousse", "bs-premium-strawberry", "sc-ice-box-oreo"];

export default function HomePage() {
  const availableCategories = CATEGORIES.filter((c) => products.some((p) => p.category === c.id));
  const featured = FEATURED_IDS.map(getProductById).filter((p): p is NonNullable<typeof p> => p !== undefined);

  return (
    <div>
      <Hero />

      {/* Ingredient highlights */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {INGREDIENT_HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
            <div key={title} className="rounded-2xl border border-border p-5">
              <Icon className="h-6 w-6 text-peach" aria-hidden="true" />
              <p className="mt-3 font-heading text-base text-ink">{title}</p>
              <p className="mt-1 text-sm text-ink-muted">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bingsu seasonal spotlight */}
      <section className="bg-blush">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 sm:px-6 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl md:order-2">
            <ProductImage src={null} alt="Bowl of shaved ice bingsu topped with fresh fruit" tone="peach" className="absolute inset-0" />
          </div>
          <div>
            <p className="font-heading text-sm uppercase tracking-[0.2em] text-peach">Summer Specialty</p>
            <h2 className="mt-2 font-heading text-h2 text-ink">Bingsu, Korean shaved ice</h2>
            <p className="mt-3 max-w-md text-ink-muted">
              Delicately shaved milk ice piled high with fresh fruit, cheesecake, and rich toppings. Shareable,
              refreshing, and made for two.
            </p>
            <Link
              href="/menu?category=bingsu"
              data-analytics-id="home-bingsu-link"
              className="mt-6 inline-flex min-h-12 items-center rounded-full bg-ink px-7 font-medium text-white transition hover:opacity-90"
            >
              Explore Bingsu
            </Link>
          </div>
        </div>
      </section>

      {/* Category tiles */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="font-heading text-h2 text-ink">Shop by Category</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {availableCategories.map((category) => (
            <Link
              key={category.id}
              href={`/menu?category=${category.id}`}
              data-analytics-id={`home-category-${category.id}`}
              className="group relative flex aspect-square flex-col justify-end overflow-hidden rounded-2xl"
            >
              <ProductImage src={null} alt="" tone="cream" className="absolute inset-0 transition duration-300 group-hover:scale-105" />
              <span className="relative bg-gradient-to-t from-black/60 to-transparent p-4 font-heading text-lg text-white">
                {category.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <PairingsSection title="From the Menu" products={featured} analyticsId="home-featured-card" />
      </div>

      {/* Catering callout */}
      <section className="bg-ink">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-14 text-white sm:px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-heading text-h2">Catering &amp; Custom Cakes</h2>
            <p className="mt-2 max-w-md text-white/70">
              Planning something special? We cater celebrations of every size with custom whole cakes and dessert
              spreads.
            </p>
          </div>
          <Link
            href="/contact"
            data-analytics-id="home-catering-contact"
            className="flex min-h-12 flex-shrink-0 items-center rounded-full bg-peach px-7 font-medium text-white transition hover:opacity-90"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
