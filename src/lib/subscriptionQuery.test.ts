import { describe, expect, it } from "vitest";
import type { Subscription } from "@/types/subscription";
import {
  applyQuery,
  DEFAULT_QUERY,
  getCategories,
  isFiltered,
  type SubscriptionQuery,
} from "./subscriptionQuery";

const TODAY = "2025-06-15";

function make(name: string, overrides: Partial<Subscription> = {}): Subscription {
  return {
    id: name,
    name,
    price: 10,
    billingCycle: "monthly",
    nextBillingDate: "2025-06-20",
    category: "Other",
    notes: "",
    status: "active",
    ...overrides,
  };
}

const subs = [
  make("Netflix", { price: 15.49, category: "Entertainment", nextBillingDate: "2025-06-18" }),
  make("Spotify", { price: 11.99, category: "Music", nextBillingDate: "2025-06-25" }),
  make("GitHub Copilot", { price: 100, billingCycle: "yearly", category: "Developer tools", nextBillingDate: "2025-09-01" }),
  make("Disney+", { price: 13.99, category: "Entertainment", status: "paused", nextBillingDate: "2025-06-16" }),
  make("Gym", { price: 45, category: "Health", nextBillingDate: "2025-06-10" }), // rolls to 2025-07-10
];

const names = (query: Partial<SubscriptionQuery>) =>
  applyQuery(subs, { ...DEFAULT_QUERY, ...query }, TODAY).map((s) => s.name);

describe("applyQuery: search", () => {
  it("matches names case-insensitively and ignores surrounding spaces", () => {
    expect(names({ search: "  NET ", sort: "name-asc" })).toEqual(["Netflix"]);
    expect(names({ search: "i", sort: "name-asc" })).toEqual(["Disney+", "GitHub Copilot", "Netflix", "Spotify"]);
  });

  it("matches by name only", () => {
    expect(names({ search: "Music" })).toEqual([]);
  });

  it("returns nothing when no name matches", () => {
    expect(names({ search: "hulu" })).toEqual([]);
  });
});

describe("applyQuery: filters", () => {
  it("filters by category", () => {
    expect(names({ category: "Entertainment", sort: "name-asc" })).toEqual(["Disney+", "Netflix"]);
  });

  it("filters by status", () => {
    expect(names({ status: "paused" })).toEqual(["Disney+"]);
    expect(names({ status: "active" })).not.toContain("Disney+");
  });

  it("combines search, category, and status", () => {
    expect(names({ search: "n", category: "Entertainment", status: "active" })).toEqual(["Netflix"]);
  });
});

describe("applyQuery: sorting", () => {
  it("sorts by name both ways, ignoring case", () => {
    const list = [make("beta"), make("Alpha"), make("charlie")];
    const sorted = (sort: SubscriptionQuery["sort"]) =>
      applyQuery(list, { ...DEFAULT_QUERY, sort }, TODAY).map((s) => s.name);
    expect(sorted("name-asc")).toEqual(["Alpha", "beta", "charlie"]);
    expect(sorted("name-desc")).toEqual(["charlie", "beta", "Alpha"]);
  });

  it("sorts by monthly-equivalent price", () => {
    // Copilot is $100/yr ≈ $8.33/mo, the cheapest.
    expect(names({ sort: "price-asc" })).toEqual(["GitHub Copilot", "Spotify", "Disney+", "Netflix", "Gym"]);
    expect(names({ sort: "price-desc" })).toEqual(["Gym", "Netflix", "Disney+", "Spotify", "GitHub Copilot"]);
  });

  it("sorts by the rolled-forward next billing date with paused last", () => {
    expect(names({ sort: "next-billing" })).toEqual(["Netflix", "Spotify", "Gym", "GitHub Copilot", "Disney+"]);
  });

  it("breaks price ties by name", () => {
    const list = [make("B"), make("A")];
    expect(applyQuery(list, { ...DEFAULT_QUERY, sort: "price-desc" }, TODAY).map((s) => s.name)).toEqual(["A", "B"]);
  });

  it("does not mutate the input", () => {
    const copy = [...subs];
    applyQuery(subs, { ...DEFAULT_QUERY, sort: "name-desc" }, TODAY);
    expect(subs).toEqual(copy);
  });
});

describe("getCategories", () => {
  it("returns distinct categories alphabetically", () => {
    expect(getCategories(subs)).toEqual(["Developer tools", "Entertainment", "Health", "Music"]);
  });
});

describe("isFiltered", () => {
  it("is false for the default query and when only sorting changes", () => {
    expect(isFiltered(DEFAULT_QUERY)).toBe(false);
    expect(isFiltered({ ...DEFAULT_QUERY, sort: "name-asc" })).toBe(false);
    expect(isFiltered({ ...DEFAULT_QUERY, search: "   " })).toBe(false);
  });

  it("is true when any filter is set", () => {
    expect(isFiltered({ ...DEFAULT_QUERY, search: "net" })).toBe(true);
    expect(isFiltered({ ...DEFAULT_QUERY, category: "Music" })).toBe(true);
    expect(isFiltered({ ...DEFAULT_QUERY, status: "paused" })).toBe(true);
  });
});
