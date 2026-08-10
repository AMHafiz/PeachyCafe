"use client";

import Image from "next/image";
import { useState } from "react";
import { Cake } from "lucide-react";

const TONE_CLASSES: Record<string, string> = {
  peach: "from-peach-light to-peach",
  blush: "from-blush to-peach-light",
  cream: "from-cream to-blush",
  chocolate: "from-cocoa-light to-cocoa",
};

interface ProductImageProps {
  /** A single path, or an ordered list of candidate paths (e.g. the same
   * photo in multiple formats) -- tried in order, falling back to the
   * placeholder once every candidate 404s. */
  src: string | string[] | null;
  alt: string;
  tone: "peach" | "blush" | "cream" | "chocolate";
  className?: string;
  priority?: boolean;
  sizes?: string;
  /** 1-100, passed straight to next/image. Defaults to Next's own default
   * (75) -- bump this for large hero/banner images where compression
   * artifacts are more visible. */
  quality?: number;
  /** Skips Next's image optimizer entirely and serves the source file as-is.
   * Useful for a full-bleed hero where the source is already sized for the
   * viewport and re-encoding it only adds another lossy pass. */
  unoptimized?: boolean;
  /** "center" (default) suits square product tiles. "corner" tucks a smaller,
   * fainter icon into the bottom-right and hides it below `sm` -- for wide
   * banners (e.g. the hero) where a big centered icon would sit behind text. */
  iconPosition?: "center" | "corner";
}

/**
 * Real product photography may not be dropped into /public/images/products/
 * yet (see data/products.ts). This renders the actual photo when `src`
 * resolves, and falls back to a branded placeholder -- with proper alt text
 * for screen readers -- both when `src` is null and when every candidate
 * 404s, so broken paths never show a broken-image icon.
 */
export function ProductImage({
  src,
  alt,
  tone,
  className = "",
  priority,
  sizes,
  quality,
  unoptimized,
  iconPosition = "center",
}: ProductImageProps) {
  const candidates = src === null ? [] : Array.isArray(src) ? src : [src];
  const [attempt, setAttempt] = useState(0);

  // Reset to the first candidate during render (not in an effect) when `src`
  // changes, e.g. switching gallery thumbnails -- avoids an extra commit per
  // React's "adjusting state when a prop changes" guidance.
  const [prevSrc, setPrevSrc] = useState(src);
  if (src !== prevSrc) {
    setPrevSrc(src);
    setAttempt(0);
  }

  const current = candidates[attempt];

  if (current) {
    return (
      <Image
        key={current}
        src={current}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes ?? "(min-width: 1024px) 25vw, 50vw"}
        quality={quality}
        unoptimized={unoptimized}
        className={`object-cover ${className}`}
        onError={() => setAttempt((a) => a + 1)}
      />
    );
  }

  const isCorner = iconPosition === "corner";

  return (
    <div
      role="img"
      aria-label={alt}
      className={`flex bg-gradient-to-br ${TONE_CLASSES[tone]} ${isCorner ? "items-end justify-end p-6 sm:p-10" : "items-center justify-center"} ${className}`}
    >
      <Cake
        className={
          isCorner
            ? "hidden h-16 w-16 text-white/25 sm:block sm:h-20 sm:w-20"
            : "h-1/4 w-1/4 min-h-6 min-w-6 text-white/70"
        }
        strokeWidth={1.25}
        aria-hidden="true"
      />
    </div>
  );
}
