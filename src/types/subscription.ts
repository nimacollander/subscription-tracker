export const BILLING_CYCLES = ["weekly", "monthly", "quarterly", "yearly"] as const;
export type BillingCycle = (typeof BILLING_CYCLES)[number];

export const SUBSCRIPTION_STATUSES = ["active", "paused"] as const;
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number];

export type Subscription = {
  id: string;
  name: string;
  /** Amount charged per billing cycle, in the app-wide currency. */
  price: number;
  billingCycle: BillingCycle;
  /** Calendar date as "YYYY-MM-DD". May be in the past; see getNextRenewalDate. */
  nextBillingDate: string;
  category: string;
  notes: string;
  status: SubscriptionStatus;
};

/** Fields the user provides; the id is generated. */
export type SubscriptionInput = Omit<Subscription, "id">;
