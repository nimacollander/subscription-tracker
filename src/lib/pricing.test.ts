import { describe, expect, it } from "vitest";
import type { Subscription } from "@/types/subscription";
import { calculateTotals, toMonthlyPrice, toYearlyPrice } from "./pricing";

function makeSub(overrides: Partial<Subscription>): Subscription {
  return {
    id: "1",
    name: "Test",
    price: 10,
    billingCycle: "monthly",
    nextBillingDate: "2025-01-01",
    category: "Other",
    notes: "",
    status: "active",
    ...overrides,
  };
}

describe("toMonthlyPrice", () => {
  it.each([
    ["weekly", 10, 43.333],
    ["monthly", 10, 10],
    ["quarterly", 30, 10],
    ["yearly", 120, 10],
  ] as const)("converts %s price %d to %d per month", (cycle, price, expected) => {
    expect(toMonthlyPrice(price, cycle)).toBeCloseTo(expected, 3);
  });

  it("returns 0 for a free subscription", () => {
    expect(toMonthlyPrice(0, "weekly")).toBe(0);
  });
});

describe("toYearlyPrice", () => {
  it.each([
    ["weekly", 10, 520],
    ["monthly", 10, 120],
    ["quarterly", 30, 120],
    ["yearly", 120, 120],
  ] as const)("converts %s price %d to %d per year", (cycle, price, expected) => {
    expect(toYearlyPrice(price, cycle)).toBeCloseTo(expected, 6);
  });
});

describe("calculateTotals", () => {
  it("returns zeros for an empty list", () => {
    expect(calculateTotals([])).toEqual({ monthly: 0, yearly: 0, activeCount: 0 });
  });

  it("sums active subscriptions across billing cycles", () => {
    const totals = calculateTotals([
      makeSub({ price: 15.99, billingCycle: "monthly" }),
      makeSub({ price: 99, billingCycle: "yearly" }),
      makeSub({ price: 5, billingCycle: "weekly" }),
      makeSub({ price: 30, billingCycle: "quarterly" }),
    ]);

    // 191.88 + 99 + 260 + 120
    expect(totals.yearly).toBeCloseTo(670.88, 6);
    expect(totals.monthly).toBeCloseTo(670.88 / 12, 6);
    expect(totals.activeCount).toBe(4);
  });

  it("ignores paused subscriptions", () => {
    const totals = calculateTotals([
      makeSub({ price: 10, status: "active" }),
      makeSub({ price: 500, status: "paused" }),
    ]);

    expect(totals).toEqual({ monthly: 10, yearly: 120, activeCount: 1 });
  });

  it("returns zeros when every subscription is paused", () => {
    const totals = calculateTotals([makeSub({ status: "paused" }), makeSub({ status: "paused" })]);
    expect(totals).toEqual({ monthly: 0, yearly: 0, activeCount: 0 });
  });
});
