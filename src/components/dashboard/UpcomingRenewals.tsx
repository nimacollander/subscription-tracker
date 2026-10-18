import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency, formatDate, formatDueIn } from "@/lib/format";
import { DUE_SOON_DAYS, isDueSoon, type UpcomingRenewal } from "@/lib/renewals";

type UpcomingRenewalsProps = {
  renewals: UpcomingRenewal[];
  windowDays: number;
};

export function UpcomingRenewals({ renewals, windowDays }: UpcomingRenewalsProps) {
  const total = renewals.reduce((sum, r) => sum + r.subscription.price, 0);

  return (
    <Card title={`Upcoming renewals · next ${windowDays} days`}>
      {renewals.length === 0 ? (
        <EmptyState message={`Nothing renews in the next ${windowDays} days.`} />
      ) : (
        <>
          <ul className="-mx-2 flex flex-col" aria-label="Upcoming renewals">
            {renewals.map(({ subscription: sub, date, daysUntil }) => {
              const soon = isDueSoon(daysUntil);
              return (
                <li
                  key={sub.id}
                  className={`flex items-center justify-between gap-4 rounded-lg px-2 py-2.5 ${soon ? "bg-warning-soft" : ""}`}
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{sub.name}</p>
                    <p className="text-sm text-muted">{formatDate(date)}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-medium tabular-nums">{formatCurrency(sub.price)}</p>
                    <p className={`text-sm ${soon ? "font-medium text-warning" : "text-muted"}`}>
                      {formatDueIn(daysUntil)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 flex justify-between border-t border-border pt-3 text-sm text-muted">
            <span>
              {renewals.length} {renewals.length === 1 ? "charge" : "charges"} · highlighted within {DUE_SOON_DAYS} days
            </span>
            <span className="font-medium text-foreground tabular-nums">{formatCurrency(total)}</span>
          </p>
        </>
      )}
    </Card>
  );
}
