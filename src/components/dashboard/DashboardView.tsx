"use client";

import Link from "next/link";
import { categoryColorMap } from "@/lib/categoryColors";
import { EmptyState } from "@/components/ui/EmptyState";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useToday } from "@/hooks/useToday";
import { getSpendByCategory, getTopSubscriptionsByCost } from "@/lib/analytics";
import { getMonthlyForecast } from "@/lib/forecast";
import { getUpcomingRenewals } from "@/lib/renewals";
import { applyQuery, DEFAULT_QUERY } from "@/lib/subscriptionQuery";
import { CategoryDonut } from "./CategoryDonut";
import { ForecastChart } from "./ForecastChart";
import { NextChargeCard } from "./NextChargeCard";
import { SpendOverview } from "./SpendOverview";
import { SubscriptionTable } from "./SubscriptionTable";
import { TopSubscriptionsChart } from "./TopSubscriptionsChart";
import { UpcomingRenewals } from "./UpcomingRenewals";

const UPCOMING_WINDOW_DAYS = 30;
const TABLE_PREVIEW_ROWS = 5;

export function DashboardView() {
  const { subscriptions, isLoaded } = useSubscriptions();
  const today = useToday();

  if (!isLoaded || today === null) return <DashboardSkeleton />;

  if (subscriptions.length === 0) {
    return (
      <EmptyState title="No subscriptions yet" message="Add your subscriptions to see what you spend.">
        <Link
          href="/subscriptions"
          className="inline-flex h-10 items-center rounded-full bg-foreground px-4.5 text-sm font-medium text-background hover:bg-foreground/90"
        >
          Go to subscriptions
        </Link>
      </EmptyState>
    );
  }

  const allUpcoming = getUpcomingRenewals(subscriptions, today);
  const withinWindow = allUpcoming.filter((r) => r.daysUntil <= UPCOMING_WINDOW_DAYS);
  const preview = applyQuery(subscriptions, DEFAULT_QUERY, today).slice(0, TABLE_PREVIEW_ROWS);
  const spendByCategory = getSpendByCategory(subscriptions);
  const colorFor = categoryColorMap(spendByCategory);

  return (
    // Two columns from xl. Below that the column wrappers dissolve (display: contents)
    // so `order` can put what's due next right after the totals on a phone.
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px] xl:items-start">
      <div className="contents xl:flex xl:min-w-0 xl:flex-col xl:gap-5">
        <div className="order-1 min-w-0">
          <SpendOverview subscriptions={subscriptions} upcoming={withinWindow} />
        </div>
        <div className="order-4 min-w-0">
          <ForecastChart forecast={getMonthlyForecast(subscriptions, today)} colorFor={colorFor} />
        </div>
        <div className="order-5 min-w-0">
          <SubscriptionTable subscriptions={preview} today={today} totalCount={subscriptions.length} />
        </div>
      </div>
      <div className="contents xl:flex xl:min-w-0 xl:flex-col xl:gap-5">
        <div className="order-2 min-w-0">
          <NextChargeCard next={allUpcoming[0]} next30={withinWindow} />
        </div>
        <div className="order-3 min-w-0">
          <UpcomingRenewals renewals={withinWindow} windowDays={UPCOMING_WINDOW_DAYS} />
        </div>
        <div className="order-6 min-w-0">
          <CategoryDonut data={spendByCategory} colorFor={colorFor} />
        </div>
        <div className="order-7 min-w-0">
          <TopSubscriptionsChart data={getTopSubscriptionsByCost(subscriptions)} />
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]" aria-busy>
      <div className="flex flex-col gap-5">
        <div className="h-56 animate-pulse rounded-3xl border border-border bg-surface" />
        <div className="h-80 animate-pulse rounded-3xl border border-border bg-surface" />
      </div>
      <div className="flex flex-col gap-5">
        <div className="h-72 animate-pulse rounded-3xl border border-border bg-surface" />
        <div className="h-80 animate-pulse rounded-3xl border border-border bg-surface" />
      </div>
    </div>
  );
}
