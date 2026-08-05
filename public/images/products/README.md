# Product Images

Drop real product photography here and it appears on the site automatically
-- no code changes needed. `src/data/products.ts` already points every
product at a path in this folder; `ProductImage` (`src/components/product/ProductImage.tsx`)
falls back to a branded placeholder for any file that isn't here yet, so
missing images never show a broken-image icon.

## Naming convention

- Card / Quick View image: `<slug>.jpg`
- Product-page gallery (whole cakes only): `<slug>-1.jpg`, `<slug>-2.jpg`, ...

`<slug>` is the product's `slug` field in `src/data/products.ts`, e.g. the
Triple Chocolate Mousse whole cake expects `triple-chocolate-mousse-cake.jpg`.

## Guidelines

- Square-ish images work best (cards render at a 1:1 aspect ratio).
- JPG or WebP, ideally under ~300KB -- `next/image` handles resizing, but
  smaller source files still mean a faster build and less bandwidth.
- Any other extension (`.png`, `.webp`, `.avif`) works too -- just update the
  matching `image.src` / `gallery[].src` path in `products.ts` to match.
