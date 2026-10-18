import { describe, expect, it } from "vitest";
import type { Subscription } from "@/types/subscription";
import { getSpendByCategory, getTopSubscriptionsByCost } from "./analytics";

let nextId = 0;
function make(overrides: Partial<Subscription>): Subscription {
  return {
    id: String(nextId++),
    name: "Sub",
    price: 10,
    billingCycle: "monthly",
    nextBillingDate: "2025-06-20",
    category: "Other",
    notes: "",
    status: "active",
    ...overrides,
  };
}

const simplify = (slices: ReturnType<typeof getSpendByCategory>) =>
  slices.map((s) => [s.category, Number(s.monthly.toFixed(2)), Number(s.share.toFixed(3))]);

describe("getSpendByCategory", () => {
  it("groups monthly-equivalent spend by category, largest first", () => {
    const result = getSpendByCategory([
      make({ category: "Music", price: 10 }),
      make({ category: "Video", price: 120, billingCycle: "yearly" }), // 10/mo
      make({ category: "Video", price: 15 }),
      make({ category: "Cloud", price: 30, billingCycle: "quarterly" }), // 10/mo
    ]);
    expect(simplify(result)).toEqual([
      ["Video", 25, 0.556],
      ["Cloud", 10, 0.222],
      ["Music", 10, 0.222],
    ]);
  });

  it("excludes paused subscriptions", () => {
    const result = getSpendByCategory([
      make({ category: "Music", price: 10 }),
      make({ category: "Video", price: 99, status: "paused" }),
    ]);
    expect(simplify(result)).toEqual([["Music", 10, 1]]);
  });

  it("returns an empty list when nothing is active", () => {
    expect(getSpendByCategory([])).toEqual([]);
    expect(getSpendByCategory([make({ status: "paused" })])).toEqual([]);
  });

  it("folds categories beyond the limit into Other", () => {
    const subs = [60, 50, 40, 30, 20, 10, 5].map((price, i) => make({ category: `C${i}`, price }));
    const result = getSpendByCategory(subs, 6);

    expect(result.map((s) => s.category)).toEqual(["C0", "C1", "C2", "C3", "C4", "Other"]);
    expect(result.at(-1)!.monthly).toBe(15);
    expect(result.reduce((sum, s) => sum + s.share, 0)).toBeCloseTo(1, 10);
  });

  it("does not fold when exactly at the limit", () => {
    const subs = [60, 50, 40, 30, 20, 10].map((price, i) => make({ category: `C${i}`, price }));
    expect(getSpendByCategory(subs, 6).map((s) => s.category)).not.toContain("Other");
  });

  it("merges a real Other category into the folded slice instead of duplicating it", () => {
    const subs = [
      make({ category: "Other", price: 100 }),
      ...[50, 40, 30, 20, 10, 5].map((price, i) => make({ category: `C${i}`, price })),
    ];
    const result = getSpendByCategory(subs, 6);

    expect(result.filter((s) => s.category === "Other")).toHaveLength(1);
    expect(result.find((s) => s.category === "Other")!.monthly).toBe(100 + 10 + 5);
  });
});

describe("getTopSubscriptionsByCost", () => {
  it("ranks active subscriptions by monthly-equivalent cost", () => {
    const result = getTopSubscriptionsByCost([
      make({ name: "Yearly", price: 240, billingCycle: "yearly" }), // 20/mo
      make({ name: "Weekly", price: 10, billingCycle: "weekly" }), // 43.33/mo
      make({ name: "Monthly", price: 30 }),
      make({ name: "Paused", price: 500, status: "paused" }),
    ]);
    expect(result.map((r) => [r.name, Number(r.monthly.toFixed(2))])).toEqual([
      ["Weekly", 43.33],
      ["Monthly", 30],
      ["Yearly", 20],
    ]);
  });

  it("respects the limit and breaks ties by name", () => {
    const subs = ["D", "B", "A", "C"].map((name) => make({ name, price: 10 }));
    expect(getTopSubscriptionsByCost(subs, 3).map((r) => r.name)).toEqual(["A", "B", "C"]);
  });

  it("returns an empty list when nothing is active", () => {
    expect(getTopSubscriptionsByCost([make({ status: "paused" })])).toEqual([]);
  });
});
