# Hero Carousel Images

Background photos for the homepage hero carousel (`src/components/home/Hero.tsx`).
Same graceful-fallback behavior as `public/images/products/` -- drop a file
in with the matching name and it appears automatically; until then the
carousel renders its branded placeholder.

- `signature-cake.jpg` -- Signature Cake slide
- `signature-bingsu.jpg` -- Signature Bingsu slide
- `signature-drink.jpg` -- Signature Drink slide

Wide/landscape images work best (the carousel fills a full-width banner).
Every slide has a dark gradient overlay applied automatically for text
contrast, so images can be bright without hurting hero text readability.
