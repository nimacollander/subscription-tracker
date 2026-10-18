import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { AlertIcon, ArrowRightIcon, WalletIcon } from "@/components/ui/icons";
import { getTopSubscriptionsByCost } from "@/lib/analytics";
import { formatCurrency, formatDueIn } from "@/lib/format";
import { calculateTotals } from "@/lib/pricing";
import { isDueSoon, type UpcomingRenewal } from "@/lib/renewals";
import type { Subscription } from "@/types/subscription";

type SpendOverviewProps = {
  subscriptions: Subscription[];
  upcoming: UpcomingRenewal[];
};

export function SpendOverview({ subscriptions, upcoming }: SpendOverviewProps) {
  const totals = calculateTotals(subscriptions);
  const pausedCount = subscriptions.length - totals.activeCount;
  const ranked = getTopSubscriptionsByCost(subscriptions, Infinity);
  const highest = ranked[0];
  const lowest = ranked.at(-1);
  const dueSoon = upcoming.filter((r) => isDueSoon(r.daysUntil));

  return (
    <Card title="Total monthly spend" icon={<WalletIcon />}>
      <div className="flex flex-col gap-6">
        <div>
          <p className="text-5xl font-semibold tracking-tight sm:text-[56px] sm:leading-none">
            {formatCurrency(totals.monthly)}
          </p>
          <p className="mt-3 text-sm text-muted">
            <span className="font-medium text-foreground">{formatCurrency(totals.yearly)}</span> per year · paused
            subscriptions excluded
          </p>
        </div>

        <dl className="grid grid-cols-3 gap-2 sm:gap-2.5">
          <Tile label="Active" value={String(totals.activeCount)} tag={pausedCount ? `${pausedCount} paused` : "None paused"} />
          <Tile
            label="Highest /mo"
            value={highest ? formatCurrency(highest.monthly) : "—"}
            tag={highest?.name}
            tagClass="text-accent"
          />
          <Tile
            label="Lowest /mo"
            value={lowest ? formatCurrency(lowest.monthly) : "—"}
            tag={lowest?.name}
            tagClass="text-success"
          />
        </dl>
      </div>

      {dueSoon.length > 0 && (
        <div className="gradient-banner mt-6 flex flex-col gap-3 rounded-2xl px-4 py-3 text-sm text-white sm:flex-row sm:items-center sm:justify-between sm:rounded-full sm:pl-3">
          <p className="flex items-start gap-2.5 sm:items-center">
            <AlertIcon className="mt-px size-5 shrink-0 sm:mt-0" />
            <span>{dueSoonMessage(dueSoon)}</span>
          </p>
          <Link
            href="/subscriptions"
            className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full font-medium hover:underline focus-visible:outline-2 focus-visible:outline-white sm:self-auto"
          >
            Review
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>
      )}
    </Card>
  );
}

function Tile({ label, value, tag, tagClass = "text-muted" }: { label: string; value: string; tag?: string; tagClass?: string }) {
  return (
    <div className="min-w-0 rounded-2xl border border-border bg-surface-2 px-3 py-3 sm:px-4">
      <dt className="text-[13px] whitespace-nowrap text-muted">{label}</dt>
      <dd className="mt-1 text-lg font-semibold tabular-nums sm:text-xl">{value}</dd>
      {tag && (
        <dd className={`truncate text-xs font-medium ${tagClass}`} title={tag}>
          {tag}
        </dd>
      )}
    </div>
  );
}

/** "Gym membership is due tomorrow and Netflix in 3 days." */
function dueSoonMessage(dueSoon: UpcomingRenewal[]): string {
  const parts = dueSoon.slice(0, 2).map((r, i) => {
    const when = formatDueIn(r.daysUntil).replace(/^Due /, "");
    return i === 0 ? `${r.subscription.name} is due ${when}` : `${r.subscription.name} ${when}`;
  });
  const rest = dueSoon.length - parts.length;
  const list = rest > 0 ? `${parts.join(", ")} and ${rest} more` : parts.join(" and ");
  return `${dueSoon.length === 1 ? "1 renewal" : `${dueSoon.length} renewals`} this week: ${list}.`;
}
