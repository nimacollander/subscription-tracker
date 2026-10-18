import { useSyncExternalStore } from "react";
import { createId } from "@/lib/id";
import {
  appendSubscription,
  patchSubscription,
  removeSubscription,
  toggleSubscriptionStatus,
} from "@/lib/subscriptionList";
import type { Subscription, SubscriptionInput } from "@/types/subscription";
import {
  getServerSnapshot,
  getSnapshot,
  subscribe,
  updateSubscriptions,
} from "./subscriptionStore";

const EMPTY: Subscription[] = [];

// Actions live at module level, so their identity never changes between renders.
function addSubscription(input: SubscriptionInput): Subscription {
  const sub = { ...input, id: createId() };
  updateSubscriptions((list) => appendSubscription(list, sub));
  return sub;
}

function updateSubscription(id: string, changes: Partial<SubscriptionInput>) {
  updateSubscriptions((list) => patchSubscription(list, id, changes));
}

function deleteSubscription(id: string) {
  updateSubscriptions((list) => removeSubscription(list, id));
}

function toggleStatus(id: string) {
  updateSubscriptions((list) => toggleSubscriptionStatus(list, id));
}

export function useSubscriptions() {
  const stored = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return {
    subscriptions: stored ?? EMPTY,
    /** False during the server render and hydration; render a placeholder until true. */
    isLoaded: stored !== null,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    toggleStatus,
  };
}
