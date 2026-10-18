import { Button } from "@/components/ui/Button";
import { CYCLE_SUFFIXES, formatCurrency, formatDate, formatDaysUntil } from "@/lib/format";
import { toMonthlyPrice } from "@/lib/pricing";
import { daysUntilRenewal, getNextRenewalDate } from "@/lib/renewals";
import type { Subscription } from "@/types/subscription";

type SubscriptionRowProps = {
  subscription: Subscription;
  today: string;
  onEdit: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
};

export function SubscriptionRow({ subscription: sub, today, onEdit, onToggleStatus, onDelete }: SubscriptionRowProps) {
  const isPaused = sub.status === "paused";
  const nextDate = getNextRenewalDate(sub.nextBillingDate, sub.billingCycle, today);
  const days = daysUntilRenewal(sub.nextBillingDate, sub.billingCycle, today);

  return (
    <li className="grid gap-3 rounded-xl border border-border bg-surface p-4 sm:grid-cols-[minmax(0,1fr)_8rem_9rem_auto] sm:items-center sm:gap-6">
      <div className={`min-w-0 ${isPaused ? "opacity-60" : ""}`}>
        <div className="flex items-center gap-2">
          <h3 className="truncate font-medium">{sub.name}</h3>
          {isPaused && (
            <span className="rounded-full bg-border px-2 py-0.5 text-xs font-medium text-muted">Paused</span>
          )}
        </div>
        <p className="truncate text-sm text-muted">
          {sub.category}
          {sub.notes && ` · ${sub.notes}`}
        </p>
      </div>

      <div className={isPaused ? "opacity-60" : ""}>
        <p className="font-medium tabular-nums">
          {formatCurrency(sub.price)}
          <span className="text-sm font-normal text-muted">{CYCLE_SUFFIXES[sub.billingCycle]}</span>
        </p>
        {sub.billingCycle !== "monthly" && (
          <p className="text-xs text-muted tabular-nums">
            ≈ {formatCurrency(toMonthlyPrice(sub.price, sub.billingCycle))}/mo
          </p>
        )}
      </div>

      <div className={isPaused ? "opacity-60" : ""}>
        {isPaused ? (
          <p className="text-sm text-muted">Not renewing</p>
        ) : (
          <>
            <p className="text-sm">{formatDate(nextDate)}</p>
            <p className={`text-xs ${days <= 3 ? "font-medium text-accent" : "text-muted"}`}>
              {formatDaysUntil(days)}
            </p>
          </>
        )}
      </div>

      <div className="flex gap-1 sm:justify-end">
        <Button size="sm" variant="ghost" onClick={onEdit} aria-label={`Edit ${sub.name}`}>
          Edit
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onToggleStatus}
          aria-label={`${isPaused ? "Resume" : "Pause"} ${sub.name}`}
        >
          {isPaused ? "Resume" : "Pause"}
        </Button>
        <Button
          size="sm"
          variant="ghost-danger"
          onClick={onDelete}
          aria-label={`Delete ${sub.name}`}
        >
          Delete
        </Button>
      </div>
    </li>
  );
}
