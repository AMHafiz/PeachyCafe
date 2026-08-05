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

function renderEmailHtml(body: ContactRequestBody): string {
  const rows: [string, string | undefined][] = [
    ["Name", `${body.firstName} ${body.lastName}`],
    ["Email", body.email],
    ["Mobile", body.mobile],
    ["Inquiry Type", body.inquiryType],
    ["Pickup Location", body.pickupLocation],
    ["Pickup Date", body.pickupDate],
    ["Pickup Time", body.pickupTime],
  ];

  const rowsHtml = rows
    .filter(([, value]) => !!value)
    .map(([label, value]) => `<tr><td style="padding:4px 12px 4px 0;color:#757575;">${label}</td><td>${value}</td></tr>`)
    .join("");

  return `
    <div style="font-family:sans-serif;font-size:14px;color:#1a1b1f;">
      <h2 style="color:#ed767a;">New inquiry from thepeachy.ca</h2>
      <table>${rowsHtml}</table>
      ${body.message ? `<p style="margin-top:16px;white-space:pre-wrap;"><strong>Message:</strong><br />${body.message}</p>` : ""}
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

  const { error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: notificationEmail,
    replyTo: body.email,
    subject: `New ${body.inquiryType ? body.inquiryType.replace(/-/g, " ") : "contact"} inquiry from ${body.firstName} ${body.lastName}`,
    html: renderEmailHtml(body),
  });

  if (error) {
    console.error("Resend failed to send contact email:", error);
    return NextResponse.json({ error: "We couldn't send your message. Please try again shortly." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
