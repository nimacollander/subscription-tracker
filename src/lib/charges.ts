// Every individual charge an active subscription will make in a date range.
// The calendar and the monthly forecast are both built on this.
import type { Subscription } from "@/types/subscription";
import { daysBetween } from "./dates";
import { advanceBillingDate } from "./renewals";

export type Charge = { date: string; subscription: Subscription };

/**
 * Charges on or after `from` and before `until`, by date and then name.
 *
 * Pass `today` to also include charges already made earlier in the range: they're
 * inferred by stepping back whole cycles from each next billing date, assuming the
 * subscription was active then. Only dates before today are inferred, since the
 * next billing date is by definition the next charge.
 */
export function getChargesBetween(
  subscriptions: Subscription[],
  from: string,
  until: string,
  today?: string,
): Charge[] {
  const charges: Charge[] = [];
  const inRange = (date: string) => daysBetween(from, date) >= 0 && daysBetween(date, until) > 0;

  for (const sub of subscriptions) {
    if (sub.status !== "active") continue;
    for (let periods = 0; ; periods++) {
      const date = advanceBillingDate(sub.nextBillingDate, sub.billingCycle, periods);
      if (daysBetween(date, until) <= 0) break;
      if (inRange(date)) charges.push({ date, subscription: sub });
    }
    if (!today) continue;
    for (let periods = -1; ; periods--) {
      const date = advanceBillingDate(sub.nextBillingDate, sub.billingCycle, periods);
      if (daysBetween(from, date) < 0) break;
      if (inRange(date) && daysBetween(date, today) > 0) charges.push({ date, subscription: sub });
    }
  }
  return charges.sort((a, b) => a.date.localeCompare(b.date) || a.subscription.name.localeCompare(b.subscription.name));
}

/** Groups charges by date for quick lookup. */
export function groupChargesByDate(charges: Charge[]): Map<string, Charge[]> {
  const byDate = new Map<string, Charge[]>();
  for (const charge of charges) {
    const list = byDate.get(charge.date);
    if (list) list.push(charge);
    else byDate.set(charge.date, [charge]);
  }
  return byDate;
}
