// Search, filter, and sort for the subscription list.
import type { Subscription, SubscriptionStatus } from "@/types/subscription";
import { toMonthlyPrice } from "./pricing";
import { getNextRenewalDate } from "./renewals";

export const SORT_OPTIONS = {
  "next-billing": "Next billing date",
  "price-desc": "Price: high to low",
  "price-asc": "Price: low to high",
  "name-asc": "Name: A to Z",
  "name-desc": "Name: Z to A",
} as const;

export type SortOption = keyof typeof SORT_OPTIONS;

export type SubscriptionQuery = {
  search: string;
  /** A category name, or "all". */
  category: string;
  status: SubscriptionStatus | "all";
  sort: SortOption;
};

export const DEFAULT_QUERY: SubscriptionQuery = {
  search: "",
  category: "all",
  status: "all",
  sort: "next-billing",
};

export function isFiltered(query: SubscriptionQuery): boolean {
  return query.search.trim() !== "" || query.category !== "all" || query.status !== "all";
}

/** Distinct categories, alphabetical, for the category filter. */
export function getCategories(subscriptions: Subscription[]): string[] {
  return [...new Set(subscriptions.map((s) => s.category))].sort((a, b) => a.localeCompare(b));
}

const byName = (a: Subscription, b: Subscription) =>
  a.name.localeCompare(b.name, undefined, { sensitivity: "base" });

function compare(sort: SortOption, today: string): (a: Subscription, b: Subscription) => number {
  switch (sort) {
    // Price compares monthly equivalents, so a $100/yr plan ranks below $10/mo.
    case "price-desc":
      return (a, b) =>
        toMonthlyPrice(b.price, b.billingCycle) - toMonthlyPrice(a.price, a.billingCycle) || byName(a, b);
    case "price-asc":
      return (a, b) =>
        toMonthlyPrice(a.price, a.billingCycle) - toMonthlyPrice(b.price, b.billingCycle) || byName(a, b);
    case "name-asc":
      return byName;
    case "name-desc":
      return (a, b) => byName(b, a);
    case "next-billing":
      // Paused subscriptions don't renew, so they go last. ISO dates sort as strings.
      return (a, b) => {
        if (a.status !== b.status) return a.status === "paused" ? 1 : -1;
        const dateA = getNextRenewalDate(a.nextBillingDate, a.billingCycle, today);
        const dateB = getNextRenewalDate(b.nextBillingDate, b.billingCycle, today);
        return dateA.localeCompare(dateB) || byName(a, b);
      };
  }
}

export function applyQuery(
  subscriptions: Subscription[],
  query: SubscriptionQuery,
  today: string,
): Subscription[] {
  const search = query.search.trim().toLowerCase();

  return subscriptions
    .filter(
      (sub) =>
        (search === "" || sub.name.toLowerCase().includes(search)) &&
        (query.category === "all" || sub.category === query.category) &&
        (query.status === "all" || sub.status === query.status),
    )
    .sort(compare(query.sort, today));
}
