import { Avatar } from "@/components/ui/Avatar";
import { getTopSubscriptionsByCost } from "@/lib/analytics";
import { formatCurrency, formatDate, formatDueIn, formatMonthYear } from "@/lib/format";
import { calculateTotals } from "@/lib/pricing";
import { isDueSoon, type UpcomingRenewal } from "@/lib/renewals";
import type { Subscription } from "@/types/subscription";

type OverviewHeaderProps = {
  subscriptions: Subscription[];
  upcoming: UpcomingRenewal[];
  /** The very next charge, however far away. */
  next: UpcomingRenewal | undefined;
  today: string;
};

/** The dashboard opens with its answer as a sentence, then a few supporting facts. */
export function OverviewHeader({ subscriptions, upcoming, next, today }: OverviewHeaderProps) {
  const totals = calculateTotals(subscriptions);
  const pausedCount = subscriptions.length - totals.activeCount;
  const biggest = getTopSubscriptionsByCost(subscriptions, 1)[0];
  const dueSoonCount = upcoming.filter((r) => isDueSoon(r.daysUntil)).length;

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-10">
      <div className="min-w-0">
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
      </div>

      {next && <NextCharge next={next} />}
    </section>
  );
}

function NextCharge({ next }: { next: UpcomingRenewal }) {
  const soon = isDueSoon(next.daysUntil);
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 lg:w-72">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted">Next charge</p>
        <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${soon ? "bg-accent-soft text-accent" : "bg-surface-2 text-muted"}`}>
          {formatDueIn(next.daysUntil)}
        </span>
      </div>
      <p className="mt-3 font-display text-3xl font-semibold tracking-tight">{formatCurrency(next.subscription.price)}</p>
      <div className="mt-3 flex items-center gap-2.5">
        <Avatar name={next.subscription.name} size="sm" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{next.subscription.name}</p>
          <p className="text-xs text-muted">{formatDate(next.date)}</p>
        </div>
      </div>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return <li className="rounded-lg border border-border px-3 py-1.5 text-muted [&_strong]:text-foreground">{children}</li>;
}
