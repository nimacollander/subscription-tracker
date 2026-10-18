export type BillingCycle = "weekly" | "monthly" | "quarterly" | "yearly";

export type SubscriptionStatus = "active" | "paused";

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
