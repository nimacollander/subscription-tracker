// Chart data derived from subscriptions. Paused subscriptions are excluded,
// and every amount is the monthly equivalent so cycles are comparable.
import type { Subscription } from "@/types/subscription";
import { toMonthlyPrice } from "./pricing";

export const OTHER_CATEGORY = "Other";

export type CategorySpend = {
  category: string;
  monthly: number;
  /** Fraction of total monthly spend, 0–1. */
  share: number;
};

export type SubscriptionCost = {
  id: string;
  name: string;
  monthly: number;
};

/**
 * Monthly spend per category, largest first. Beyond `maxSlices`, the smallest
 * categories fold into a single "Other" slice so the chart stays readable.
 */
export function getSpendByCategory(subscriptions: Subscription[], maxSlices = 6): CategorySpend[] {
  const totals = new Map<string, number>();
  for (const sub of subscriptions) {
    if (sub.status !== "active") continue;
    const monthly = toMonthlyPrice(sub.price, sub.billingCycle);
    totals.set(sub.category, (totals.get(sub.category) ?? 0) + monthly);
  }

  const sorted = [...totals]
    .map(([category, monthly]) => ({ category, monthly }))
    .sort((a, b) => b.monthly - a.monthly || a.category.localeCompare(b.category));

  let slices = sorted;
  if (sorted.length > maxSlices) {
    const kept = sorted.slice(0, maxSlices - 1);
    const folded = sorted.slice(maxSlices - 1);
    // A user category literally named "Other" merges into the folded slice.
    const keptWithoutOther = kept.filter((s) => s.category !== OTHER_CATEGORY);
    const otherTotal =
      folded.reduce((sum, s) => sum + s.monthly, 0) +
      kept.filter((s) => s.category === OTHER_CATEGORY).reduce((sum, s) => sum + s.monthly, 0);
    slices = [...keptWithoutOther, { category: OTHER_CATEGORY, monthly: otherTotal }];
  }

  const total = slices.reduce((sum, s) => sum + s.monthly, 0);
  return slices.map((s) => ({ ...s, share: total > 0 ? s.monthly / total : 0 }));
}

/** The most expensive active subscriptions by monthly cost. */
export function getTopSubscriptionsByCost(subscriptions: Subscription[], limit = 5): SubscriptionCost[] {
  return subscriptions
    .filter((sub) => sub.status === "active")
    .map((sub) => ({ id: sub.id, name: sub.name, monthly: toMonthlyPrice(sub.price, sub.billingCycle) }))
    .sort((a, b) => b.monthly - a.monthly || a.name.localeCompare(b.name))
    .slice(0, limit);
}
