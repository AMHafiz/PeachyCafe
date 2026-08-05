/**
 * Analytics stub. Every interaction named in PLAN.md calls `track()` and carries a
 * matching `data-analytics-id` attribute, so GA4 / GrowthBook / Clarity (or an
 * experimentation layer) can be wired in here later without touching any component.
 */
export const ANALYTICS_EVENTS = {
  PRODUCT_VIEWED: "product_viewed",
  PRODUCT_PAGE_VIEWED: "product_page_viewed",
  QUICK_VIEW_OPENED: "quick_view_opened",
  CATEGORY_SELECTED: "category_selected",
  SEARCH_USED: "search_used",
  FILTER_APPLIED: "filter_applied",
  PRODUCT_ADDED_TO_CART: "product_added_to_cart",
  PAIRING_CLICKED: "pairing_clicked",
  RECOMMENDATION_CLICKED: "recommendation_clicked",
  CHECKOUT_STARTED: "checkout_started",
  PURCHASE_COMPLETED: "purchase_completed",
  CONTACT_FORM_SUBMITTED: "contact_form_submitted",
} as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

export function track(event: AnalyticsEvent, payload: Record<string, unknown> = {}): void {
  if (process.env.NODE_ENV !== "production") {
    console.debug(`[analytics] ${event}`, payload);
  }
  // No SDK wired up yet -- intentionally a no-op beyond the dev log above.
}
