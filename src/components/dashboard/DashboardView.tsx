"use client";

import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useToday } from "@/hooks/useToday";
import { getSpendByCategory, getTopSubscriptionsByCost } from "@/lib/analytics";
import { getUpcomingRenewals } from "@/lib/renewals";
import { CategoryDonut } from "./CategoryDonut";
import { HeroSummary } from "./HeroSummary";
import { RenewalRuler } from "./RenewalRuler";
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
          className="inline-flex h-10 items-center rounded-full bg-foreground px-4.5 text-sm font-medium text-surface hover:bg-foreground/85"
        >
          Go to subscriptions
        </Link>
      </EmptyState>
    );
  }

  const allUpcoming = getUpcomingRenewals(subscriptions, today);
  const withinWindow = allUpcoming.filter((r) => r.daysUntil <= UPCOMING_WINDOW_DAYS);

  return (
    <div className="flex flex-col gap-10 sm:gap-14">
      <HeroSummary subscriptions={subscriptions} nextRenewal={allUpcoming[0]} next30={withinWindow} today={today} />
      <RenewalRuler renewals={withinWindow} today={today} horizon={UPCOMING_WINDOW_DAYS} />
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
    <div className="flex flex-col gap-10 sm:gap-14" aria-busy>
      <div className="flex flex-col gap-5">
        <div className="h-4 w-56 animate-pulse rounded bg-border/60" />
        <div className="h-28 w-full max-w-xl animate-pulse rounded-2xl bg-border/60 sm:h-36" />
        <div className="mt-6 h-20 animate-pulse rounded-2xl bg-border/40" />
      </div>
      <div className="h-56 animate-pulse rounded-2xl border border-border bg-surface" />
    </div>
  );
}
