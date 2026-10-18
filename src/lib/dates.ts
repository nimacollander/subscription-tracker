// Billing dates are calendar dates ("YYYY-MM-DD") with no time or timezone.
// All math is done in UTC so DST shifts and the local offset can't move a date.

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function parseISODate(value: string): Date {
  const match = ISO_DATE.exec(value);
  if (!match) throw new Error(`Invalid date: "${value}"`);

  const [year, month, day] = match.slice(1).map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  // Reject dates JS would silently roll over, like 2025-02-30.
  if (date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    throw new Error(`Invalid date: "${value}"`);
  }
  return date;
}

export function formatISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** The local calendar date of a Date, e.g. today's date in the user's timezone. */
export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(value: string, days: number): string {
  const date = parseISODate(value);
  date.setUTCDate(date.getUTCDate() + days);
  return formatISODate(date);
}

/** Adds months, clamping to the last day of the month (Jan 31 + 1 month = Feb 28/29). */
export function addMonths(value: string, months: number): string {
  const date = parseISODate(value);
  const day = date.getUTCDate();
  const target = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1));
  const daysInTarget = new Date(
    Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0),
  ).getUTCDate();
  target.setUTCDate(Math.min(day, daysInTarget));
  return formatISODate(target);
}

/** Whole calendar days from `from` to `to`; negative if `to` is earlier. */
export function daysBetween(from: string, to: string): number {
  return Math.round((parseISODate(to).getTime() - parseISODate(from).getTime()) / MS_PER_DAY);
}
