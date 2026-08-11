import { NextResponse } from "next/server";
import { Resend } from "resend";
import { formatPickupTimeValue } from "@/lib/storeHours";
import { decryptOrderConfirmation, type OrderConfirmationPayload } from "@/lib/orderConfirmationToken";

// Resend's shared testing sender -- swap for a verified sending domain
// (e.g. orders@thepeachy.ca) once one is configured in the Resend dashboard.
const FROM_ADDRESS = "The Peachy Website <onboarding@resend.dev>";

function formatCurrency(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatPickupDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(year, (month ?? 1) - 1, day ?? 1);
  return date.toLocaleDateString("en-CA", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function renderItemRows(order: OrderConfirmationPayload): string {
  return order.items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 12px 8px 0;">${item.name}</td>
          <td style="padding:8px 12px;color:#757575;">&times; ${item.quantity}</td>
          <td style="padding:8px 0;text-align:right;">${formatCurrency(item.priceCents * item.quantity)}</td>
        </tr>`
    )
    .join("");
}

function renderTotalsRows(order: OrderConfirmationPayload): string {
  return `
    <tr>
      <td colspan="2" style="padding:12px 12px 0 0;border-top:1px solid #e4dcd8;">Subtotal</td>
      <td style="padding:12px 0 0;text-align:right;border-top:1px solid #e4dcd8;">${formatCurrency(order.subtotalCents)}</td>
    </tr>
    <tr>
      <td colspan="2" style="padding:4px 12px 0 0;color:#757575;">HST (13%)</td>
      <td style="padding:4px 0 0;text-align:right;color:#757575;">${formatCurrency(order.taxCents)}</td>
    </tr>
    <tr>
      <td colspan="2" style="padding:8px 12px 0 0;font-weight:600;">Total</td>
      <td style="padding:8px 0 0;text-align:right;font-weight:600;">${formatCurrency(order.totalCents)}</td>
    </tr>`;
}

function renderPickupRows(order: OrderConfirmationPayload): string {
  return `
    <tr>
      <td style="padding:4px 12px 4px 0;color:#757575;">Pickup Date</td>
      <td style="font-weight:600;">${formatPickupDate(order.pickupDate)}</td>
    </tr>
    <tr>
      <td style="padding:4px 12px 4px 0;color:#757575;">Pickup Time</td>
      <td style="font-weight:600;">${formatPickupTimeValue(order.pickupTimeSlot)}</td>
    </tr>
    <tr>
      <td style="padding:4px 12px 4px 0;color:#757575;">Pickup Location</td>
      <td style="font-weight:600;">The Peachy Bakery | Toronto, ON</td>
    </tr>`;
}

function renderCustomerReceiptHtml(order: OrderConfirmationPayload): string {
  return `
    <div style="font-family:sans-serif;font-size:14px;color:#1a1b1f;max-width:480px;">
      <h2 style="color:#ed767a;">The Peachy</h2>
      <p>Hi ${order.customerName.split(" ")[0]},</p>
      <p>Thank you for your order! We've received your payment and our team is getting started.</p>

      <p style="margin:16px 0 4px;color:#757575;">Order Number</p>
      <p style="margin:0;font-weight:600;">${order.orderNumber}</p>

      <div style="margin-top:16px;border:1px solid #e4dcd8;border-radius:12px;padding:16px;background:#fdf8f5;">
        <p style="margin:0 0 8px;font-weight:600;">Order Summary</p>
        <table style="width:100%;border-collapse:collapse;">
          ${renderItemRows(order)}
          ${renderTotalsRows(order)}
        </table>
      </div>

      <table style="width:100%;border-collapse:collapse;margin-top:16px;">${renderPickupRows(order)}</table>

      ${order.instructions ? `<p style="margin-top:16px;white-space:pre-wrap;"><strong>Special Instructions:</strong><br />${order.instructions}</p>` : ""}

      <hr style="margin:24px 0;border:none;border-top:1px solid #e4dcd8;" />

      <p style="margin:0;color:#757575;">
        Please bring this email (or your order number) with you at pickup.
      </p>
      <p style="margin:16px 0 0;color:#757575;">
        <strong style="color:#1a1b1f;">Hours</strong><br />
        Mon-Fri: 8:00am - 9:30pm<br />
        Sat: 11:00am - 9:30pm<br />
        Sun: 11:00am - 7:00pm
      </p>
      <p style="margin:16px 0 0;color:#757575;">
        <strong style="color:#1a1b1f;">Contact</strong><br />
        416-218-8828 &middot; info@thepeachy.ca
      </p>
    </div>
  `;
}

function renderBakeryNotificationHtml(order: OrderConfirmationPayload): string {
  return `
    <div style="font-family:sans-serif;font-size:14px;color:#1a1b1f;">
      <h2 style="color:#ed767a;">New paid order -- ${order.orderNumber}</h2>

      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:4px 12px 4px 0;color:#757575;">Name</td>
          <td>${order.customerName}</td>
        </tr>
        <tr>
          <td style="padding:4px 12px 4px 0;color:#757575;">Email</td>
          <td>${order.customerEmail}</td>
        </tr>
        ${order.customerPhone ? `<tr><td style="padding:4px 12px 4px 0;color:#757575;">Phone</td><td>${order.customerPhone}</td></tr>` : ""}
      </table>

      <hr style="margin:16px 0;border:none;border-top:1px solid #e4dcd8;" />

      <table style="width:100%;border-collapse:collapse;">${renderPickupRows(order)}</table>

      <hr style="margin:16px 0;border:none;border-top:1px solid #e4dcd8;" />

      <table style="width:100%;border-collapse:collapse;">
        ${renderItemRows(order)}
        ${renderTotalsRows(order)}
      </table>

      ${order.instructions ? `<p style="margin-top:16px;white-space:pre-wrap;"><strong>Special Instructions:</strong><br />${order.instructions}</p>` : ""}
    </div>
  `;
}

export async function POST(request: Request) {
  let body: { token?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body.token || typeof body.token !== "string") {
    return NextResponse.json({ error: "Missing order token." }, { status: 400 });
  }

  const order = decryptOrderConfirmation(body.token);
  if (!order) {
    return NextResponse.json({ error: "Invalid or expired order token." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const bakeryEmail = process.env.BAKERY_NOTIFICATION_EMAIL;
  if (!apiKey || !bakeryEmail) {
    console.error("Order confirmation requested but RESEND_API_KEY / BAKERY_NOTIFICATION_EMAIL is not configured.");
    return NextResponse.json({ error: "Email service is not configured." }, { status: 500 });
  }

  const resend = new Resend(apiKey);

  const [customerResult, bakeryResult] = await Promise.all([
    resend.emails.send({
      from: FROM_ADDRESS,
      to: order.customerEmail,
      replyTo: bakeryEmail,
      subject: `Order Confirmed: ${order.orderNumber} — The Peachy`,
      html: renderCustomerReceiptHtml(order),
    }),
    resend.emails.send({
      from: FROM_ADDRESS,
      to: bakeryEmail,
      replyTo: order.customerEmail,
      subject: `New Paid Order ${order.orderNumber}: ${order.customerName} — ${formatCurrency(order.totalCents)}`,
      html: renderBakeryNotificationHtml(order),
    }),
  ]);

  if (customerResult.error) {
    console.error("Resend failed to send customer order receipt:", {
      name: customerResult.error.name,
      message: customerResult.error.message,
    });
  }
  if (bakeryResult.error) {
    console.error("Resend failed to send bakery order notification:", {
      name: bakeryResult.error.name,
      message: bakeryResult.error.message,
    });
  }

  if (customerResult.error && bakeryResult.error) {
    return NextResponse.json({ error: "We couldn't send order confirmation emails." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
