/**
 * Delivery-date estimates.
 *
 * USPS counts transit in business days, so a label printed on Friday for a
 * 2-day service lands Tuesday, not Sunday. This module owns that arithmetic —
 * weekend skipping, the ten USPS holidays — and the published transit windows
 * for each product, so the admin receipt, shipment history and the customer
 * tracking page all quote the same date.
 */

export interface TransitWindow {
  /** Fastest published transit, in business days. */
  min: number;
  /** Slowest published transit, in business days. */
  max: number;
  /** Human-readable window, e.g. "2–5 business days". */
  label: string;
}

/**
 * Matched in order — "Priority Mail Express®" must be tested before
 * "Priority Mail®", and both before any generic mail-class rule.
 */
const WINDOWS: { test: RegExp; window: TransitWindow }[] = [
  { test: /Priority Mail Express/i, window: { min: 1, max: 2, label: "1–2 business days" } },
  { test: /Priority Mail International/i, window: { min: 6, max: 10, label: "6–10 business days" } },
  { test: /Priority Mail/i, window: { min: 1, max: 3, label: "1–3 business days" } },
  { test: /Ground Advantage/i, window: { min: 2, max: 5, label: "2–5 business days" } },
  { test: /First-Class/i, window: { min: 1, max: 5, label: "1–5 business days" } },
  { test: /Media Mail/i, window: { min: 2, max: 8, label: "2–8 business days" } },
];

const DEFAULT_WINDOW: TransitWindow = { min: 1, max: 5, label: "1–5 business days" };

export function transitWindow(service: string): TransitWindow {
  return WINDOWS.find((w) => w.test.test(service))?.window ?? DEFAULT_WINDOW;
}

/**
 * Days USPS does not deliver, as YYYY-MM-DD. Covers the published holiday
 * schedule through 2027 so estimates don't promise a Christmas Day delivery.
 */
const HOLIDAYS = new Set<string>([
  // 2025
  "2025-01-01", "2025-01-20", "2025-02-17", "2025-05-26", "2025-06-19",
  "2025-07-04", "2025-09-01", "2025-10-13", "2025-11-11", "2025-11-27", "2025-12-25",
  // 2026
  "2026-01-01", "2026-01-19", "2026-02-16", "2026-05-25", "2026-06-19",
  "2026-07-03", "2026-09-07", "2026-10-12", "2026-11-11", "2026-11-26", "2026-12-25",
  // 2027
  "2027-01-01", "2027-01-18", "2027-02-15", "2027-05-31", "2027-06-18",
  "2027-07-05", "2027-09-06", "2027-10-11", "2027-11-11", "2027-11-25", "2027-12-24",
]);

const isoDay = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const isBusinessDay = (d: Date) => d.getDay() !== 0 && d.getDay() !== 6 && !HOLIDAYS.has(isoDay(d));

/**
 * Adds N business days to a date, then lands on the next business day if the
 * result falls on a Sunday, Saturday or holiday.
 */
export function addBusinessDays(from: Date, days: number): Date {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate(), 12, 0, 0, 0);
  // Start counting from the next business day — a label printed today can't
  // be delivered today.
  let remaining = Math.max(1, days);
  let guard = 0;
  while (remaining > 0 && guard < 400) {
    d.setDate(d.getDate() + 1);
    if (isBusinessDay(d)) remaining -= 1;
    guard += 1;
  }
  return d;
}

/**
 * The date to show a customer. Uses the slow end of the published window so
 * the promise is one we can keep.
 */
export function expectedDelivery(service: string, startMs: number = Date.now()): number {
  const window = transitWindow(service);
  return addBusinessDays(new Date(startMs), window.max).getTime();
}

/** "Tue, Oct 27" — the format USPS uses on tracking. */
export function formatEta(ms: number): string {
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

/** "Tuesday, October 27, 2026" — for the printable label. */
export function formatEtaLong(ms: number): string {
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

/** True when the promised date has already passed without a delivery scan. */
export function isOverdue(etaMs: number | null | undefined, now: number = Date.now()): boolean {
  if (!etaMs) return false;
  const end = new Date(etaMs);
  end.setHours(23, 59, 59, 999);
  return now > end.getTime();
}
