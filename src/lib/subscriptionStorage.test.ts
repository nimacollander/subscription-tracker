import { describe, expect, it } from "vitest";
import type { Subscription } from "@/types/subscription";
import { parseSubscriptions, serializeSubscriptions, STORAGE_VERSION } from "./subscriptionStorage";

const valid: Subscription = {
  id: "a",
  name: "Netflix",
  price: 15.49,
  billingCycle: "monthly",
  nextBillingDate: "2025-06-20",
  category: "Entertainment",
  notes: "",
  status: "active",
};

function stored(subscriptions: unknown, version = STORAGE_VERSION) {
  return JSON.stringify({ version, subscriptions });
}

describe("serializeSubscriptions / parseSubscriptions", () => {
  it("round-trips a list", () => {
    const list = [valid, { ...valid, id: "b", status: "paused" as const }];
    expect(parseSubscriptions(serializeSubscriptions(list))).toEqual(list);
  });

  it("round-trips an empty list", () => {
    expect(parseSubscriptions(serializeSubscriptions([]))).toEqual([]);
  });
});

describe("parseSubscriptions", () => {
  it.each([
    ["invalid JSON", "{not json"],
    ["a bare array", JSON.stringify([valid])],
    ["null", "null"],
    ["an unknown version", stored([valid], 999)],
    ["a non-array list", stored({ a: valid })],
  ])("returns an empty list for %s", (_, raw) => {
    expect(parseSubscriptions(raw)).toEqual([]);
  });

  it.each([
    ["missing id", { ...valid, id: undefined }],
    ["empty id", { ...valid, id: "" }],
    ["string price", { ...valid, price: "15.49" }],
    ["negative price", { ...valid, price: -1 }],
    ["unknown billing cycle", { ...valid, billingCycle: "daily" }],
    ["impossible date", { ...valid, nextBillingDate: "2025-02-30" }],
    ["unknown status", { ...valid, status: "cancelled" }],
    ["missing notes", { ...valid, notes: undefined }],
  ])("drops an item with %s but keeps valid ones", (_, invalid) => {
    expect(parseSubscriptions(stored([invalid, valid]))).toEqual([valid]);
  });

  it("allows a free subscription", () => {
    const free = { ...valid, price: 0 };
    expect(parseSubscriptions(stored([free]))).toEqual([free]);
  });
});
