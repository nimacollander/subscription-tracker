import { addDays, addMonths, parseISODate } from "./dates";

export type CalendarDay = { date: string; inMonth: boolean };

/**
 * The days to show for a month, as whole weeks starting on Monday: the month
 * itself plus the trailing and leading days that complete its first and last weeks.
 */
export function buildMonthGrid(monthKey: string): CalendarDay[] {
  const first = `${monthKey}-01`;
  const next = addMonths(first, 1);
  // getUTCDay: Sunday 0 … Saturday 6. Shift so Monday is 0.
  const leading = (parseISODate(first).getUTCDay() + 6) % 7;
  const start = addDays(first, -leading);

  const days: CalendarDay[] = [];
  for (let date = start; ; date = addDays(date, 1)) {
    const isMonday = (parseISODate(date).getUTCDay() + 6) % 7 === 0;
    if (date >= next && isMonday) break;
    days.push({ date, inMonth: date >= first && date < next });
  }
  return days;
}

export const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** "2026-10" → "2026-11" (or back with -1). */
export function shiftMonth(monthKey: string, months: number): string {
  return addMonths(`${monthKey}-01`, months).slice(0, 7);
}

/** Whole months from one month key to another, e.g. "2026-10" → "2027-01" is 3. */
export function monthsBetween(from: string, to: string): number {
  const index = (key: string) => Number(key.slice(0, 4)) * 12 + Number(key.slice(5, 7));
  return index(to) - index(from);
}
