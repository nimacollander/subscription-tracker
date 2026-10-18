import { describe, expect, it } from "vitest";
import type { Subscription } from "@/types/subscription";
import { buildMonthGrid, monthsBetween, shiftMonth } from "./calendar";
import { getChargesBetween, groupChargesByDate } from "./charges";

function make(name: string, overrides: Partial<Subscription> = {}): Subscription {
  return {
    id: name,
    name,
    price: 10,
    billingCycle: "monthly",
    nextBillingDate: "2026-10-20",
    category: "Other",
    notes: "",
    status: "active",
    ...overrides,
  };
}

const summary = (subs: Subscription[], from: string, until: string) =>
  getChargesBetween(subs, from, until).map((c) => `${c.date} ${c.subscription.name}`);

describe("getChargesBetween", () => {
  it("lists each charge in the range, sorted by date then name", () => {
    expect(
      summary(
        [make("Weekly", { billingCycle: "weekly", nextBillingDate: "2026-10-06" }), make("Monthly", { nextBillingDate: "2026-10-13" })],
        "2026-10-01",
        "2026-10-21",
      ),
    ).toEqual(["2026-10-06 Weekly", "2026-10-13 Monthly", "2026-10-13 Weekly", "2026-10-20 Weekly"]);
  });

  it("includes the start date and excludes the end date", () => {
    expect(summary([make("A", { nextBillingDate: "2026-10-01" })], "2026-10-01", "2026-11-01")).toEqual(["2026-10-01 A"]);
    expect(summary([make("A", { nextBillingDate: "2026-11-01" })], "2026-10-01", "2026-11-01")).toEqual([]);
  });

  it("rolls past anchors forward and keeps month-end dates", () => {
    expect(summary([make("A", { nextBillingDate: "2026-01-31" })], "2026-02-01", "2026-05-01")).toEqual([
      "2026-02-28 A",
      "2026-03-31 A",
      "2026-04-30 A",
    ]);
  });

  it("skips paused subscriptions", () => {
    expect(summary([make("A", { status: "paused" })], "2026-10-01", "2026-12-01")).toEqual([]);
  });
});

describe("groupChargesByDate", () => {
  it("groups charges that land on the same day", () => {
    const groups = groupChargesByDate(getChargesBetween([make("A"), make("B")], "2026-10-01", "2026-11-01"));
    expect([...groups.keys()]).toEqual(["2026-10-20"]);
    expect(groups.get("2026-10-20")!.map((c) => c.subscription.name)).toEqual(["A", "B"]);
  });
});

describe("buildMonthGrid", () => {
  it("pads to whole Monday-to-Sunday weeks", () => {
    // October 2026 starts on a Thursday and ends on a Saturday.
    const grid = buildMonthGrid("2026-10");
    expect(grid[0]).toEqual({ date: "2026-09-28", inMonth: false });
    expect(grid.at(-1)).toEqual({ date: "2026-11-01", inMonth: false });
    expect(grid).toHaveLength(35);
    expect(grid.filter((d) => d.inMonth)).toHaveLength(31);
  });

  it("adds no padding when the month starts on Monday and ends on Sunday", () => {
    // February 2027 runs Monday the 1st to Sunday the 28th.
    const grid = buildMonthGrid("2027-02");
    expect(grid).toHaveLength(28);
    expect(grid.every((d) => d.inMonth)).toBe(true);
  });

  it("spans six weeks when the month needs it", () => {
    // August 2026 starts on a Saturday and has 31 days.
    expect(buildMonthGrid("2026-08")).toHaveLength(42);
  });
});

describe("shiftMonth", () => {
  it("moves across year boundaries", () => {
    expect(shiftMonth("2026-12", 1)).toBe("2027-01");
    expect(shiftMonth("2026-01", -1)).toBe("2025-12");
  });
});

describe("monthsBetween", () => {
  it("counts months across years in either direction", () => {
    expect(monthsBetween("2026-10", "2027-01")).toBe(3);
    expect(monthsBetween("2026-10", "2026-10")).toBe(0);
    expect(monthsBetween("2027-01", "2026-10")).toBe(-3);
  });
});
