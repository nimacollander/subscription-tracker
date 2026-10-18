"use client";

import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useToday } from "@/hooks/useToday";
import { getSpendByCategory, getTopSubscriptionsByCost } from "@/lib/analytics";
import { categoryColorMap } from "@/lib/categoryColors";
import { getMonthlyForecast } from "@/lib/forecast";
import { getUpcomingRenewals } from "@/lib/renewals";
import { applyQuery, DEFAULT_QUERY } from "@/lib/subscriptionQuery";
import { CategoryDonut } from "./CategoryDonut";
import { ComingUp } from "./ComingUp";
import { MonthlyTotalsChart } from "./MonthlyTotalsChart";
import { OverviewHeader } from "./OverviewHeader";
import { RenewalCalendar } from "./RenewalCalendar";
import { SubscriptionTable } from "./SubscriptionTable";
import { TopSubscriptionsChart } from "./TopSubscriptionsChart";

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
          className="inline-flex h-10 items-center rounded-xl bg-accent px-4.5 text-sm font-semibold text-on-accent hover:bg-accent/90"
        >
          Go to subscriptions
        </Link>
      </EmptyState>
    );
  }

  const allUpcoming = getUpcomingRenewals(subscriptions, today);
  const upcoming = allUpcoming.filter((r) => r.daysUntil <= UPCOMING_WINDOW_DAYS);
  const preview = applyQuery(subscriptions, DEFAULT_QUERY, today).slice(0, TABLE_PREVIEW_ROWS);
  const spendByCategory = getSpendByCategory(subscriptions);

  return (
    <div className="flex flex-col gap-8">
      <OverviewHeader subscriptions={subscriptions} upcoming={upcoming} next={allUpcoming[0]} today={today} />

      {/* Pairs of cards; on phones "Coming up" leads, ahead of the calendar. */}
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 xl:col-start-2 xl:row-start-1">
          {/* Not limited to the 30-day window, so the list stays full in quiet months. */}
          <ComingUp renewals={allUpcoming} />
        </div>
        <div className="min-w-0 xl:col-start-1 xl:row-start-1">
          <RenewalCalendar subscriptions={subscriptions} today={today} />
        </div>
        <div className="min-w-0">
          <MonthlyTotalsChart forecast={getMonthlyForecast(subscriptions, today)} />
        </div>
        <div className="min-w-0">
          <CategoryDonut data={spendByCategory} colorFor={categoryColorMap(spendByCategory)} />
        </div>
        <div className="min-w-0">
          <SubscriptionTable subscriptions={preview} today={today} totalCount={subscriptions.length} />
        </div>
        <div className="min-w-0">
          <TopSubscriptionsChart data={getTopSubscriptionsByCost(subscriptions)} />
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-8" aria-busy>
      <div className="flex flex-col gap-3">
        <div className="h-4 w-28 animate-pulse rounded bg-surface-2" />
        <div className="h-24 max-w-2xl animate-pulse rounded-xl bg-surface-2" />
      </div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="h-[520px] animate-pulse rounded-2xl border border-border bg-surface" />
        <div className="h-[520px] animate-pulse rounded-2xl border border-border bg-surface" />
      </div>
    </div>
  );
}
