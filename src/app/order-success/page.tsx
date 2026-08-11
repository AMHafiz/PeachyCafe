"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CircleCheck, Clock, MapPin } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import { ANALYTICS_EVENTS, track } from "@/lib/analytics";
import { formatPickupDateTime } from "@/lib/storeHours";

interface OrderConfirmationResponse {
  pickupDate?: string;
  pickupTimeSlot?: string;
}

export default function OrderSuccessPage() {
  const { itemCount, subtotal, clearCart } = useCart();
  const hasRun = useRef(false);
  const [pickupLabel, setPickupLabel] = useState<string | null>(null);
  // Only true when there's actually a token to resolve, so the effect below
  // never needs to synchronously flip this back off for the no-token case.
  const [isLoadingPickup, setIsLoadingPickup] = useState(
    () => typeof window !== "undefined" && new URLSearchParams(window.location.search).has("order")
  );

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    track(ANALYTICS_EVENTS.PURCHASE_COMPLETED, { itemCount, subtotal });
    clearCart();

    const token = new URLSearchParams(window.location.search).get("order");
    if (!token) return;

    // Strip the token from the visible URL immediately -- it's single-use,
    // and this also means a page refresh won't re-trigger the emails below.
    window.history.replaceState({}, "", window.location.pathname);
    fetch("/api/clover/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json().catch(() => null) as Promise<OrderConfirmationResponse | null>)
      .then((data) => setPickupLabel(formatPickupDateTime(data?.pickupDate, data?.pickupTimeSlot)))
      .catch((err) => console.error("Failed to send order confirmation emails:", err))
      .finally(() => setIsLoadingPickup(false));
    // Runs once on landing here after a successful Clover redirect -- itemCount/subtotal
    // are only read for this one-time analytics call, not to react to cart changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <CircleCheck className="mx-auto h-14 w-14 text-peach" aria-hidden="true" />
      <h1 className="mt-4 font-heading text-h2 text-ink">Thank you for your order!</h1>
      <p className="mt-2 text-ink-muted">
        Your payment went through and we&apos;re getting started. A confirmation email is on its way.
      </p>

      <div className="mt-8 space-y-5 rounded-xl border border-peach-lighter bg-cream p-6 text-left">
        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-peach" aria-hidden="true" />
          <div className="text-sm text-ink-muted">
            <p className="font-medium text-ink">Pickup Location: The Peachy Bakery | Toronto, ON</p>
            <p className="mt-1">Please bring your confirmation email when you arrive.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-peach" aria-hidden="true" />
          <div className="text-sm text-ink-muted">
            {isLoadingPickup ? (
              <p className="font-medium text-ink">Loading your pickup details&hellip;</p>
            ) : pickupLabel ? (
              <>
                <p className="font-semibold text-ink">{pickupLabel}</p>
                <p className="mt-1">
                  Your pickup slot is locked in. Simply present your email receipt or order number when you arrive.
                </p>
              </>
            ) : (
              <>
                <p className="font-medium text-ink">Pickup Time</p>
                <p className="mt-1">Check your confirmation email for your exact pickup date and time.</p>
              </>
            )}
          </div>
        </div>
      </div>

      <Link
        href="/menu"
        data-analytics-id="order-success-back-to-menu"
        className="mt-8 inline-flex min-h-12 items-center rounded-full bg-peach px-7 font-medium text-white transition hover:opacity-90"
      >
        Back to Menu
      </Link>
    </div>
  );
}
