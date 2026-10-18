import { describe, expect, it } from "vitest";
import type { Subscription } from "@/types/subscription";
import {
  appendSubscription,
  patchSubscription,
  removeSubscription,
  toggleSubscriptionStatus,
} from "./subscriptionList";

const base: Subscription = {
  id: "a",
  name: "Netflix",
  price: 15.49,
  billingCycle: "monthly",
  nextBillingDate: "2025-06-20",
  category: "Entertainment",
  notes: "",
  status: "active",
};
const other: Subscription = { ...base, id: "b", name: "Spotify" };
const list = [base, other];

describe("appendSubscription", () => {
  it("adds to the end without mutating the original", () => {
    const next = appendSubscription(list, { ...base, id: "c" });
    expect(next.map((s) => s.id)).toEqual(["a", "b", "c"]);
    expect(list).toHaveLength(2);
  });
});

describe("patchSubscription", () => {
  it("merges changes into the matching item only", () => {
    const next = patchSubscription(list, "a", { price: 17.99, notes: "Price increase" });
    expect(next[0]).toEqual({ ...base, price: 17.99, notes: "Price increase" });
    expect(next[1]).toBe(other);
    expect(list[0].price).toBe(15.49);
  });

  it("leaves the list unchanged for an unknown id", () => {
    expect(patchSubscription(list, "missing", { price: 1 })).toEqual(list);
  });
});

describe("removeSubscription", () => {
  it("removes the matching item", () => {
    expect(removeSubscription(list, "a")).toEqual([other]);
  });

  it("leaves the list unchanged for an unknown id", () => {
    expect(removeSubscription(list, "missing")).toEqual(list);
  });
});

describe("toggleSubscriptionStatus", () => {
  it("switches between active and paused", () => {
    const paused = toggleSubscriptionStatus(list, "a");
    expect(paused[0].status).toBe("paused");
    expect(toggleSubscriptionStatus(paused, "a")[0].status).toBe("active");
  });

  it("does not touch other items", () => {
    expect(toggleSubscriptionStatus(list, "a")[1]).toBe(other);
  });
});
