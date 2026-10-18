import { getTopSubscriptionsByCost } from "@/lib/analytics";
import { formatCurrency, formatMonthYear } from "@/lib/format";
import { calculateTotals } from "@/lib/pricing";
import { isDueSoon, type UpcomingRenewal } from "@/lib/renewals";
import type { Subscription } from "@/types/subscription";

type OverviewHeaderProps = {
  subscriptions: Subscription[];
  upcoming: UpcomingRenewal[];
  today: string;
};

/** The dashboard opens with its answer as a sentence, then a few supporting facts. */
export function OverviewHeader({ subscriptions, upcoming, today }: OverviewHeaderProps) {
  const totals = calculateTotals(subscriptions);
  const pausedCount = subscriptions.length - totals.activeCount;
  const biggest = getTopSubscriptionsByCost(subscriptions, 1)[0];
  const dueSoonCount = upcoming.filter((r) => isDueSoon(r.daysUntil)).length;

  return (
    <section>
      <p className="text-sm font-medium text-muted">{formatMonthYear(today)}</p>
      <p className="mt-2 max-w-3xl font-display text-3xl leading-[1.15] font-semibold tracking-tight text-balance sm:text-[44px]">
        You&apos;re spending <span className="text-accent">{formatCurrency(totals.monthly)}</span> a month on{" "}
        {totals.activeCount} {totals.activeCount === 1 ? "subscription" : "subscriptions"}.
      </p>

      <ul className="mt-5 flex flex-wrap gap-2 text-sm" aria-label="Summary">
        <Chip>
          <strong className="font-semibold">{formatCurrency(totals.yearly)}</strong> a year
        </Chip>
        {biggest && (
          <Chip>
            Biggest: <strong className="font-semibold">{biggest.name}</strong> · {formatCurrency(biggest.monthly)}/mo
          </Chip>
        )}
        {pausedCount > 0 && <Chip>{pausedCount} paused</Chip>}
        {dueSoonCount > 0 && (
          <li className="flex items-center gap-2 rounded-lg bg-accent-soft px-3 py-1.5 font-medium text-accent">
            <span aria-hidden className="size-1.5 rounded-full bg-accent" />
            {dueSoonCount} due this week
          </li>
        )}
      </ul>
    </section>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return <li className="rounded-lg border border-border px-3 py-1.5 text-muted [&_strong]:text-foreground">{children}</li>;
}
