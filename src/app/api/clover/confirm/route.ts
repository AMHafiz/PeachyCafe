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

function sectionLabel(text: string): string {
  return `<p style="margin:16px 0 6px;font-weight:700;text-transform:uppercase;font-size:11px;letter-spacing:0.05em;color:#757575;">${text}</p>`;
}

function renderBakeryItemRows(order: OrderConfirmationPayload): string {
  const headerRow = `
    <tr style="color:#757575;font-size:12px;">
      <td style="padding:0 8px 6px 0;text-align:left;">Item</td>
      <td style="padding:0 8px 6px;text-align:right;">Unit Price</td>
      <td style="padding:0 8px 6px;text-align:center;">Qty</td>
      <td style="padding:0 0 6px;text-align:right;">Subtotal</td>
    </tr>`;

  const rows = order.items
    .map(
      (item) => `
        <tr style="border-top:1px solid #e4dcd8;">
          <td style="padding:6px 8px 6px 0;">${item.name}</td>
          <td style="padding:6px 8px;text-align:right;color:#757575;">${formatCurrency(item.priceCents)}</td>
          <td style="padding:6px 8px;text-align:center;color:#757575;">&times;${item.quantity}</td>
          <td style="padding:6px 0;text-align:right;font-weight:600;">${formatCurrency(item.priceCents * item.quantity)}</td>
        </tr>`
    )
    .join("");

  return `${headerRow}${rows}`;
}

function renderBakeryNotificationHtml(order: OrderConfirmationPayload): string {
  return `
    <div style="font-family:'Courier New',Courier,monospace;font-size:14px;color:#1a1b1f;max-width:520px;">
      <div style="background:#1a1b1f;color:#fff;padding:14px 18px;border-radius:10px 10px 0 0;">
        <p style="margin:0;font-size:17px;font-weight:700;">🚨 New Online Order Received!</p>
        <p style="margin:4px 0 0;font-size:13px;color:#f3c9c9;">Order #${order.orderNumber}</p>
      </div>

      <div style="border:2px solid #1a1b1f;border-top:none;border-radius:0 0 10px 10px;padding:16px 18px;">
        ${sectionLabel("Customer Details")}
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:2px 12px 2px 0;color:#757575;">Full Name</td>
            <td style="font-weight:600;">${order.customerName}</td>
          </tr>
          <tr>
            <td style="padding:2px 12px 2px 0;color:#757575;">Phone Number</td>
            <td style="font-weight:600;">${order.customerPhone || "--"}</td>
          </tr>
          <tr>
            <td style="padding:2px 12px 2px 0;color:#757575;">Email</td>
            <td style="font-weight:600;">${order.customerEmail}</td>
          </tr>
        </table>

        ${sectionLabel("Fulfillment Info")}
        <table style="width:100%;border-collapse:collapse;">${renderPickupRows(order)}</table>

        ${sectionLabel("Special Instructions")}
        <div style="border:1px dashed #ed767a;border-radius:8px;padding:10px 12px;white-space:pre-wrap;">
          ${order.instructions?.trim() || "None"}
        </div>

        ${sectionLabel("Itemized Order")}
        <table style="width:100%;border-collapse:collapse;">${renderBakeryItemRows(order)}</table>

        ${sectionLabel("Financial Summary")}
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:2px 12px 2px 0;color:#757575;">Subtotal</td>
            <td style="text-align:right;">${formatCurrency(order.subtotalCents)}</td>
          </tr>
          <tr>
            <td style="padding:2px 12px 2px 0;color:#757575;">Tax (13% HST)</td>
            <td style="text-align:right;">${formatCurrency(order.taxCents)}</td>
          </tr>
          <tr style="border-top:1px solid #1a1b1f;">
            <td style="padding:8px 12px 0 0;font-size:16px;font-weight:700;">Grand Total</td>
            <td style="padding:8px 0 0;text-align:right;font-size:16px;font-weight:700;">${formatCurrency(order.totalCents)}</td>
          </tr>
        </table>
      </div>
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

  // Pickup info the client needs to render its confirmation copy -- included on every
  // response from here on, since it only depends on the token, not on email delivery.
  const pickupFields = { pickupDate: order.pickupDate, pickupTimeSlot: order.pickupTimeSlot };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Order confirmation requested but RESEND_API_KEY is not configured.");
    return NextResponse.json({ error: "Email service is not configured.", ...pickupFields }, { status: 500 });
  }

  const storeEmail = process.env.STORE_NOTIFICATION_EMAIL;
  if (!storeEmail) {
    // Non-fatal -- the customer still needs their receipt even if the bakery
    // alert can't be sent. Falls back to just logging so the order isn't lost silently.
    console.error("STORE_NOTIFICATION_EMAIL is not configured -- skipping bakery order alert for", order.orderNumber);
  }

  const resend = new Resend(apiKey);

  const [customerResult, bakeryResult] = await Promise.all([
    resend.emails.send({
      from: FROM_ADDRESS,
      to: order.customerEmail,
      ...(storeEmail ? { replyTo: storeEmail } : {}),
      subject: `Order Confirmed: ${order.orderNumber} — The Peachy`,
      html: renderCustomerReceiptHtml(order),
    }),
    storeEmail
      ? resend.emails.send({
          from: FROM_ADDRESS,
          to: storeEmail,
          replyTo: order.customerEmail,
          subject: `🚨 New Online Order Received! - Order #${order.orderNumber}`,
          html: renderBakeryNotificationHtml(order),
        })
      : Promise.resolve(null),
  ]);

  if (customerResult.error) {
    console.error("Resend failed to send customer order receipt:", {
      name: customerResult.error.name,
      message: customerResult.error.message,
    });
  }
  if (bakeryResult?.error) {
    console.error("Resend failed to send bakery order notification:", {
      name: bakeryResult.error.name,
      message: bakeryResult.error.message,
    });
  }

  if (customerResult.error) {
    return NextResponse.json({ error: "We couldn't send your order confirmation email.", ...pickupFields }, { status: 502 });
  }

  return NextResponse.json({ ok: true, ...pickupFields });
}
