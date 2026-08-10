"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Cake, Coffee, IceCreamBowl } from "lucide-react";
import { ProductImage } from "@/components/product/ProductImage";

const AUTO_ROTATE_MS = 12_000;

interface HeroSlide {
  id: string;
  eyebrow: string;
  caption: string;
  /** Candidate image paths tried in order -- lets either a .png or .jpg
   * dropped in with the matching name appear automatically. */
  image: string[];
  /** Optional dedicated portrait crop shown only below `md`, same
   * png/jpg-candidate shape as `image`. Falls back to `image` (with a
   * mobile-biased focal point) when a slide doesn't set one. */
  mobileImage?: string[];
  /** Tailwind object-position class for the mobile image, e.g. when the
   * product sits somewhere other than where the default mobile crop
   * (`object-[70%_center]`) lands. Defaults to that mobile crop when unset. */
  mobileObjectPosition?: string;
  alt: string;
  tone: "peach" | "blush" | "cream" | "chocolate";
  icon: typeof Cake;
}

const SLIDES: HeroSlide[] = [
  {
    id: "bingsu",
    eyebrow: "Signature Bingsu",
    caption: "Premium Strawberry Bingsu, shaved milk ice piled high with fresh fruit.",
    image: ["/images/hero/signature-bingsu.png", "/images/hero/signature-bingsu.jpg"],
    alt: "The Peachy's signature strawberry bingsu",
    tone: "blush",
    icon: IceCreamBowl,
  },
  {
    id: "drink",
    eyebrow: "Signature Drink",
    caption: "Spanish Latte, espresso balanced with silky condensed milk.",
    image: ["/images/hero/signature-drink.png", "/images/hero/signature-drink.jpg"],
    alt: "The Peachy's signature Spanish latte",
    tone: "cream",
    icon: Coffee,
  },
];

export function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, AUTO_ROTATE_MS);
    return () => clearTimeout(timer);
  }, [index]);

  const slide = SLIDES[index];
  const Icon = slide.icon;

  return (
    <section className="relative isolate flex min-h-[80vh] items-end overflow-hidden md:min-h-155 md:items-center">
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={slide.id}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          {/* Mobile: a dedicated portrait crop when a slide provides one, else the
              same photo with a focal point biased toward where the product sits. */}
          <ProductImage
            src={slide.mobileImage ?? slide.image}
            alt={slide.alt}
            tone={slide.tone}
            className={`absolute inset-0 block ${slide.mobileObjectPosition ?? "object-[70%_center]"} [image-rendering:-webkit-optimize-contrast] md:hidden`}
            priority={index === 0}
            iconPosition="corner"
            sizes="100vw"
            quality={100}
          />
          <ProductImage
            src={slide.image}
            alt={slide.alt}
            tone={slide.tone}
            className="absolute inset-0 hidden [image-rendering:-webkit-optimize-contrast] md:block"
            priority={index === 0}
            iconPosition="corner"
            sizes="100vw"
            quality={100}
          />
          {/* Mobile: dark scrim rises from the bottom (where the text sits) and
              fades out toward the top, so the product stays visible above it.
              Desktop (unchanged): dark on the left under the text, fully clear
              by ~58% across so the product on the right stays bright. */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent md:bg-[linear-gradient(to_right,rgba(0,0,0,0.75)_0%,rgba(0,0,0,0.45)_35%,rgba(0,0,0,0)_58%)]" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pt-8 pb-12 sm:px-6 md:py-24">
        <div className="max-w-xl space-y-6">
          <div>
            <p className="font-heading text-sm uppercase tracking-[0.2em] text-peach-light">Seoulful Temptations in Toronto</p>
            <h1 className="mt-3 font-heading text-display text-white">Everything is just peachy.</h1>
          </div>

          <p className="max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
            Premium Korean-inspired whole cakes, spoon cakes, and bingsu — made with Belgian chocolate, organic
            vanilla bean, and fresh cream, never substitutes.
          </p>

          <div className="hidden md:block md:min-h-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-3 rounded-xl border border-white/25 bg-white/10 p-4 backdrop-blur-sm"
              >
                <Icon className="h-5 w-5 flex-shrink-0 text-peach-light" aria-hidden="true" />
                <p className="text-sm text-white">
                  <span className="font-medium">{slide.eyebrow}:</span> {slide.caption}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex w-full flex-row flex-wrap gap-3 sm:w-auto">
            <Link
              href="/menu"
              data-analytics-id="hero-view-menu"
              className="flex items-center justify-center rounded-full bg-peach px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 sm:min-h-12 sm:px-7 sm:text-base"
            >
              View Menu
            </Link>
            <Link
              href="/contact"
              data-analytics-id="hero-contact"
              className="flex items-center justify-center rounded-full border border-white/60 px-4 py-2 text-sm font-medium text-white transition hover:bg-white hover:text-ink sm:min-h-12 sm:px-7 sm:text-base"
            >
              Visit Us
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-6 z-10 flex justify-center gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show slide ${i + 1}: ${s.eyebrow}`}
            aria-current={i === index ? "true" : undefined}
            data-analytics-id={`hero-dot-${s.id}`}
            className={`h-2.5 rounded-full transition-all ${i === index ? "w-6 bg-white" : "w-2.5 bg-white/50 hover:bg-white/80"}`}
          />
        ))}
      </div>
    </section>
  );
}
