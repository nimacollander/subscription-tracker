import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ListIcon } from "@/components/ui/icons";
import { CYCLE_LABELS, formatCurrency, formatDueIn } from "@/lib/format";
import { parseISODate } from "@/lib/dates";
import { isDueSoon, type UpcomingRenewal } from "@/lib/renewals";

const MAX_ITEMS = 8;

/** The next few charges, each with a tear-off-calendar date tile. */
export function ComingUp({ renewals }: { renewals: UpcomingRenewal[] }) {
  const items = renewals.slice(0, MAX_ITEMS);

  return (
    <Card
      title="Coming up"
      icon={<ListIcon />}
      className="h-full"
      action={
        <Link href="/subscriptions" className="text-sm font-medium text-muted hover:text-accent focus-visible:outline-2 focus-visible:outline-accent">
          All
        </Link>
      }
    >
      {items.length === 0 ? (
        <EmptyState message="Nothing active is scheduled to renew." />
      ) : (
        <ul className="flex flex-col gap-1">
          {items.map(({ subscription: sub, date, daysUntil }) => {
            const soon = isDueSoon(daysUntil);
            const day = parseISODate(date);
            return (
              <li key={sub.id} className="flex items-center gap-3.5 rounded-xl py-2">
                <span
                  className={`flex w-11 shrink-0 flex-col items-center overflow-hidden rounded-lg border text-center ${
                    soon ? "border-accent/50" : "border-border"
                  }`}
                  aria-hidden
                >
                  <span className={`w-full py-0.5 text-[10px] font-semibold uppercase ${soon ? "bg-accent text-on-accent" : "bg-surface-2 text-muted"}`}>
                    {new Intl.DateTimeFormat(undefined, { month: "short", timeZone: "UTC" }).format(day)}
                  </span>
                  <span className="py-1 font-display text-lg leading-none font-semibold">{day.getUTCDate()}</span>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{sub.name}</p>
                  <p className="truncate text-[13px] text-muted">{CYCLE_LABELS[sub.billingCycle]}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-semibold tabular-nums">{formatCurrency(sub.price)}</p>
                  <p className={`text-[13px] ${soon ? "font-medium text-accent" : "text-muted"}`}>{formatDueIn(daysUntil)}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
