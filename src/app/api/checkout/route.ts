import { NextResponse } from "next/server";
import { Resend } from "resend";

export interface CheckoutOrderItem {
  name: string;
  sizeLabel: string;
  quantity: number;
  price: number;
}

export interface CheckoutRequestBody {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickupDate: string;
  pickupTimeSlot: string;
  instructions?: string;
  items: CheckoutOrderItem[];
  subtotal: number;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Resend's shared testing sender -- swap for a verified sending domain
// (e.g. orders@thepeachy.ca) once one is configured in the Resend dashboard.
const FROM_ADDRESS = "The Peachy Website <onboarding@resend.dev>";

function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
}

function formatPickupDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(year, (month ?? 1) - 1, day ?? 1);
  return date.toLocaleDateString("en-CA", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function renderEmailHtml(body: CheckoutRequestBody): string {
  const rowsHtml = body.items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 12px 8px 0;">${item.name} <span style="color:#757575;">(${item.sizeLabel})</span></td>
          <td style="padding:8px 12px;color:#757575;">&times; ${item.quantity}</td>
          <td style="padding:8px 0;text-align:right;">${formatCurrency(item.price * item.quantity)}</td>
        </tr>`
    )
    .join("");

  return `
    <div style="font-family:sans-serif;font-size:14px;color:#1a1b1f;">
      <h2 style="color:#ed767a;">New order from thepeachy.ca</h2>

      <div style="display:inline-block;background:#1a1b1f;color:#fff;padding:6px 14px;border-radius:999px;font-weight:600;letter-spacing:0.05em;font-size:12px;">
        IN-STORE PICKUP
      </div>

      <table style="width:100%;border-collapse:collapse;margin-top:16px;">
        <tr>
          <td style="padding:4px 12px 4px 0;color:#757575;">Pickup Date</td>
          <td style="font-weight:600;">${formatPickupDate(body.pickupDate)}</td>
        </tr>
        <tr>
          <td style="padding:4px 12px 4px 0;color:#757575;">Pickup Time Slot</td>
          <td style="font-weight:600;">${body.pickupTimeSlot}</td>
        </tr>
      </table>

      <hr style="margin:16px 0;border:none;border-top:1px solid #e4dcd8;" />

      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:4px 12px 4px 0;color:#757575;">Name</td>
          <td>${body.customerName}</td>
        </tr>
        <tr>
          <td style="padding:4px 12px 4px 0;color:#757575;">Email</td>
          <td>${body.customerEmail}</td>
        </tr>
        <tr>
          <td style="padding:4px 12px 4px 0;color:#757575;">Phone</td>
          <td>${body.customerPhone}</td>
        </tr>
      </table>

      <hr style="margin:16px 0;border:none;border-top:1px solid #e4dcd8;" />

      <table style="width:100%;border-collapse:collapse;">
        ${rowsHtml}
        <tr>
          <td colspan="2" style="padding:12px 12px 0 0;font-weight:600;border-top:1px solid #e4dcd8;">Total</td>
          <td style="padding:12px 0 0;text-align:right;font-weight:600;border-top:1px solid #e4dcd8;">${formatCurrency(body.subtotal)}</td>
        </tr>
      </table>

      ${body.instructions ? `<p style="margin-top:16px;white-space:pre-wrap;"><strong>Special Instructions / Inscription:</strong><br />${body.instructions}</p>` : ""}
    </div>
  `;
}

function isValidItems(items: unknown): items is CheckoutOrderItem[] {
  return (
    Array.isArray(items) &&
    items.length > 0 &&
    items.every(
      (item) =>
        item &&
        typeof item.name === "string" &&
        typeof item.sizeLabel === "string" &&
        typeof item.quantity === "number" &&
        item.quantity > 0 &&
        typeof item.price === "number" &&
        item.price >= 0
    )
  );
}

export async function POST(request: Request) {
  let body: CheckoutRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body.customerName?.trim()) {
    return NextResponse.json({ error: "Your name is required." }, { status: 400 });
  }
  if (!body.customerEmail?.trim() || !EMAIL_PATTERN.test(body.customerEmail)) {
    return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
  }
  if (!body.customerPhone?.trim()) {
    return NextResponse.json({ error: "Your phone number is required." }, { status: 400 });
  }
  if (!body.pickupDate?.trim()) {
    return NextResponse.json({ error: "A pickup date is required." }, { status: 400 });
  }
  if (!body.pickupTimeSlot?.trim()) {
    return NextResponse.json({ error: "A pickup time slot is required." }, { status: 400 });
  }
  if (!isValidItems(body.items)) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }
  if (typeof body.subtotal !== "number" || !Number.isFinite(body.subtotal) || body.subtotal < 0) {
    return NextResponse.json({ error: "Invalid order total." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const notificationEmail = process.env.STORE_NOTIFICATION_EMAIL;
  if (!apiKey || !notificationEmail) {
    console.error("Checkout submitted but RESEND_API_KEY / STORE_NOTIFICATION_EMAIL is not configured.");
    return NextResponse.json({ error: "Ordering is not available yet. Please call us to place your order." }, { status: 500 });
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: notificationEmail,
    replyTo: body.customerEmail,
    subject: `[IN-STORE PICKUP] New order from ${body.customerName} -- ${formatCurrency(body.subtotal)}`,
    html: renderEmailHtml(body),
  });

  if (error) {
    console.error("Resend failed to send order email:", error);
    return NextResponse.json({ error: "We couldn't submit your order. Please try again shortly." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
