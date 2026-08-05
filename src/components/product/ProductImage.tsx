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
  src: string | null;
  alt: string;
  tone: "peach" | "blush" | "cream" | "chocolate";
  className?: string;
  priority?: boolean;
  sizes?: string;
  /** "center" (default) suits square product tiles. "corner" tucks a smaller,
   * fainter icon into the bottom-right and hides it below `sm` -- for wide
   * banners (e.g. the hero) where a big centered icon would sit behind text. */
  iconPosition?: "center" | "corner";
}

/**
 * Real product photography may not be dropped into /public/images/products/
 * yet (see data/products.ts). This renders the actual photo when `src`
 * resolves, and falls back to a branded placeholder -- with proper alt text
 * for screen readers -- both when `src` is null and when the file 404s, so
 * broken paths never show a broken-image icon.
 */
export function ProductImage({ src, alt, tone, className = "", priority, sizes, iconPosition = "center" }: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  // Reset the error state during render (not in an effect) when `src` changes,
  // e.g. switching gallery thumbnails -- avoids an extra commit per React's
  // "adjusting state when a prop changes" guidance.
  const [prevSrc, setPrevSrc] = useState(src);
  if (src !== prevSrc) {
    setPrevSrc(src);
    setFailed(false);
  }

  if (src && !failed) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes ?? "(min-width: 1024px) 25vw, 50vw"}
        className={`object-cover ${className}`}
        onError={() => setFailed(true)}
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
