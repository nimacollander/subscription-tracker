import { describe, expect, it } from "vitest";
import { daysUntilRenewal, getNextRenewalDate } from "./renewals";

const TODAY = "2025-06-15";

describe("getNextRenewalDate", () => {
  it("returns a future date unchanged", () => {
    expect(getNextRenewalDate("2025-07-01", "monthly", TODAY)).toBe("2025-07-01");
  });

  it("returns today unchanged when it renews today", () => {
    expect(getNextRenewalDate(TODAY, "weekly", TODAY)).toBe(TODAY);
  });

  describe("rolls past dates forward", () => {
    it.each([
      ["weekly", "2025-06-10", "2025-06-17"],
      ["monthly", "2025-05-20", "2025-06-20"],
      ["quarterly", "2025-01-10", "2025-07-10"],
      ["yearly", "2024-03-01", "2026-03-01"],
    ] as const)("%s from %s to %s", (cycle, date, expected) => {
      expect(getNextRenewalDate(date, cycle, TODAY)).toBe(expected);
    });

    it("lands on today when a past cycle hits it exactly", () => {
      expect(getNextRenewalDate("2025-05-15", "monthly", TODAY)).toBe(TODAY);
      expect(getNextRenewalDate("2025-06-01", "weekly", TODAY)).toBe(TODAY);
    });

    it("handles dates many years in the past", () => {
      expect(getNextRenewalDate("2015-06-16", "monthly", TODAY)).toBe("2025-06-16");
      expect(getNextRenewalDate("2015-06-13", "weekly", TODAY)).toBe("2025-06-21");
    });
  });

  describe("month-end dates", () => {
    it("clamps to the end of a shorter month", () => {
      expect(getNextRenewalDate("2025-01-31", "monthly", "2025-02-10")).toBe("2025-02-28");
      expect(getNextRenewalDate("2024-01-31", "monthly", "2024-02-10")).toBe("2024-02-29");
    });

    it("returns to the 31st afterwards instead of drifting to the 28th", () => {
      expect(getNextRenewalDate("2025-01-31", "monthly", "2025-03-01")).toBe("2025-03-31");
      expect(getNextRenewalDate("2025-01-31", "monthly", "2025-04-01")).toBe("2025-04-30");
      expect(getNextRenewalDate("2025-01-31", "monthly", "2025-05-01")).toBe("2025-05-31");
    });

    it("handles the 31st on a quarterly cycle", () => {
      expect(getNextRenewalDate("2025-08-31", "quarterly", "2025-09-15")).toBe("2025-11-30");
    });

    it("moves a Feb 29 yearly renewal to Feb 28 outside leap years", () => {
      expect(getNextRenewalDate("2024-02-29", "yearly", "2025-01-01")).toBe("2025-02-28");
      expect(getNextRenewalDate("2024-02-29", "yearly", "2027-03-01")).toBe("2028-02-29");
    });
  });
});

describe("daysUntilRenewal", () => {
  it("returns 0 when it renews today", () => {
    expect(daysUntilRenewal(TODAY, "monthly", TODAY)).toBe(0);
  });

  it("counts days to a future date", () => {
    expect(daysUntilRenewal("2025-06-25", "monthly", TODAY)).toBe(10);
  });

  it("counts days to the rolled-forward date for a past date", () => {
    // 2025-06-10 weekly → 2025-06-17
    expect(daysUntilRenewal("2025-06-10", "weekly", TODAY)).toBe(2);
  });

  it("counts across a year boundary", () => {
    expect(daysUntilRenewal("2025-01-05", "yearly", "2025-12-30")).toBe(6);
  });
});
