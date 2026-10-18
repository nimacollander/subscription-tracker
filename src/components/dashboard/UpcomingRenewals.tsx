import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency, formatDate, formatDueIn } from "@/lib/format";
import { isDueSoon, type UpcomingRenewal } from "@/lib/renewals";

type UpcomingRenewalsProps = {
  renewals: UpcomingRenewal[];
  windowDays: number;
};

export function UpcomingRenewals({ renewals, windowDays }: UpcomingRenewalsProps) {
  return (
    <Card title="Upcoming renewals">
      {renewals.length === 0 ? (
        <EmptyState message={`Nothing renews in the next ${windowDays} days.`} />
      ) : (
        <ul className="-mx-3 flex flex-col" aria-label="Upcoming renewals">
          {renewals.map(({ subscription: sub, date, daysUntil }) => {
            const soon = isDueSoon(daysUntil);
            return (
              <li
                key={sub.id}
                className={`flex items-center justify-between gap-4 rounded-xl px-3 py-3 ${soon ? "bg-warning-soft" : ""}`}
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
      )}
    </Card>
  );
}
