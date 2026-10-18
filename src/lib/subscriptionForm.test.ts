import { describe, expect, it } from "vitest";
import type { Subscription } from "@/types/subscription";
import {
  MAX_LENGTH,
  toFormValues,
  validateSubscriptionForm,
  type SubscriptionFormValues,
} from "./subscriptionForm";

const valid: SubscriptionFormValues = {
  name: "Netflix",
  price: "15.49",
  billingCycle: "monthly",
  nextBillingDate: "2025-06-20",
  category: "Entertainment",
  notes: "",
  status: "active",
};

function errorsFor(overrides: Partial<SubscriptionFormValues>) {
  const result = validateSubscriptionForm({ ...valid, ...overrides });
  return result.ok ? {} : result.errors;
}

describe("validateSubscriptionForm", () => {
  it("accepts valid values and converts the price to a number", () => {
    expect(validateSubscriptionForm(valid)).toEqual({
      ok: true,
      data: { ...valid, price: 15.49 },
    });
  });

  it("trims text fields", () => {
    const result = validateSubscriptionForm({
      ...valid,
      name: "  Netflix ",
      category: " Entertainment ",
      notes: " 4K plan ",
      price: " 15.49 ",
    });
    expect(result.ok && result.data).toMatchObject({
      name: "Netflix",
      category: "Entertainment",
      notes: "4K plan",
      price: 15.49,
    });
  });

  it("reports every missing required field at once", () => {
    expect(
      errorsFor({ name: " ", price: "", nextBillingDate: "", category: "" }),
    ).toEqual({
      name: "Name is required",
      price: "Price is required",
      nextBillingDate: "Next billing date is required",
      category: "Category is required",
    });
  });

  it("allows empty notes", () => {
    expect(validateSubscriptionForm({ ...valid, notes: "" }).ok).toBe(true);
  });

  describe("price", () => {
    it.each([
      ["0", "Price must be greater than 0"],
      ["-5", "Price must be greater than 0"],
      ["0.004", "Price must be greater than 0"],
      ["abc", "Enter a valid number"],
      ["Infinity", "Enter a valid number"],
    ])("rejects %j", (price, message) => {
      expect(errorsFor({ price })).toEqual({ price: message });
    });

    it("rounds to cents", () => {
      const result = validateSubscriptionForm({ ...valid, price: "9.999" });
      expect(result.ok && result.data.price).toBe(10);
    });
  });

  describe("date", () => {
    it.each(["2025-02-30", "2025-13-01", "June 20"])("rejects %j", (nextBillingDate) => {
      expect(errorsFor({ nextBillingDate })).toEqual({ nextBillingDate: "Enter a valid date" });
    });

    it("accepts past dates, which are rolled forward when shown", () => {
      expect(validateSubscriptionForm({ ...valid, nextBillingDate: "2020-01-31" }).ok).toBe(true);
    });
  });

  it("enforces maximum lengths", () => {
    expect(
      errorsFor({
        name: "x".repeat(MAX_LENGTH.name + 1),
        category: "x".repeat(MAX_LENGTH.category + 1),
        notes: "x".repeat(MAX_LENGTH.notes + 1),
      }),
    ).toEqual({
      name: `Name must be ${MAX_LENGTH.name} characters or fewer`,
      category: `Category must be ${MAX_LENGTH.category} characters or fewer`,
      notes: `Notes must be ${MAX_LENGTH.notes} characters or fewer`,
    });
  });
});

describe("toFormValues", () => {
  it("returns blank values with today's date for a new subscription", () => {
    expect(toFormValues(undefined, "2025-06-15")).toMatchObject({
      name: "",
      price: "",
      nextBillingDate: "2025-06-15",
      billingCycle: "monthly",
      status: "active",
    });
  });

  it("copies an existing subscription, with the price as a string", () => {
    const sub: Subscription = { ...valid, id: "a", price: 15.49 };
    expect(toFormValues(sub, "2025-06-15")).toEqual(valid);
  });
});
