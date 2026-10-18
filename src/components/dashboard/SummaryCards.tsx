import { formatCurrency, formatDueIn } from "@/lib/format";
import { calculateTotals } from "@/lib/pricing";
import type { UpcomingRenewal } from "@/lib/renewals";
import type { Subscription } from "@/types/subscription";
import { StatCard } from "./StatCard";

type SummaryCardsProps = {
  subscriptions: Subscription[];
  nextRenewal: UpcomingRenewal | undefined;
};

export function SummaryCards({ subscriptions, nextRenewal }: SummaryCardsProps) {
  const totals = calculateTotals(subscriptions);
  const pausedCount = subscriptions.length - totals.activeCount;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Monthly spend" value={formatCurrency(totals.monthly)} hint="Active subscriptions only" />
      <StatCard label="Yearly spend" value={formatCurrency(totals.yearly)} hint="Projected over 12 months" />
      <StatCard
        label="Active subscriptions"
        value={String(totals.activeCount)}
        hint={pausedCount > 0 ? `${pausedCount} paused` : "None paused"}
      />
      {nextRenewal ? (
        <StatCard
          label="Next renewal"
          value={nextRenewal.subscription.name}
          compact
          hint={`${formatDueIn(nextRenewal.daysUntil)} · ${formatCurrency(nextRenewal.subscription.price)}`}
        />
      ) : (
        <StatCard label="Next renewal" value="—" compact hint="Nothing active" />
      )}
    </div>
  );
}
