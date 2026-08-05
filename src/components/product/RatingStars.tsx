import { Star } from "lucide-react";
import type { Rating } from "@/lib/types";

/** Renders nothing when a product has no rating yet -- ready to populate later, not fabricated. */
export function RatingStars({ rating }: { rating?: Rating }) {
  if (!rating) return null;

  return (
    <div className="flex items-center gap-1" aria-label={`Rated ${rating.value} out of 5 from ${rating.count} reviews`}>
      <div className="flex" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-3.5 w-3.5 ${i < Math.round(rating.value) ? "fill-peach text-peach" : "fill-transparent text-border"}`}
          />
        ))}
      </div>
      <span className="text-xs text-ink-muted">({rating.count})</span>
    </div>
  );
}
