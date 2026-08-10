# Hero Carousel Images

Background photos for the homepage hero carousel (`src/components/home/Hero.tsx`).
Same graceful-fallback behavior as `public/images/products/` -- drop a file
in with the matching name and it appears automatically; until then the
carousel renders its branded placeholder.

Each slide accepts either a `.png` or a `.jpg` -- `.png` is tried first, and
if it's not there the matching `.jpg` is used instead.

- `signature-bingsu.png` / `signature-bingsu.jpg` -- Signature Bingsu slide
- `signature-drink.png` / `signature-drink.jpg` -- Signature Drink slide

The Signature Cake slide was removed from the carousel; `signature-cake.png`/`.jpg`
are unused but left in place in case the slide comes back.

Wide/landscape images work best (the carousel fills a full-width banner).
Every slide has a dark gradient overlay applied automatically for text
contrast, so images can be bright without hurting hero text readability.
