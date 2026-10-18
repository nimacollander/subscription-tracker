import { describe, expect, it } from "vitest";
import { addDays, addMonths, daysBetween, parseISODate, toISODate } from "./dates";

describe("parseISODate", () => {
  it("parses a valid date at UTC midnight", () => {
    expect(parseISODate("2025-03-09").toISOString()).toBe("2025-03-09T00:00:00.000Z");
  });

  it.each(["2025-02-30", "2025-13-01", "2025-3-9", "03/09/2025", ""])(
    "rejects %j",
    (value) => {
      expect(() => parseISODate(value)).toThrow("Invalid date");
    },
  );
});

describe("toISODate", () => {
  it("uses the local calendar date", () => {
    expect(toISODate(new Date(2025, 0, 5, 23, 59))).toBe("2025-01-05");
  });
});

describe("addDays", () => {
  it("crosses month and year boundaries", () => {
    expect(addDays("2025-01-28", 7)).toBe("2025-02-04");
    expect(addDays("2025-12-29", 7)).toBe("2026-01-05");
  });
});

describe("addMonths", () => {
  it("keeps the day when it exists in the target month", () => {
    expect(addMonths("2025-01-15", 1)).toBe("2025-02-15");
  });

  it("clamps to the last day of shorter months", () => {
    expect(addMonths("2025-01-31", 1)).toBe("2025-02-28");
    expect(addMonths("2024-01-31", 1)).toBe("2024-02-29");
    expect(addMonths("2025-03-31", 1)).toBe("2025-04-30");
  });

  it("crosses year boundaries", () => {
    expect(addMonths("2025-11-30", 3)).toBe("2026-02-28");
  });
});

describe("daysBetween", () => {
  it("counts calendar days in either direction", () => {
    expect(daysBetween("2025-01-01", "2025-01-31")).toBe(30);
    expect(daysBetween("2025-01-31", "2025-01-01")).toBe(-30);
    expect(daysBetween("2025-06-01", "2025-06-01")).toBe(0);
  });

  it("is unaffected by daylight saving changes", () => {
    // US and EU clocks change in late March.
    expect(daysBetween("2025-03-01", "2025-04-01")).toBe(31);
  });
});
