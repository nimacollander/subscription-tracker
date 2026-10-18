// Immutable list operations used by the useSubscriptions hook.
// Unknown ids leave the list unchanged.
import type { Subscription, SubscriptionInput } from "@/types/subscription";

export function appendSubscription(list: Subscription[], sub: Subscription): Subscription[] {
  return [...list, sub];
}

export function patchSubscription(
  list: Subscription[],
  id: string,
  changes: Partial<SubscriptionInput>,
): Subscription[] {
  return list.map((sub) => (sub.id === id ? { ...sub, ...changes } : sub));
}

export function removeSubscription(list: Subscription[], id: string): Subscription[] {
  return list.filter((sub) => sub.id !== id);
}

export function toggleSubscriptionStatus(list: Subscription[], id: string): Subscription[] {
  return list.map((sub) =>
    sub.id === id ? { ...sub, status: sub.status === "active" ? "paused" : "active" } : sub,
  );
}
