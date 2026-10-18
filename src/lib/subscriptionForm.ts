// Form values are kept as strings (what inputs produce) and converted to a
// SubscriptionInput only once they pass validation.
import type {
  BillingCycle,
  Subscription,
  SubscriptionInput,
  SubscriptionStatus,
} from "@/types/subscription";
import { parseISODate } from "./dates";

export type SubscriptionFormValues = {
  name: string;
  price: string;
  billingCycle: BillingCycle;
  nextBillingDate: string;
  category: string;
  notes: string;
  status: SubscriptionStatus;
};

export type SubscriptionFormErrors = Partial<Record<keyof SubscriptionFormValues, string>>;

export type ValidationResult =
  | { ok: true; data: SubscriptionInput }
  | { ok: false; errors: SubscriptionFormErrors };

export const MAX_LENGTH = { name: 50, category: 30, notes: 200 } as const;

export function toFormValues(sub: Subscription | undefined, today: string): SubscriptionFormValues {
  if (!sub) {
    return {
      name: "",
      price: "",
      billingCycle: "monthly",
      nextBillingDate: today,
      category: "",
      notes: "",
      status: "active",
    };
  }
  return {
    name: sub.name,
    price: String(sub.price),
    billingCycle: sub.billingCycle,
    nextBillingDate: sub.nextBillingDate,
    category: sub.category,
    notes: sub.notes,
    status: sub.status,
  };
}

function validateText(value: string, label: string, max: number, required: boolean) {
  if (required && value === "") return `${label} is required`;
  if (value.length > max) return `${label} must be ${max} characters or fewer`;
  return undefined;
}

function validatePrice(value: string): string | undefined {
  if (value === "") return "Price is required";
  const price = Number(value);
  if (!Number.isFinite(price)) return "Enter a valid number";
  // Checked after rounding, so 0.004 doesn't slip through as a 0 price.
  if (Math.round(price * 100) <= 0) return "Price must be greater than 0";
  return undefined;
}

function validateDate(value: string): string | undefined {
  if (value === "") return "Next billing date is required";
  try {
    parseISODate(value);
    return undefined;
  } catch {
    return "Enter a valid date";
  }
}

export function validateSubscriptionForm(values: SubscriptionFormValues): ValidationResult {
  const name = values.name.trim();
  const category = values.category.trim();
  const notes = values.notes.trim();
  const price = values.price.trim();
  const nextBillingDate = values.nextBillingDate.trim();

  const errors: SubscriptionFormErrors = {
    name: validateText(name, "Name", MAX_LENGTH.name, true),
    price: validatePrice(price),
    nextBillingDate: validateDate(nextBillingDate),
    category: validateText(category, "Category", MAX_LENGTH.category, true),
    notes: validateText(notes, "Notes", MAX_LENGTH.notes, false),
  };

  const errorEntries = Object.entries(errors).filter(([, message]) => message);
  if (errorEntries.length > 0) {
    return { ok: false, errors: Object.fromEntries(errorEntries) };
  }

  return {
    ok: true,
    data: {
      name,
      price: Math.round(Number(price) * 100) / 100,
      billingCycle: values.billingCycle,
      nextBillingDate,
      category,
      notes,
      status: values.status,
    },
  };
}
