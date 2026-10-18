import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { CalendarIcon } from "@/components/ui/icons";
import { formatCurrency, formatDate, formatDueIn } from "@/lib/format";
import { isDueSoon, type UpcomingRenewal } from "@/lib/renewals";

type NextChargeCardProps = {
  next: UpcomingRenewal | undefined;
  next30: UpcomingRenewal[];
};

const linkButton =
  "inline-flex h-11 flex-1 items-center justify-center rounded-full px-4 text-sm font-medium whitespace-nowrap transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function NextChargeCard({ next, next30 }: NextChargeCardProps) {
  const total30 = next30.reduce((sum, r) => sum + r.subscription.price, 0);

  return (
    <section className="glow-card rounded-3xl border border-border p-5 sm:p-6">
      <h2 className="flex items-center gap-2.5 text-[15px] font-medium">
        <CalendarIcon className="size-5 text-muted" />
        Next charge
      </h2>

      {next ? (
        <>
          <div className="mt-5 flex items-end justify-between gap-4">
            <p className="text-4xl font-semibold tracking-tight">{formatCurrency(next.subscription.price)}</p>
            <span
              className={`mb-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                isDueSoon(next.daysUntil) ? "bg-warning-soft text-warning" : "bg-surface-2 text-muted"
              }`}
            >
              {formatDueIn(next.daysUntil)}
            </span>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Avatar name={next.subscription.name} size="sm" />
            <div className="min-w-0">
              <p className="truncate font-medium">{next.subscription.name}</p>
              <p className="text-[13px] text-muted">{formatDate(next.date)}</p>
            </div>
          </div>
        </>
      ) : (
        <p className="mt-5 text-sm text-muted">Nothing active is scheduled to renew.</p>
      )}

      <p className="mt-5 rounded-full bg-surface-2/80 px-3.5 py-2 text-[13px] text-muted">
        <span className="font-medium text-foreground">{formatCurrency(total30)}</span> across {next30.length}{" "}
        {next30.length === 1 ? "charge" : "charges"} in the next 30 days
      </p>

      <div className="mt-5 flex gap-2.5">
        <Link href="/subscriptions" className={`${linkButton} bg-foreground text-background hover:bg-foreground/90`}>
          Manage subscriptions
        </Link>
        <Link href="/settings" className={`${linkButton} border border-border bg-surface-2 hover:bg-surface-2/70`}>
          Back up
        </Link>
      </div>
    </section>
  );
}
