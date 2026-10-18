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

export function isSubscription(value: unknown): value is Subscription {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;

  return (
    typeof v.id === "string" &&
    v.id.length > 0 &&
    typeof v.name === "string" &&
    typeof v.price === "number" &&
    Number.isFinite(v.price) &&
    v.price >= 0 &&
    BILLING_CYCLES.includes(v.billingCycle as Subscription["billingCycle"]) &&
    isValidDate(v.nextBillingDate) &&
    typeof v.category === "string" &&
    typeof v.notes === "string" &&
    SUBSCRIPTION_STATUSES.includes(v.status as Subscription["status"])
  );
}
