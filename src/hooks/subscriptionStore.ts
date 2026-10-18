// A tiny external store over localStorage, read through useSyncExternalStore.
// The server snapshot is always null, so the server render and the first client
// render match; React then re-renders with the stored list after hydration.
import { createSeedSubscriptions } from "@/data/seedSubscriptions";
import { toISODate } from "@/lib/dates";
import { parseSubscriptions, serializeSubscriptions } from "@/lib/subscriptionStorage";
import type { Subscription } from "@/types/subscription";

export const STORAGE_KEY = "subscription-tracker:subscriptions";

const listeners = new Set<() => void>();

// The latest stored string: undefined until first read, null if nothing is stored yet.
// Kept in memory too, so the app still works for the session if storage is blocked.
let raw: string | null | undefined;

// useSyncExternalStore needs the same array back until the data changes.
let parsedFrom: string | undefined;
let parsed: Subscription[] = [];

function readStorage(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function emit() {
  listeners.forEach((listener) => listener());
}

function write(list: Subscription[]) {
  raw = serializeSubscriptions(list);
  try {
    window.localStorage.setItem(STORAGE_KEY, raw);
  } catch (error) {
    console.error("Could not save subscriptions to localStorage", error);
  }
  emit();
}

// Keeps other open tabs in sync.
function handleStorageEvent(event: StorageEvent) {
  if (event.key !== STORAGE_KEY) return;
  // Cleared from another tab: show an empty list rather than seeding again.
  raw = event.newValue ?? serializeSubscriptions([]);
  emit();
}

/** null means "not loaded yet" (always on the server, briefly on first visit). */
export function getSnapshot(): Subscription[] | null {
  if (raw === undefined) raw = readStorage();
  if (raw === null) return null;

  if (raw !== parsedFrom) {
    parsedFrom = raw;
    parsed = parseSubscriptions(raw);
  }
  return parsed;
}

export function getServerSnapshot(): null {
  return null;
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  if (listeners.size === 1) window.addEventListener("storage", handleStorageEvent);

  // First visit: nothing stored yet, so save the demo data. Runs after mount, never on the server.
  if (getSnapshot() === null) write(createSeedSubscriptions(toISODate(new Date())));

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", handleStorageEvent);
  };
}

export function updateSubscriptions(update: (list: Subscription[]) => Subscription[]) {
  write(update(getSnapshot() ?? []));
}
