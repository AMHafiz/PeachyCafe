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
  image: string;
  alt: string;
  tone: "peach" | "blush" | "cream" | "chocolate";
  icon: typeof Cake;
}

const SLIDES: HeroSlide[] = [
  {
    id: "cake",
    eyebrow: "Signature Cake",
    caption: "Triple Chocolate Mousse, layered with Callebaut Belgian chocolate.",
    image: "/images/hero/signature-cake.jpg",
    alt: "The Peachy's signature whole chocolate cake",
    tone: "chocolate",
    icon: Cake,
  },
  {
    id: "bingsu",
    eyebrow: "Signature Bingsu",
    caption: "Premium Strawberry Bingsu, shaved milk ice piled high with fresh fruit.",
    image: "/images/hero/signature-bingsu.jpg",
    alt: "The Peachy's signature strawberry bingsu",
    tone: "blush",
    icon: IceCreamBowl,
  },
  {
    id: "drink",
    eyebrow: "Signature Drink",
    caption: "Spanish Latte, espresso balanced with silky condensed milk.",
    image: "/images/hero/signature-drink.jpg",
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
    <section className="relative isolate flex min-h-[520px] items-center overflow-hidden md:min-h-[620px]">
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={slide.id}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <ProductImage
            src={slide.image}
            alt={slide.alt}
            tone={slide.tone}
            className="absolute inset-0"
            priority={index === 0}
            iconPosition="corner"
          />
          {/* Dark overlay so hero text stays readable over any background image */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />
          <div className="absolute inset-0 bg-black/10" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 md:py-24">
        <div className="max-w-xl space-y-6">
          <div>
            <p className="font-heading text-sm uppercase tracking-[0.2em] text-peach-light">Seoulful Temptations in Toronto</p>
            <h1 className="mt-3 font-heading text-display text-white">Everything is just peachy.</h1>
          </div>

          <p className="max-w-md leading-relaxed text-white/85">
            Premium Korean-inspired whole cakes, spoon cakes, and bingsu — made with Belgian chocolate, organic
            vanilla bean, and fresh cream, never substitutes.
          </p>

          <div className="min-h-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-3 rounded-xl border border-white/25 bg-white/10 px-4 py-3 backdrop-blur-sm"
              >
                <Icon className="h-5 w-5 flex-shrink-0 text-peach-light" aria-hidden="true" />
                <p className="text-sm text-white">
                  <span className="font-medium">{slide.eyebrow}:</span> {slide.caption}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/menu"
              data-analytics-id="hero-view-menu"
              className="flex min-h-12 items-center rounded-full bg-peach px-7 font-medium text-white transition hover:opacity-90"
            >
              View Menu
            </Link>
            <Link
              href="/contact"
              data-analytics-id="hero-contact"
              className="flex min-h-12 items-center rounded-full border border-white/60 px-7 font-medium text-white transition hover:bg-white hover:text-ink"
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
