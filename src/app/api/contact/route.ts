import { NextResponse } from "next/server";
import { Resend } from "resend";

export interface ContactRequestBody {
  firstName: string;
  lastName: string;
  email: string;
  mobile?: string;
  pickupDate?: string;
  pickupTime?: string;
  pickupLocation?: string;
  inquiryType?: string;
  message?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Resend's shared testing sender -- swap for a verified sending domain
// (e.g. orders@thepeachy.ca) once one is configured in the Resend dashboard.
const FROM_ADDRESS = "The Peachy Website <onboarding@resend.dev>";

/** "custom-cake" -> "Custom Cake". Inquiry type / pickup location are submitted as slugs. */
function humanize(value: string | undefined): string {
  if (!value) return "";
  return value.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function renderStoreNotificationHtml(body: ContactRequestBody): string {
  const rows: [string, string | undefined][] = [
    ["First Name", body.firstName],
    ["Last Name", body.lastName],
    ["Phone Number", body.mobile],
    ["Email", body.email],
    ["Pickup Date", body.pickupDate],
    ["Pickup Time", body.pickupTime],
    ["Pickup Location", humanize(body.pickupLocation)],
    ["Inquiry Type", humanize(body.inquiryType)],
  ];

  const rowsHtml = rows
    .filter(([, value]) => !!value)
    .map(([label, value]) => `<tr><td style="padding:4px 12px 4px 0;color:#757575;">${label}</td><td>${value}</td></tr>`)
    .join("");

  return `
    <div style="font-family:sans-serif;font-size:14px;color:#1a1b1f;">
      <h2 style="color:#ed767a;">New inquiry from thepeachy.ca</h2>
      <table>${rowsHtml}</table>
      ${body.message ? `<p style="margin-top:16px;white-space:pre-wrap;"><strong>Customer Message:</strong><br />${body.message}</p>` : ""}
    </div>
  `;
}

function renderCustomerConfirmationHtml(body: ContactRequestBody): string {
  const summaryRows: [string, string | undefined][] = [
    ["Inquiry Type", humanize(body.inquiryType)],
    ["Pickup Date", body.pickupDate],
    ["Pickup Time", body.pickupTime],
    ["Pickup Location", humanize(body.pickupLocation)],
  ];

  const summaryRowsHtml = summaryRows
    .filter(([, value]) => !!value)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#757575;">${label}</td><td style="font-weight:600;">${value}</td></tr>`
    )
    .join("");

  return `
    <div style="font-family:sans-serif;font-size:14px;color:#1a1b1f;max-width:480px;">
      <h2 style="color:#ed767a;">The Peachy</h2>
      <p>Hi ${body.firstName},</p>
      <p>Thank you for reaching out to The Peachy! We have received your inquiry and our team will review it shortly.</p>

      <div style="margin-top:16px;border:1px solid #e4dcd8;border-radius:12px;padding:16px;background:#fdf8f5;">
        <p style="margin:0 0 8px;font-weight:600;">Your Inquiry Summary</p>
        <table style="width:100%;border-collapse:collapse;">${summaryRowsHtml}</table>
      </div>

      <hr style="margin:24px 0;border:none;border-top:1px solid #e4dcd8;" />

      <p style="margin:0;color:#757575;">
        <strong style="color:#1a1b1f;">Hours</strong><br />
        Mon-Fri: 8:00am - 9:30pm<br />
        Sat: 11:00am - 9:30pm<br />
        Sun: 11:00am - 7:00pm
      </p>
      <p style="margin:16px 0 0;color:#757575;">
        <strong style="color:#1a1b1f;">Locations</strong><br />
        14B - 5650 Yonge St, North York (Main)<br />
        618 Yonge St, Toronto
      </p>
      <p style="margin:16px 0 0;color:#757575;">
        <strong style="color:#1a1b1f;">Contact</strong><br />
        416-218-8828 &middot; info@thepeachy.ca
      </p>
    </div>
  `;
}

export async function POST(request: Request) {
  let body: ContactRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body.firstName?.trim() || !body.lastName?.trim()) {
    return NextResponse.json({ error: "First and last name are required." }, { status: 400 });
  }
  if (!body.email?.trim() || !EMAIL_PATTERN.test(body.email)) {
    return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const notificationEmail = process.env.STORE_NOTIFICATION_EMAIL;
  if (!apiKey || !notificationEmail) {
    console.error("Contact form submitted but RESEND_API_KEY / STORE_NOTIFICATION_EMAIL is not configured.");
    return NextResponse.json({ error: "Email service is not configured yet. Please call or email us directly." }, { status: 500 });
  }

  const resend = new Resend(apiKey);

  const inquiryTypeLabel = humanize(body.inquiryType) || "Inquiry";

  const [notificationResult, confirmationResult] = await Promise.all([
    resend.emails.send({
      from: FROM_ADDRESS,
      to: notificationEmail,
      replyTo: body.email,
      subject: `New Inquiry Received: ${body.firstName} ${body.lastName} - ${inquiryTypeLabel}`,
      html: renderStoreNotificationHtml(body),
    }),
    resend.emails.send({
      from: FROM_ADDRESS,
      to: body.email,
      replyTo: notificationEmail,
      subject: "We received your inquiry! — The Peachy",
      html: renderCustomerConfirmationHtml(body),
    }),
  ]);

  if (notificationResult.error) {
    console.error("Resend failed to send store notification email:", {
      name: notificationResult.error.name,
      message: notificationResult.error.message,
    });
    return NextResponse.json({ error: "We couldn't send your message. Please try again shortly." }, { status: 502 });
  }

  if (confirmationResult.error) {
    // The store was notified either way; a failed customer confirmation shouldn't block submission.
    console.error("Resend failed to send customer confirmation email:", {
      name: confirmationResult.error.name,
      message: confirmationResult.error.message,
    });
  }

  return NextResponse.json({ ok: true });
}
