import type { BillingCycle, Subscription } from "@/types/subscription";
import { addDays, addMonths, daysBetween } from "./dates";

const MONTHS_PER_CYCLE: Record<Exclude<BillingCycle, "weekly">, number> = {
  monthly: 1,
  quarterly: 3,
  yearly: 12,
};

/**
 * The date `periods` billing cycles after `anchor`. Always count from the
 * original anchor so month-end dates don't drift (Jan 31 → Feb 28 → Mar 31).
 */
export function advanceBillingDate(anchor: string, cycle: BillingCycle, periods: number): string {
  if (cycle === "weekly") return addDays(anchor, periods * 7);
  return addMonths(anchor, periods * MONTHS_PER_CYCLE[cycle]);
}

/**
 * Returns the first billing date on or after `today`, rolling a past date
 * forward one cycle at a time. Each step is counted from the original date,
 * so a bill on the 31st goes Jan 31 → Feb 28 → Mar 31 and doesn't drift to the 28th.
 */
export function getNextRenewalDate(
  billingDate: string,
  cycle: BillingCycle,
  today: string,
): string {
  if (daysBetween(today, billingDate) >= 0) return billingDate;

  // Jump close to today in one step, then walk forward, so very old dates don't loop for long.
  const daysPerCycle = cycle === "weekly" ? 7 : MONTHS_PER_CYCLE[cycle] * 31;
  let periods = Math.max(1, Math.floor(daysBetween(billingDate, today) / daysPerCycle));
  let next = advanceBillingDate(billingDate, cycle, periods);
  while (daysBetween(today, next) < 0) {
    periods += 1;
    next = advanceBillingDate(billingDate, cycle, periods);
  }
  return next;
}

/** Days from `today` until the next renewal; 0 means it renews today. */
export function daysUntilRenewal(
  billingDate: string,
  cycle: BillingCycle,
  today: string,
): number {
  return daysBetween(today, getNextRenewalDate(billingDate, cycle, today));
}

/** Renewals this many days away or fewer are highlighted. */
export const DUE_SOON_DAYS = 7;

export function isDueSoon(days: number): boolean {
  return days <= DUE_SOON_DAYS;
}

export type UpcomingRenewal = {
  subscription: Subscription;
  date: string;
  daysUntil: number;
};

/**
 * Active subscriptions renewing within `withinDays` of `today` (inclusive),
 * soonest first and then by name. Paused subscriptions never renew.
 */
export function getUpcomingRenewals(
  subscriptions: Subscription[],
  today: string,
  withinDays = Infinity,
): UpcomingRenewal[] {
  return subscriptions
    .filter((sub) => sub.status === "active")
    .map((sub) => {
      const date = getNextRenewalDate(sub.nextBillingDate, sub.billingCycle, today);
      return { subscription: sub, date, daysUntil: daysBetween(today, date) };
    })
    .filter((renewal) => renewal.daysUntil <= withinDays)
    .sort(
      (a, b) =>
        a.daysUntil - b.daysUntil || a.subscription.name.localeCompare(b.subscription.name),
    );
}
