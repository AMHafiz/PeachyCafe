export type CategoryId =
  | "whole-cakes"
  | "spoon-cakes"
  | "bingsu"
  | "drinks"
  | "bakery"
  | "gift-sets";

export interface Category {
  id: CategoryId;
  label: string;
}

export const CATEGORIES: Category[] = [
  { id: "whole-cakes", label: "Whole Cakes" },
  { id: "spoon-cakes", label: "Spoon Cakes" },
  { id: "bingsu", label: "Bingsu" },
  { id: "drinks", label: "Drinks" },
  { id: "bakery", label: "Bakery" },
  { id: "gift-sets", label: "Gift Sets" },
];

/** Filter tags surfaced in the FilterBar. Marketing badges (bestSeller/staffPick/etc.)
 * are only ever set on a product once the business confirms them — see data/products.ts. */
export type FilterTag =
  | "best-seller"
  | "new"
  | "seasonal"
  | "chocolate"
  | "fruit"
  | "coffee";

export type BadgeId =
  | "best-seller"
  | "staff-pick"
  | "new"
  | "limited-time"
  | "seasonal"
  | "coming-soon"
  | "sold-out";

export interface ProductSize {
  label: string;
  price: number | null; // null = price TBA (matches real "Coming Soon" bingsu flavors)
}

export interface Rating {
  value: number; // 0-5
  count: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategoryId;
  /** Small products open a Quick View modal; large products get a dedicated /product/[slug] page. */
  size: "small" | "large";
  shortDescription: string;
  description: string;
  flavorNotes?: string[];
  ingredients: string[];
  allergens: string[];
  storage: string;
  servingInfo: string;
  shelfLife: string;
  sizes: ProductSize[];
  nutrition?: string;
  image: {
    src: string | null;
    alt: string;
    tone: "peach" | "blush" | "cream" | "chocolate";
  };
  gallery?: { src: string | null; alt: string; tone: "peach" | "blush" | "cream" | "chocolate" }[];
  badges?: BadgeId[];
  filterTags?: FilterTag[];
  rating?: Rating;
  /** Product ids this pairs well with (desserts -> drinks, and vice versa). */
  pairsWith?: string[];
  /** True for the seeded Drinks/Bakery items that stand in for a menu the client hasn't published yet. */
  isPlaceholderContent?: boolean;
  /** Real item, real price, temporarily out of stock -- distinct from a null size price ("Coming Soon" / TBA). */
  isSoldOut?: boolean;
}

export interface CartLine {
  productId: string;
  sizeLabel: string;
  quantity: number;
}
