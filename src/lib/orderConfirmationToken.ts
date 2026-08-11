import crypto from "node:crypto";

/**
 * Carries paid-order details through the Clover hosted-checkout redirect so
 * /order-success can trigger confirmation emails without a database to look
 * the order back up in. AES-256-GCM gives both tamper-proofing and
 * confidentiality -- the payload includes customer PII (email, phone,
 * instructions) and this token rides in a public URL, so a signature alone
 * (which is readable, just unforgeable) isn't enough.
 */

export interface OrderConfirmationItem {
  name: string;
  quantity: number;
  priceCents: number;
}

export interface OrderConfirmationPayload {
  orderNumber: string;
  issuedAt: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  pickupDate: string;
  pickupTimeSlot: string;
  instructions?: string;
  items: OrderConfirmationItem[];
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
}

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const MAX_TOKEN_AGE_MS = 24 * 60 * 60 * 1000;

function getKey(): Buffer {
  const secret = process.env.ORDER_CONFIRMATION_SECRET;
  if (!secret) throw new Error("ORDER_CONFIRMATION_SECRET is not configured.");
  return crypto.createHash("sha256").update(secret).digest();
}

export function encryptOrderConfirmation(payload: OrderConfirmationPayload): string {
  const key = getKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(payload), "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString("base64url");
}

/** Returns null for a missing/malformed/tampered/expired token. */
export function decryptOrderConfirmation(token: string): OrderConfirmationPayload | null {
  try {
    const raw = Buffer.from(token, "base64url");
    const iv = raw.subarray(0, IV_LENGTH);
    const authTag = raw.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
    const encrypted = raw.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

    const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
    decipher.setAuthTag(authTag);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

    const payload = JSON.parse(decrypted.toString("utf8")) as OrderConfirmationPayload;
    if (typeof payload.issuedAt !== "number" || Date.now() - payload.issuedAt > MAX_TOKEN_AGE_MS) return null;
    return payload;
  } catch {
    return null;
  }
}
