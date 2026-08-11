/**
 * Store hours and pickup time-slot generation, shared by every pickup-date/time
 * picker (the contact/inquiry form and the checkout pickup-request form). Slots
 * are generated in 30-minute intervals within the open/close window for the
 * selected date's weekday, with today's already-passed slots filtered out.
 */

export interface StoreHoursRange {
  openMinutes: number; // minutes since midnight
  closeMinutes: number;
}

export interface TimeSlot {
  /** 24h "HH:MM", the value stored/submitted. */
  value: string;
  /** e.g. "8:00 AM", for display. */
  label: string;
}

const SLOT_INTERVAL_MINUTES = 30;

// Keyed by Date#getDay() (0 = Sunday ... 6 = Saturday). `null` means closed.
const STORE_HOURS: Record<number, StoreHoursRange | null> = {
  0: { openMinutes: 11 * 60, closeMinutes: 19 * 60 }, // Sunday: 11:00 AM - 7:00 PM
  1: { openMinutes: 8 * 60, closeMinutes: 21 * 60 + 30 }, // Monday: 8:00 AM - 9:30 PM
  2: { openMinutes: 8 * 60, closeMinutes: 21 * 60 + 30 }, // Tuesday
  3: { openMinutes: 8 * 60, closeMinutes: 21 * 60 + 30 }, // Wednesday
  4: { openMinutes: 8 * 60, closeMinutes: 21 * 60 + 30 }, // Thursday
  5: { openMinutes: 8 * 60, closeMinutes: 21 * 60 + 30 }, // Friday
  6: { openMinutes: 11 * 60, closeMinutes: 21 * 60 + 30 }, // Saturday: 11:00 AM - 9:30 PM
};

/** Parses a "YYYY-MM-DD" date-input value as a local date (avoids UTC-shift bugs). */
function parseIsoDateLocal(isoDate: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) return null;
  const [, year, month, day] = match;
  return new Date(Number(year), Number(month) - 1, Number(day));
}

export function getStoreHoursForDate(isoDate: string): StoreHoursRange | null {
  const date = parseIsoDateLocal(isoDate);
  if (!date) return null;
  return STORE_HOURS[date.getDay()] ?? null;
}

export function isSameLocalDate(isoDate: string, reference: Date): boolean {
  const date = parseIsoDateLocal(isoDate);
  if (!date) return false;
  return (
    date.getFullYear() === reference.getFullYear() &&
    date.getMonth() === reference.getMonth() &&
    date.getDate() === reference.getDate()
  );
}

function formatMinutesAsValue(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

function formatMinutesAsLabel(minutes: number): string {
  const hours24 = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  return `${hours12}:${String(mins).padStart(2, "0")} ${period}`;
}

/** Formats a slot's 24h "HH:MM" value (e.g. from a submitted form) as "2:00 PM". */
export function formatPickupTimeValue(value: string): string {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value);
  if (!match) return value;
  const [, hours, minutes] = match;
  return formatMinutesAsLabel(Number(hours) * 60 + Number(minutes));
}

/** "YYYY-MM-DD" -> "August 15, 2026". Returns null for missing/invalid input. */
export function formatPickupDateLabel(isoDate?: string | null): string | null {
  if (!isoDate) return null;
  const date = parseIsoDateLocal(isoDate);
  if (!date) return null;
  return date.toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });
}

/**
 * Combines a pickup date and time-slot value into "August 15, 2026 at 3:30 PM".
 * Falls back to whichever half is available, and to null when neither is.
 */
export function formatPickupDateTime(pickupDate?: string | null, pickupTimeSlot?: string | null): string | null {
  const datePart = formatPickupDateLabel(pickupDate);
  const timePart = pickupTimeSlot ? formatPickupTimeValue(pickupTimeSlot) : null;
  if (datePart && timePart) return `${datePart} at ${timePart}`;
  return datePart ?? timePart ?? null;
}

/**
 * Generates the pickup time slots available for `isoDate`. When `isoDate` is
 * today, slots at or before the current time are excluded -- e.g. at 2:00 PM
 * the earliest slot returned is 2:30 PM. Returns an empty array when the date
 * is outside operating hours (closed) or every slot for today has passed.
 */
export function generateTimeSlots(isoDate: string, now: Date = new Date()): TimeSlot[] {
  const hours = getStoreHoursForDate(isoDate);
  if (!hours) return [];

  const isToday = isSameLocalDate(isoDate, now);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const slots: TimeSlot[] = [];
  for (let minutes = hours.openMinutes; minutes < hours.closeMinutes; minutes += SLOT_INTERVAL_MINUTES) {
    if (isToday && minutes <= nowMinutes) continue;
    slots.push({ value: formatMinutesAsValue(minutes), label: formatMinutesAsLabel(minutes) });
  }
  return slots;
}
