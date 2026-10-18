import { describe, expect, it } from "vitest";
import { formatCurrency, formatDate, formatDueIn } from "./format";

describe("formatCurrency", () => {
  it("formats with two decimals in the given currency", () => {
    expect(formatCurrency(15.5, "USD", "en-US")).toBe("$15.50");
    expect(formatCurrency(1234.5, "EUR", "en-US")).toBe("€1,234.50");
  });
});

describe("formatDate", () => {
  it("formats a calendar date without shifting it by timezone", () => {
    expect(formatDate("2025-01-01", "en-US")).toBe("Jan 1, 2025");
    expect(formatDate("2025-12-31", "en-US")).toBe("Dec 31, 2025");
  });
});

describe("formatDueIn", () => {
  it.each([
    [0, "Due today"],
    [1, "Due tomorrow"],
    [2, "Due in 2 days"],
    [30, "Due in 30 days"],
  ])("formats %d as %j", (days, expected) => {
    expect(formatDueIn(days)).toBe(expected);
  });
});
