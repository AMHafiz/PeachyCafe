"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { Loader2, MapPin, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/components/cart/CartContext";
import { ProductImage } from "@/components/product/ProductImage";
import { formatPrice } from "@/lib/format";
import { ANALYTICS_EVENTS, track } from "@/lib/analytics";
import { generateTimeSlots } from "@/lib/storeHours";
import type { CloverCheckoutRequestBody } from "@/app/api/clover/checkout/route";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9()+\-.\s]{7,}$/;

const inputClass =
  "min-h-12 w-full rounded-xl border border-border bg-white px-4 text-sm text-ink placeholder:text-ink-faint focus:border-peach focus:outline-none";

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  pickupDate?: string;
  pickupTimeSlot?: string;
}

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function CheckoutPage() {
  const { items, itemCount, subtotal } = useCart();
  const formId = useId();

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTimeSlot, setPickupTimeSlot] = useState("");
  const [instructions, setInstructions] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = useMemo(() => generateTimeSlots(pickupDate), [pickupDate]);

  function handlePickupDateChange(nextDate: string) {
    // Reset the time whenever the date changes -- a previously chosen slot may
    // no longer be valid (different day's hours, or it's since passed today).
    setPickupDate(nextDate);
    setPickupTimeSlot("");
    setErrors((prev) => ({ ...prev, pickupTimeSlot: undefined }));
  }

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();

    const nextErrors: FormErrors = {};
    if (!customerName.trim()) nextErrors.name = "Your name is required.";
    if (!customerEmail.trim()) nextErrors.email = "Your email is required.";
    else if (!EMAIL_PATTERN.test(customerEmail)) nextErrors.email = "Enter a valid email address.";
    if (!customerPhone.trim()) nextErrors.phone = "Your phone number is required.";
    else if (!PHONE_PATTERN.test(customerPhone)) nextErrors.phone = "Enter a valid phone number.";
    if (!pickupDate) nextErrors.pickupDate = "Pickup date is required.";
    if (!pickupTimeSlot) nextErrors.pickupTimeSlot = "Please select a pickup time slot.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const payload: CloverCheckoutRequestBody = {
        customerName,
        customerEmail,
        customerPhone,
        pickupDate,
        pickupTimeSlot,
        instructions: instructions.trim() || undefined,
        items: items.map((item) => ({
          productId: item.productId,
          sizeLabel: item.sizeLabel,
          quantity: item.quantity,
        })),
      };

      const res = await fetch("/api/clover/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.url) {
        throw new Error(data?.error ?? "We couldn't start checkout.");
      }

      track(ANALYTICS_EVENTS.CHECKOUT_STARTED, { itemCount, subtotal, pickupDate, pickupTimeSlot });
      window.location.href = data.url;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "We couldn't start checkout. Please try again.");
      setIsSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-heading text-h2 text-ink">Your cart is empty</h1>
        <p className="mt-2 text-ink-muted">Add something delicious before checking out.</p>
        <Link
          href="/menu"
          className="mt-6 inline-flex min-h-12 items-center rounded-full bg-peach px-7 font-medium text-white hover:opacity-90"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <h1 className="font-heading text-h2 text-ink">Checkout</h1>
      <p className="mt-1 text-sm text-ink-muted">In-store pickup only -- review your order and request a pickup slot below.</p>

      <div className="mt-4 flex items-start gap-3 rounded-xl border border-peach-lighter bg-cream p-4">
        <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-peach" aria-hidden="true" />
        <div className="text-sm text-ink-muted">
          <p className="font-medium text-ink">Pickup Location: The Peachy Bakery | Toronto, ON</p>
          <p className="mt-1">
            Note: This is a pre-order request. Once submitted, our team will review availability and email an
            invoice to secure your pickup slot.
          </p>
        </div>
      </div>

      <ul className="mt-8 divide-y divide-border border-y border-border">
        {items.map((item) => (
          <li key={`${item.productId}-${item.sizeLabel}`} className="flex items-center gap-4 py-4">
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
              <ProductImage src={item.image.src} alt={item.image.alt} tone={item.image.tone} className="absolute inset-0" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-ink">{item.name}</p>
              <p className="text-sm text-ink-muted">
                {item.sizeLabel} &times; {item.quantity}
              </p>
            </div>
            <span className="font-medium text-ink">{formatPrice(item.price * item.quantity)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between text-lg">
        <span className="font-heading">Total ({itemCount} items)</span>
        <span className="font-medium">{formatPrice(subtotal)}</span>
      </div>

      <form onSubmit={handleCheckout} noValidate className="mt-8 space-y-6">
        <div className="space-y-4">
          <h2 className="font-heading text-base text-ink">Customer Details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={`${formId}-name`} className="block text-sm font-medium text-ink">
                Your Name
              </label>
              <input
                id={`${formId}-name`}
                type="text"
                autoComplete="name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? `${formId}-name-error` : undefined}
                className={`mt-1.5 ${inputClass}`}
              />
              {errors.name && (
                <p id={`${formId}-name-error`} role="alert" className="mt-1.5 text-xs text-red-600">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor={`${formId}-email`} className="block text-sm font-medium text-ink">
                Email Address
              </label>
              <input
                id={`${formId}-email`}
                type="email"
                autoComplete="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? `${formId}-email-error` : undefined}
                placeholder="you@example.com"
                className={`mt-1.5 ${inputClass}`}
              />
              {errors.email && (
                <p id={`${formId}-email-error`} role="alert" className="mt-1.5 text-xs text-red-600">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor={`${formId}-phone`} className="block text-sm font-medium text-ink">
                Phone Number
              </label>
              <input
                id={`${formId}-phone`}
                type="tel"
                autoComplete="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? `${formId}-phone-error` : undefined}
                placeholder="(416) 555-0123"
                className={`mt-1.5 ${inputClass}`}
              />
              {errors.phone && (
                <p id={`${formId}-phone-error`} role="alert" className="mt-1.5 text-xs text-red-600">
                  {errors.phone}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="font-heading text-base text-ink">Pickup Details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={`${formId}-pickupDate`} className="block text-sm font-medium text-ink">
                Requested Pickup Date
              </label>
              <input
                id={`${formId}-pickupDate`}
                type="date"
                min={todayIsoDate()}
                value={pickupDate}
                onChange={(e) => handlePickupDateChange(e.target.value)}
                aria-invalid={!!errors.pickupDate}
                aria-describedby={errors.pickupDate ? `${formId}-pickupDate-error` : undefined}
                className={`mt-1.5 ${inputClass}`}
              />
              {errors.pickupDate && (
                <p id={`${formId}-pickupDate-error`} role="alert" className="mt-1.5 text-xs text-red-600">
                  {errors.pickupDate}
                </p>
              )}
            </div>

            <div>
              <label htmlFor={`${formId}-pickupTimeSlot`} className="block text-sm font-medium text-ink">
                Requested Pickup Time Slot
              </label>
              {pickupDate && timeSlots.length === 0 ? (
                <div
                  id={`${formId}-pickupTimeSlot`}
                  className="mt-1.5 flex min-h-12 items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 text-sm text-amber-800"
                >
                  <TriangleAlert className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                  <span>Ordering is unavailable for that day/time. Please choose another date.</span>
                </div>
              ) : (
                <select
                  id={`${formId}-pickupTimeSlot`}
                  value={pickupTimeSlot}
                  onChange={(e) => setPickupTimeSlot(e.target.value)}
                  disabled={!pickupDate}
                  aria-invalid={!!errors.pickupTimeSlot}
                  aria-describedby={errors.pickupTimeSlot ? `${formId}-pickupTimeSlot-error` : undefined}
                  className={`mt-1.5 ${inputClass} disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  <option value="">{pickupDate ? "Select a time" : "Select a date first"}</option>
                  {timeSlots.map((slot) => (
                    <option key={slot.value} value={slot.value}>
                      {slot.label}
                    </option>
                  ))}
                </select>
              )}
              {errors.pickupTimeSlot && (
                <p id={`${formId}-pickupTimeSlot-error`} role="alert" className="mt-1.5 text-xs text-red-600">
                  {errors.pickupTimeSlot}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor={`${formId}-instructions`} className="block text-sm font-medium text-ink">
              Special Instructions / Inscription <span className="font-normal text-ink-muted">(optional)</span>
            </label>
            <textarea
              id={`${formId}-instructions`}
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Cake inscription, allergies, or anything else we should know..."
              className={`mt-1.5 min-h-20 resize-y py-3 ${inputClass}`}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          data-analytics-id="checkout-place-order"
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-peach px-6 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {isSubmitting ? "Redirecting to Payment..." : "Continue to Payment"}
        </button>
      </form>
    </div>
  );
}
