// Every individual charge an active subscription will make in a date range.
// The calendar and the monthly forecast are both built on this.
import type { Subscription } from "@/types/subscription";
import { daysBetween } from "./dates";
import { advanceBillingDate } from "./renewals";

export type Charge = { date: string; subscription: Subscription };

/** Charges on or after `from` and before `until`, by date and then name. */
export function getChargesBetween(subscriptions: Subscription[], from: string, until: string): Charge[] {
  const charges: Charge[] = [];
  for (const sub of subscriptions) {
    if (sub.status !== "active") continue;
    for (let periods = 0; ; periods++) {
      const date = advanceBillingDate(sub.nextBillingDate, sub.billingCycle, periods);
      if (daysBetween(date, until) <= 0) break;
      if (daysBetween(from, date) >= 0) charges.push({ date, subscription: sub });
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
