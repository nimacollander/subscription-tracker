// Projects upcoming charges month by month from each subscription's billing
// dates, so yearly and quarterly renewals show up in the months they land.
import type { Subscription } from "@/types/subscription";
import { OTHER_CATEGORY } from "./analytics";
import { getChargesBetween } from "./charges";
import { addMonths } from "./dates";

export type ForecastMonth = {
  /** "2026-10" */
  key: string;
  total: number;
  /** Amount per series name (top categories plus "Other"). */
  values: Record<string, number>;
};

export type Forecast = {
  months: ForecastMonth[];
  /** Series in stacking order: the biggest categories first, "Other" last. */
  series: string[];
};

/**
 * Charges from `today` (inclusive) through the end of the month `months - 1`
 * months later. Categories beyond `topCategories` are grouped as "Other".
 */
export function getMonthlyForecast(
  subscriptions: Subscription[],
  today: string,
  months = 12,
  topCategories = 3,
): Forecast {
  const firstMonth = `${today.slice(0, 7)}-01`;
  const keys = Array.from({ length: months }, (_, i) => addMonths(firstMonth, i).slice(0, 7));
  const horizonEnd = addMonths(firstMonth, months); // exclusive

  // Every charge in the window, as [monthKey, category, amount].
  const charges: [string, string, number][] = getChargesBetween(subscriptions, today, horizonEnd).map(
    ({ date, subscription }) => [date.slice(0, 7), subscription.category, subscription.price],
  );

  const categoryTotals = new Map<string, number>();
  for (const [, category, amount] of charges) {
    categoryTotals.set(category, (categoryTotals.get(category) ?? 0) + amount);
  }
  const ranked = [...categoryTotals]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([category]) => category);
  const top = ranked.filter((c) => c !== OTHER_CATEGORY).slice(0, topCategories);
  const hasOther = ranked.some((c) => !top.includes(c));
  const series = hasOther ? [...top, OTHER_CATEGORY] : top;

  const byKey = new Map(
    keys.map((key) => [key, { key, total: 0, values: Object.fromEntries(series.map((s) => [s, 0])) }]),
  );
  for (const [key, category, amount] of charges) {
    const month = byKey.get(key)!;
    const name = top.includes(category) ? category : OTHER_CATEGORY;
    month.values[name] += amount;
    month.total += amount;
  }

  return { months: keys.map((key) => byKey.get(key)!), series };
}
