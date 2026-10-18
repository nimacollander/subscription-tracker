import { describe, expect, it } from "vitest";
import type { Subscription } from "@/types/subscription";
import { createExport, EXPORT_FORMAT, exportFilename, parseImport } from "./dataTransfer";

const netflix: Subscription = {
  id: "a",
  name: "Netflix",
  price: 15.49,
  billingCycle: "monthly",
  nextBillingDate: "2025-06-20",
  category: "Entertainment",
  notes: "",
  status: "active",
};
const spotify: Subscription = { ...netflix, id: "b", name: "Spotify", price: 11.99, status: "paused" };

function file(overrides: Record<string, unknown> = {}) {
  return JSON.stringify({ format: EXPORT_FORMAT, version: 1, exportedAt: "2025-06-15T00:00:00.000Z", subscriptions: [netflix], ...overrides });
}

function errorOf(text: string) {
  const result = parseImport(text);
  return result.ok ? null : result.error;
}

describe("createExport", () => {
  it("round-trips through parseImport", () => {
    const text = createExport([netflix, spotify], new Date("2025-06-15T12:00:00Z"));
    expect(parseImport(text)).toEqual({ ok: true, subscriptions: [netflix, spotify] });
  });

  it("includes format, version, and timestamp", () => {
    const data = JSON.parse(createExport([], new Date("2025-06-15T12:00:00Z")));
    expect(data).toEqual({ format: EXPORT_FORMAT, version: 1, exportedAt: "2025-06-15T12:00:00.000Z", subscriptions: [] });
  });
});

describe("exportFilename", () => {
  it("includes the date", () => {
    expect(exportFilename("2025-06-15")).toBe("subscription-tracker-2025-06-15.json");
  });
});

describe("parseImport", () => {
  it("accepts an empty list", () => {
    expect(parseImport(file({ subscriptions: [] }))).toEqual({ ok: true, subscriptions: [] });
  });

  it("rejects invalid JSON", () => {
    expect(errorOf("{nope")).toBe("This file isn't valid JSON.");
    expect(errorOf("")).toBe("This file isn't valid JSON.");
  });

  it.each([
    ["a bare array", JSON.stringify([netflix])],
    ["null", "null"],
    ["a number", "42"],
    ["a missing format", JSON.stringify({ version: 1, subscriptions: [] })],
    ["the wrong format", file({ format: "other-app" })],
    ["a missing subscriptions list", file({ subscriptions: undefined })],
    ["a non-array subscriptions list", file({ subscriptions: { a: netflix } })],
  ])("rejects %s as not an export", (_, text) => {
    expect(errorOf(text)).toBe("This file isn't a Subscription Tracker export.");
  });

  it("rejects other versions with a specific message", () => {
    expect(errorOf(file({ version: 2 }))).toBe("This file was exported from a newer version of the app.");
    expect(errorOf(file({ version: 0 }))).toBe("This export version isn't supported.");
    expect(errorOf(file({ version: "1" }))).toBe("This export version isn't supported.");
  });

  it.each([
    [{ ...netflix, price: "15.49" }, 'Subscription 2 ("Netflix") has an invalid price (expected a number of 0 or more).'],
    [{ ...netflix, billingCycle: "daily" }, 'Subscription 2 ("Netflix") has an invalid billing cycle (expected weekly, monthly, quarterly, yearly).'],
    [{ ...netflix, nextBillingDate: "2025-02-30" }, 'Subscription 2 ("Netflix") has an invalid next billing date (expected YYYY-MM-DD).'],
    [{ ...netflix, status: "cancelled" }, 'Subscription 2 ("Netflix") has an invalid status (expected active or paused).'],
    [{ ...netflix, name: "  " }, "Subscription 2 has a missing or invalid name."],
    [{ ...netflix, id: undefined }, 'Subscription 2 ("Netflix") has a missing or invalid id.'],
    ["Netflix", "Subscription 2 is not an object."],
  ])("names the invalid item and the problem (%#)", (bad, message) => {
    expect(errorOf(file({ subscriptions: [spotify, bad] }))).toBe(message);
  });

  it("rejects duplicate ids", () => {
    expect(errorOf(file({ subscriptions: [netflix, { ...spotify, id: "a" }] }))).toBe(
      'The file contains the id "a" more than once.',
    );
  });
});
