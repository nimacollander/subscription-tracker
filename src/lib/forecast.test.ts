import { describe, expect, it } from "vitest";
import type { Subscription } from "@/types/subscription";
import { getMonthlyForecast } from "./forecast";

const TODAY = "2026-10-18";

function make(overrides: Partial<Subscription>): Subscription {
  return {
    id: overrides.name ?? "x",
    name: "x",
    price: 10,
    billingCycle: "monthly",
    nextBillingDate: "2026-10-20",
    category: "Video",
    notes: "",
    status: "active",
    ...overrides,
  };
}

const totals = (subs: Subscription[], months = 12) =>
  getMonthlyForecast(subs, TODAY, months).months.map((m) => [m.key, Number(m.total.toFixed(2))]);

describe("getMonthlyForecast", () => {
  it("returns one bucket per month starting with the current month", () => {
    const { months } = getMonthlyForecast([], TODAY, 3);
    expect(months.map((m) => m.key)).toEqual(["2026-10", "2026-11", "2026-12"]);
    expect(months.every((m) => m.total === 0)).toBe(true);
  });

  it("charges a monthly subscription once a month", () => {
    expect(totals([make({ price: 15 })], 3)).toEqual([
      ["2026-10", 15],
      ["2026-11", 15],
      ["2026-12", 15],
    ]);
  });

  it("puts yearly and quarterly charges in the months they land", () => {
    const result = totals(
      [
        make({ name: "Yearly", price: 120, billingCycle: "yearly", nextBillingDate: "2027-02-01" }),
        make({ name: "Quarterly", price: 30, billingCycle: "quarterly", nextBillingDate: "2026-11-05" }),
      ],
      6,
    );
    expect(result).toEqual([
      ["2026-10", 0],
      ["2026-11", 30],
      ["2026-12", 0],
      ["2027-01", 0],
      ["2027-02", 150],
      ["2027-03", 0],
    ]);
  });

  it("counts every weekly charge in a month", () => {
    // From Oct 20: Oct 20, 27 → 2 charges; Nov 3, 10, 17, 24 → 4.
    expect(totals([make({ price: 5, billingCycle: "weekly" })], 2)).toEqual([
      ["2026-10", 10],
      ["2026-11", 20],
    ]);
  });

  it("skips charges before today and rolls past dates forward", () => {
    // Monthly anchored Sep 10 → next charges Nov 10, Dec 10 (Oct 10 already passed).
    expect(totals([make({ nextBillingDate: "2026-09-10" })], 3)).toEqual([
      ["2026-10", 0],
      ["2026-11", 10],
      ["2026-12", 10],
    ]);
  });

  it("keeps month-end billing on the last day without drifting", () => {
    const { months } = getMonthlyForecast([make({ nextBillingDate: "2026-10-31" })], TODAY, 6);
    expect(months.map((m) => m.total)).toEqual([10, 10, 10, 10, 10, 10]);
  });

  it("ignores paused subscriptions", () => {
    expect(totals([make({ status: "paused" })], 1)).toEqual([["2026-10", 0]]);
  });

  it("keeps the biggest categories and groups the rest as Other", () => {
    const { series, months } = getMonthlyForecast(
      [
        make({ name: "A", category: "Design", price: 60 }),
        make({ name: "B", category: "Health", price: 45 }),
        make({ name: "C", category: "Video", price: 15 }),
        make({ name: "D", category: "Music", price: 12 }),
        make({ name: "E", category: "Cloud", price: 3 }),
      ],
      TODAY,
      1,
    );
    expect(series).toEqual(["Design", "Health", "Video", "Other"]);
    expect(months[0].values).toEqual({ Design: 60, Health: 45, Video: 15, Other: 15 });
  });

  it("omits Other when everything fits", () => {
    const { series } = getMonthlyForecast([make({ category: "Design" }), make({ name: "y", category: "Music" })], TODAY, 1);
    expect(series).toEqual(["Design", "Music"]);
  });

  it("merges a real Other category into the grouped series", () => {
    const { series, months } = getMonthlyForecast(
      [make({ name: "A", category: "Other", price: 100 }), make({ name: "B", category: "Music", price: 5 })],
      TODAY,
      1,
    );
    expect(series).toEqual(["Music", "Other"]);
    expect(months[0].values.Other).toBe(100);
  });
});
