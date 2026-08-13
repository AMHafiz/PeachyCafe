import { NextResponse } from "next/server";
import { formatPickupTimeValue } from "@/lib/storeHours";
import { getProductById } from "@/data/products";
import { encryptOrderConfirmation } from "@/lib/orderConfirmationToken";

export interface CloverCheckoutItem {
  productId: string;
  sizeLabel: string;
  quantity: number;
}

export interface CloverCheckoutRequestBody {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  pickupDate: string;
  pickupTimeSlot: string;
  instructions?: string;
  items: CloverCheckoutItem[];
}

interface CloverLineItem {
  name: string;
  price: number;
  unitQty: number;
  note?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Ontario HST.
const TAX_RATE = 0.13;

function isValidItems(items: unknown): items is CloverCheckoutItem[] {
  return (
    Array.isArray(items) &&
    items.length > 0 &&
    items.every(
      (item) =>
        item &&
        typeof item.productId === "string" &&
        typeof item.sizeLabel === "string" &&
        typeof item.quantity === "number" &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0
    )
  );
}

function formatPickupDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(year, (month ?? 1) - 1, day ?? 1);
  return date.toLocaleDateString("en-CA", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

// Clover has no single "full name" field on the customer object.
function splitName(fullName: string): { firstName: string; lastName: string } {
  const trimmed = fullName.trim();
  const spaceIndex = trimmed.indexOf(" ");
  if (spaceIndex === -1) return { firstName: trimmed, lastName: "" };
  return { firstName: trimmed.slice(0, spaceIndex), lastName: trimmed.slice(spaceIndex + 1) };
}

export async function POST(request: Request) {
  let body: CloverCheckoutRequestBody;
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
  if (!body.pickupDate?.trim()) {
    return NextResponse.json({ error: "A pickup date is required." }, { status: 400 });
  }
  if (!body.pickupTimeSlot?.trim()) {
    return NextResponse.json({ error: "A pickup time slot is required." }, { status: 400 });
  }
  if (!isValidItems(body.items)) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  const merchantId = process.env.CLOVER_MERCHANT_ID;
  const privateKey = process.env.CLOVER_PRIVATE_KEY;
  if (!merchantId || !privateKey) {
    console.error("Clover checkout requested but CLOVER_MERCHANT_ID / CLOVER_PRIVATE_KEY is not configured.");
    return NextResponse.json({ error: "Ordering is not available yet. Please call us to place your order." }, { status: 500 });
  }

  // Re-derive every price from the product catalog -- never trust a price
  // (or even which items exist) from the client.
  const lineItems: CloverLineItem[] = [];
  for (const item of body.items) {
    const product = getProductById(item.productId);
    if (!product) {
      return NextResponse.json({ error: "One of the items in your cart is no longer available." }, { status: 400 });
    }
    const size = product.sizes.find((s) => s.label === item.sizeLabel);
    if (!size || size.price === null || product.isSoldOut) {
      return NextResponse.json({ error: `${product.name} (${item.sizeLabel}) is currently unavailable.` }, { status: 400 });
    }

    lineItems.push({
      name: `${product.name} (${size.label})`,
      // Clover line item prices are integer cents.
      price: Math.round(size.price * 100),
      unitQty: item.quantity,
    });
  }

  const noteLines = [
    `Pickup: ${formatPickupDate(body.pickupDate)}, ${formatPickupTimeValue(body.pickupTimeSlot)}`,
    body.instructions?.trim() ? `Instructions: ${body.instructions.trim()}` : null,
  ].filter((line): line is string => !!line);
  // Clover's checkout schema has no order-level note, so it rides along on
  // the first line item instead.
  if (lineItems[0]) {
    lineItems[0].note = noteLines.join(" | ");
  }

  // Subtotal from the re-derived catalog prices, never from the client.
  const subtotalCents = lineItems.reduce((sum, item) => sum + item.price * item.unitQty, 0);
  const taxCents = Math.round(subtotalCents * TAX_RATE);
  const totalAmountCents = subtotalCents + taxCents;

  // Snapshot the product lines for the confirmation-email receipt before the
  // synthetic HST line below joins the array Clover sees.
  const receiptItems = lineItems.map((item) => ({ name: item.name, quantity: item.unitQty, priceCents: item.price }));

  lineItems.push({ name: "HST (13%)", price: taxCents, unitQty: 1 });

  const orderNumber = `PC-${Date.now().toString(36).toUpperCase()}`;
  const confirmationToken = encryptOrderConfirmation({
    orderNumber,
    issuedAt: Date.now(),
    customerName: body.customerName,
    customerEmail: body.customerEmail,
    customerPhone: body.customerPhone,
    pickupDate: body.pickupDate,
    pickupTimeSlot: body.pickupTimeSlot,
    instructions: body.instructions,
    items: receiptItems,
    subtotalCents,
    taxCents,
    totalCents: totalAmountCents,
  });

  const { firstName, lastName } = splitName(body.customerName);
  // The Hosted Checkout API (/invoicingcheckoutservice/...) lives on Clover's
  // "scl" host, which is distinct from the general REST API host
  // (apisandbox.dev.clover.com / api.clover.com). Using the wrong host here
  // returns a 401 or a 502 from Clover's gateway instead of a clear error.
 const apiHost =
  process.env.CLOVER_ENVIRONMENT === "production"
    ? "https://api.clover.com"
    : "https://apisandbox.dev.clover.com";  // Prefer an explicit configured origin, then the browser's Origin header,
  // then fall back to the incoming request's own origin -- works locally
  // (http://localhost:3000) and on Vercel without any extra config.
  const origin =
    process.env.NEXT_PUBLIC_BASE_URL || request.headers.get("origin") || new URL(request.url).origin;

  // Clover rejects the whole request (400) if redirectUrls is present but
  // not https -- e.g. plain http://localhost in local dev. Omit it there so
  // checkout still works locally; the customer just lands on Clover's
  // generic confirmation screen instead of bouncing back to the site.
  const redirectUrls = origin.startsWith("https://")
  ? {
      success: `${origin}/order-success?order=${confirmationToken}`,
      failure: `${origin}/checkout`,
    }
  : undefined;

try {
  console.log("CLOVER DEBUG:", {
    environment: process.env.CLOVER_ENVIRONMENT,
    merchant: process.env.CLOVER_MERCHANT_ID,
    keyStart: process.env.CLOVER_PRIVATE_KEY?.slice(0, 2),
    keyLength: process.env.CLOVER_PRIVATE_KEY?.length,
    keyExists: Boolean(process.env.CLOVER_PRIVATE_KEY),
  });

  // keep the rest of your existing code...

const cloverRes = await fetch(`${apiHost}/invoicingcheckoutservice/v1/checkouts`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": "PeachyCafe/1.0",
        "X-Clover-Merchant-Id": merchantId,
        Authorization: `Bearer ${privateKey}`,
      },
      body: JSON.stringify({
        customer: {
          firstName,
          lastName,
          email: body.customerEmail,
          ...(body.customerPhone?.trim() ? { phoneNumber: body.customerPhone.trim() } : {}),
        },
        shoppingCart: { lineItems },
        amount: totalAmountCents,
        tax_amount: taxCents,
        ...(redirectUrls ? { redirectUrls } : {}),
      }),
    });

    // Read as text first -- a non-2xx response (e.g. a gateway-level 401/502)
    // is often HTML or plain text, not JSON, and .json() would otherwise
    // swallow the actual error body.
    const rawBody = await cloverRes.text();
    let data: { href?: string } | null = null;
    try {
      data = rawBody ? JSON.parse(rawBody) : null;
    } catch {
      data = null;
    }

    if (!cloverRes.ok || !data?.href) {
      console.error(
        `Clover checkout session creation failed [${cloverRes.status} ${cloverRes.statusText}] ` +
          `POST ${apiHost}/invoicingcheckoutservice/v1/checkouts -- raw response:`,
        rawBody
      );
      return NextResponse.json({ error: "We couldn't start checkout. Please try again shortly." }, { status: 502 });
    }

    return NextResponse.json({ url: data.href as string });
  } catch (error) {
    console.error("Clover checkout request failed:", error);
    return NextResponse.json({ error: "We couldn't start checkout. Please try again shortly." }, { status: 502 });
  }
}
