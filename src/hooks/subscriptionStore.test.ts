import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { serializeSubscriptions } from "@/lib/subscriptionStorage";
import type { Subscription } from "@/types/subscription";

// The store keeps module-level state, so each test imports a fresh copy.
async function loadStore() {
  vi.resetModules();
  return import("./subscriptionStore");
}

const sub: Subscription = {
  id: "a",
  name: "Netflix",
  price: 15.49,
  billingCycle: "monthly",
  nextBillingDate: "2025-06-20",
  category: "Entertainment",
  notes: "",
  status: "active",
};

let storage: Map<string, string>;
let storageListener: ((event: StorageEvent) => void) | undefined;

beforeEach(() => {
  storage = new Map();
  storageListener = undefined;
  vi.stubGlobal("window", {
    localStorage: {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
    },
    addEventListener: (_: string, fn: (event: StorageEvent) => void) => (storageListener = fn),
    removeEventListener: () => (storageListener = undefined),
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("subscriptionStore", () => {
  it("returns null on the server", async () => {
    const store = await loadStore();
    expect(store.getServerSnapshot()).toBeNull();
  });

  it("seeds demo data on first subscribe and notifies listeners", async () => {
    const store = await loadStore();
    const listener = vi.fn();

    expect(store.getSnapshot()).toBeNull();
    store.subscribe(listener);

    expect(store.getSnapshot()!.length).toBeGreaterThan(0);
    expect(storage.has(store.STORAGE_KEY)).toBe(true);
    expect(listener).toHaveBeenCalled();
  });

  it("does not seed again when data already exists, even if empty", async () => {
    storage.set("subscription-tracker:subscriptions", serializeSubscriptions([]));
    const store = await loadStore();

    store.subscribe(() => {});
    expect(store.getSnapshot()).toEqual([]);
  });

  it("returns the same array until the data changes", async () => {
    storage.set("subscription-tracker:subscriptions", serializeSubscriptions([sub]));
    const store = await loadStore();

    const first = store.getSnapshot();
    expect(store.getSnapshot()).toBe(first);

    store.updateSubscriptions((list) => list.map((s) => ({ ...s, price: 1 })));
    expect(store.getSnapshot()).not.toBe(first);
    expect(store.getSnapshot()![0].price).toBe(1);
  });

  it("persists updates to localStorage", async () => {
    storage.set("subscription-tracker:subscriptions", serializeSubscriptions([]));
    const store = await loadStore();

    store.updateSubscriptions((list) => [...list, sub]);
    expect(storage.get(store.STORAGE_KEY)).toBe(serializeSubscriptions([sub]));
  });

  it("keeps working in memory when localStorage throws", async () => {
    vi.stubGlobal("window", {
      localStorage: {
        getItem: () => {
          throw new Error("blocked");
        },
        setItem: () => {
          throw new Error("blocked");
        },
      },
      addEventListener: () => {},
      removeEventListener: () => {},
    });
    vi.spyOn(console, "error").mockImplementation(() => {});
    const store = await loadStore();

    store.subscribe(() => {});
    const seeded = store.getSnapshot()!;
    store.updateSubscriptions((list) => list.slice(1));
    expect(store.getSnapshot()).toHaveLength(seeded.length - 1);
  });

  it("picks up changes made in another tab", async () => {
    storage.set("subscription-tracker:subscriptions", serializeSubscriptions([]));
    const store = await loadStore();
    const listener = vi.fn();
    store.subscribe(listener);

    storageListener!({
      key: store.STORAGE_KEY,
      newValue: serializeSubscriptions([sub]),
    } as StorageEvent);

    expect(store.getSnapshot()).toEqual([sub]);
    expect(listener).toHaveBeenCalled();
  });
});
