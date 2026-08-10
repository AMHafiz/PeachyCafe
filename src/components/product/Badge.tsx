import type { BadgeId } from "@/lib/types";

const BADGE_LABELS: Record<BadgeId, string> = {
  "best-seller": "Best Seller",
  "staff-pick": "Staff Pick",
  new: "New",
  "limited-time": "Limited Time",
  seasonal: "Seasonal",
  "coming-soon": "Coming Soon",
  "sold-out": "Sold Out",
};

const BADGE_CLASSES: Record<BadgeId, string> = {
  "best-seller": "bg-peach text-white",
  "staff-pick": "bg-ink text-white",
  new: "bg-emerald-600 text-white",
  "limited-time": "bg-amber-600 text-white",
  seasonal: "bg-cocoa text-white",
  "coming-soon": "bg-surface text-ink-muted border border-border",
  "sold-out": "bg-surface text-ink-muted border border-border",
};

export function Badge({ id }: { id: BadgeId }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium tracking-wide ${BADGE_CLASSES[id]}`}
    >
      {BADGE_LABELS[id]}
    </span>
  );
}
