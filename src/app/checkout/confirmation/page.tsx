import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function CheckoutConfirmationPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <CheckCircle2 className="mx-auto h-14 w-14 text-peach" aria-hidden="true" />
      <h1 className="mt-4 font-heading text-h2 text-ink">Order Placed!</h1>
      <p className="mt-2 text-ink-muted">
        Thanks for your order! An order summary has been sent to the bakery.
      </p>
      <Link
        href="/menu"
        className="mt-8 inline-flex min-h-12 items-center rounded-full bg-peach px-7 font-medium text-white hover:opacity-90"
      >
        Continue Browsing
      </Link>
    </div>
  );
}
