import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ListIcon } from "@/components/ui/icons";
import { CYCLE_LABELS, formatCurrency, formatDate, formatDueIn } from "@/lib/format";
import { isDueSoon, type UpcomingRenewal } from "@/lib/renewals";

type UpcomingRenewalsProps = {
  renewals: UpcomingRenewal[];
  windowDays: number;
};

export function UpcomingRenewals({ renewals, windowDays }: UpcomingRenewalsProps) {
  const thisWeek = renewals.filter((r) => isDueSoon(r.daysUntil));
  const later = renewals.filter((r) => !isDueSoon(r.daysUntil));
  const total = renewals.reduce((sum, r) => sum + r.subscription.price, 0);
  const weekTotal = thisWeek.reduce((sum, r) => sum + r.subscription.price, 0);
  const weekShare = total > 0 ? weekTotal / total : 0;

  return (
    <Card title="Upcoming renewals" icon={<ListIcon />} action={<span className="text-[13px] text-muted">Next {windowDays} days</span>}>
      {renewals.length === 0 ? (
        <EmptyState message={`Nothing renews in the next ${windowDays} days.`} />
      ) : (
        <>
          {/* How much of the next 30 days' spend lands this week. */}
          <div
            role="meter"
            aria-label="Share due this week"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(weekShare * 100)}
            className="h-2 overflow-hidden rounded-full bg-surface-2"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent-strong to-accent"
              style={{ width: `${weekShare * 100}%` }}
            />
          </div>
          <p className="mt-2.5 flex justify-between text-xs text-muted">
            <span>
              <span className="font-medium text-foreground">{formatCurrency(weekTotal)}</span> due this week
            </span>
            <span>
              <span className="font-medium text-foreground">{formatCurrency(total)}</span> in total
            </span>
          </p>

          <Group title="This week" renewals={thisWeek} />
          <Group title="Later" renewals={later} />
        </>
      )}
    </Card>
  );
}

function Group({ title, renewals }: { title: string; renewals: UpcomingRenewal[] }) {
  if (renewals.length === 0) return null;
  return (
    <div className="mt-5">
      <h3 className="mb-1 text-[13px] text-muted">{title}</h3>
      <ul className="flex flex-col">
        {renewals.map(({ subscription: sub, date, daysUntil }) => (
          <li key={sub.id} className="flex items-center gap-3 py-2.5">
            <Avatar name={sub.name} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-medium">{sub.name}</p>
              <p className="truncate text-[13px] text-muted">
                {CYCLE_LABELS[sub.billingCycle]} · {formatDate(date)}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[15px] font-medium tabular-nums">{formatCurrency(sub.price)}</p>
              <p className={`text-[13px] ${isDueSoon(daysUntil) ? "text-warning" : "text-muted"}`}>{formatDueIn(daysUntil)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
