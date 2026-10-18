import type { BillingCycle, Subscription } from "@/types/subscription";

// How many times each cycle bills per year. Weekly uses 52 rather than 52.18,
// which matches how people usually think about a weekly charge.
const CYCLES_PER_YEAR: Record<BillingCycle, number> = {
  weekly: 52,
  monthly: 12,
  quarterly: 4,
  yearly: 1,
};

export function toYearlyPrice(price: number, cycle: BillingCycle): number {
  return price * CYCLES_PER_YEAR[cycle];
}

export function toMonthlyPrice(price: number, cycle: BillingCycle): number {
  return toYearlyPrice(price, cycle) / 12;
}

export type SpendTotals = {
  monthly: number;
  yearly: number;
  activeCount: number;
};

/** Sums spend across active subscriptions; paused ones are ignored. Values are unrounded. */
export function calculateTotals(subscriptions: Subscription[]): SpendTotals {
  const active = subscriptions.filter((sub) => sub.status === "active");
  const yearly = active.reduce((sum, sub) => sum + toYearlyPrice(sub.price, sub.billingCycle), 0);

  return { monthly: yearly / 12, yearly, activeCount: active.length };
}
