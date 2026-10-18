// Converts subscriptions to and from the string kept in localStorage.
// Stored data can be edited by hand or come from an older version,
// so parsing drops anything that doesn't match the current shape.
import {
  BILLING_CYCLES,
  SUBSCRIPTION_STATUSES,
  type Subscription,
} from "@/types/subscription";
import { parseISODate } from "./dates";

/** Bump when the stored shape changes, and migrate older versions in parseSubscriptions. */
export const STORAGE_VERSION = 1;

type StoredData = { version: number; subscriptions: unknown };

export function serializeSubscriptions(subscriptions: Subscription[]): string {
  return JSON.stringify({ version: STORAGE_VERSION, subscriptions });
}

export function parseSubscriptions(raw: string): Subscription[] {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return [];
  }

  if (!isStoredData(data) || data.version !== STORAGE_VERSION) return [];
  if (!Array.isArray(data.subscriptions)) return [];
  return data.subscriptions.filter(isSubscription);
}

function isStoredData(value: unknown): value is StoredData {
  return typeof value === "object" && value !== null && "version" in value;
}

function isValidDate(value: unknown): boolean {
  if (typeof value !== "string") return false;
  try {
    parseISODate(value);
    return true;
  } catch {
    return false;
  }
}

const isNonEmptyString = (value: unknown) => typeof value === "string" && value.trim() !== "";

/**
 * Describes the first thing wrong with a would-be subscription, phrased to follow
 * its name (e.g. "has an invalid price"), or returns null if it's valid.
 */
export function getSubscriptionProblem(value: unknown): string | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return "is not an object";
  const v = value as Record<string, unknown>;

  if (!isNonEmptyString(v.id)) return "has a missing or invalid id";
  if (!isNonEmptyString(v.name)) return "has a missing or invalid name";
  if (typeof v.price !== "number" || !Number.isFinite(v.price) || v.price < 0) {
    return "has an invalid price (expected a number of 0 or more)";
  }
  if (!BILLING_CYCLES.includes(v.billingCycle as Subscription["billingCycle"])) {
    return `has an invalid billing cycle (expected ${BILLING_CYCLES.join(", ")})`;
  }
  if (!isValidDate(v.nextBillingDate)) return "has an invalid next billing date (expected YYYY-MM-DD)";
  if (!isNonEmptyString(v.category)) return "has a missing or invalid category";
  if (typeof v.notes !== "string") return "has missing or invalid notes";
  if (!SUBSCRIPTION_STATUSES.includes(v.status as Subscription["status"])) {
    return `has an invalid status (expected ${SUBSCRIPTION_STATUSES.join(" or ")})`;
  }
  return null;
}

export function isSubscription(value: unknown): value is Subscription {
  return getSubscriptionProblem(value) === null;
}
