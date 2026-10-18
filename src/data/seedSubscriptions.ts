import { addDays } from "@/lib/dates";
import type { Subscription } from "@/types/subscription";

type SeedItem = Omit<Subscription, "nextBillingDate"> & {
  /** Days from the first visit until the next charge, so the demo always has upcoming renewals. */
  renewsInDays: number;
};

const SEED_ITEMS: SeedItem[] = [
  { id: "seed-netflix", name: "Netflix", price: 15.49, billingCycle: "monthly", renewsInDays: 3, category: "Entertainment", notes: "Standard plan", status: "active" },
  { id: "seed-spotify", name: "Spotify", price: 11.99, billingCycle: "monthly", renewsInDays: 9, category: "Music", notes: "", status: "active" },
  { id: "seed-github-copilot", name: "GitHub Copilot", price: 100, billingCycle: "yearly", renewsInDays: 142, category: "Developer tools", notes: "Individual plan", status: "active" },
  { id: "seed-icloud", name: "iCloud+", price: 2.99, billingCycle: "monthly", renewsInDays: 17, category: "Cloud storage", notes: "200 GB", status: "active" },
  { id: "seed-gym", name: "Gym membership", price: 45, billingCycle: "monthly", renewsInDays: 1, category: "Health & fitness", notes: "", status: "active" },
  { id: "seed-adobe", name: "Adobe Creative Cloud", price: 59.99, billingCycle: "monthly", renewsInDays: 22, category: "Design", notes: "All apps", status: "active" },
  { id: "seed-notion", name: "Notion", price: 10, billingCycle: "monthly", renewsInDays: 12, category: "Productivity", notes: "Plus plan", status: "active" },
  { id: "seed-amazon-prime", name: "Amazon Prime", price: 139, billingCycle: "yearly", renewsInDays: 64, category: "Shopping", notes: "", status: "active" },
  { id: "seed-hosting", name: "Web hosting", price: 36, billingCycle: "quarterly", renewsInDays: 40, category: "Developer tools", notes: "Portfolio site", status: "active" },
  { id: "seed-disney-plus", name: "Disney+", price: 13.99, billingCycle: "monthly", renewsInDays: 26, category: "Entertainment", notes: "Paused until the next season", status: "paused" },
  { id: "seed-hellofresh", name: "HelloFresh", price: 59.99, billingCycle: "weekly", renewsInDays: 5, category: "Food", notes: "", status: "paused" },
];

export function createSeedSubscriptions(today: string): Subscription[] {
  return SEED_ITEMS.map(({ renewsInDays, ...item }) => ({
    ...item,
    nextBillingDate: addDays(today, renewsInDays),
  }));
}
