import { describe, expect, it } from "vitest";
import { isSubscription } from "@/lib/subscriptionStorage";
import { createSeedSubscriptions } from "./seedSubscriptions";

describe("createSeedSubscriptions", () => {
  const seed = createSeedSubscriptions("2025-06-15");

  it("produces valid subscriptions with unique ids", () => {
    expect(seed.every(isSubscription)).toBe(true);
    expect(new Set(seed.map((s) => s.id)).size).toBe(seed.length);
  });

  it("schedules every renewal after the given day", () => {
    expect(seed.every((s) => s.nextBillingDate > "2025-06-15")).toBe(true);
  });

  it("covers every billing cycle and both statuses", () => {
    expect(new Set(seed.map((s) => s.billingCycle))).toEqual(
      new Set(["weekly", "monthly", "quarterly", "yearly"]),
    );
    expect(new Set(seed.map((s) => s.status))).toEqual(new Set(["active", "paused"]));
  });
});
