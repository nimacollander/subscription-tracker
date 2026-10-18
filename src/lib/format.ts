import type { BillingCycle } from "@/types/subscription";
import { parseISODate } from "./dates";

// Until the currency setting exists, everything is shown in USD.
export const DEFAULT_CURRENCY = "USD";

export const CYCLE_LABELS: Record<BillingCycle, string> = {
  weekly: "Weekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
  yearly: "Yearly",
};

export const CYCLE_SUFFIXES: Record<BillingCycle, string> = {
  weekly: "/wk",
  monthly: "/mo",
  quarterly: "/qtr",
  yearly: "/yr",
};

/** `locale` is left undefined in the app so the browser's locale is used. */
export function formatCurrency(
  amount: number,
  currency: string = DEFAULT_CURRENCY,
  locale?: string,
): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount);
}

export function formatDate(isoDate: string, locale?: string): string {
  // The parsed date is UTC midnight, so format in UTC to avoid showing the previous day.
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(parseISODate(isoDate));
}

export function formatDueIn(days: number): string {
  if (days === 0) return "Due today";
  if (days === 1) return "Due tomorrow";
  return `Due in ${days} days`;
}
