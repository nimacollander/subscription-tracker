"use client";

import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useToday } from "@/hooks/useToday";
import { getSpendByCategory, getTopSubscriptionsByCost } from "@/lib/analytics";
import { getUpcomingRenewals } from "@/lib/renewals";
import { CategoryDonut } from "./CategoryDonut";
import { StatCardSkeleton } from "./StatCard";
import { SummaryCards } from "./SummaryCards";
import { TopSubscriptionsChart } from "./TopSubscriptionsChart";
import { UpcomingRenewals } from "./UpcomingRenewals";

const UPCOMING_WINDOW_DAYS = 30;

export function DashboardView() {
  const { subscriptions, isLoaded } = useSubscriptions();
  const today = useToday();

  if (!isLoaded || today === null) return <DashboardSkeleton />;

  if (subscriptions.length === 0) {
    return (
      <EmptyState title="No subscriptions yet" message="Add your subscriptions to see what you spend.">
        <Link
          href="/subscriptions"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-on-accent hover:opacity-90"
        >
          Go to subscriptions
        </Link>
      </EmptyState>
    );
  }

  const allUpcoming = getUpcomingRenewals(subscriptions, today);
  const withinWindow = allUpcoming.filter((r) => r.daysUntil <= UPCOMING_WINDOW_DAYS);

  return (
    <div className="flex flex-col gap-6">
      <SummaryCards subscriptions={subscriptions} nextRenewal={allUpcoming[0]} />
      <div className="grid gap-4 lg:grid-cols-2">
        <UpcomingRenewals renewals={withinWindow} windowDays={UPCOMING_WINDOW_DAYS} />
        <div className="flex min-w-0 flex-col gap-4">
          <CategoryDonut data={getSpendByCategory(subscriptions)} />
          <TopSubscriptionsChart data={getTopSubscriptionsByCost(subscriptions)} />
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6" aria-busy>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
      <div className="h-80 animate-pulse rounded-xl border border-border bg-surface" />
    </div>
  );
}
