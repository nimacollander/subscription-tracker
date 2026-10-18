import { Button } from "@/components/ui/Button";
import { CYCLE_SUFFIXES, formatCurrency, formatDate, formatDueIn } from "@/lib/format";
import { toMonthlyPrice } from "@/lib/pricing";
import { daysUntilRenewal, getNextRenewalDate, isDueSoon } from "@/lib/renewals";
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
    // Layout follows the list's width (container query), not the viewport, because
    // the sidebar takes space from md up. Narrow: name, then price | date, then actions.
    <li className="grid grid-cols-2 gap-3 rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-foreground/25 sm:px-5 @2xl:grid-cols-[minmax(0,1fr)_8rem_9rem_auto] @2xl:items-center @2xl:gap-6">
      <div className={`col-span-2 min-w-0 @2xl:col-span-1 ${isPaused ? "opacity-60" : ""}`}>
        <div className="flex items-center gap-2">
          <h3 className="truncate font-semibold">{sub.name}</h3>
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
        <p className="font-display text-lg leading-tight font-bold tabular-nums">
          {formatCurrency(sub.price)}
          <span className="font-sans text-sm font-normal tracking-normal text-muted">{CYCLE_SUFFIXES[sub.billingCycle]}</span>
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
            <p className={`text-xs ${isDueSoon(days) ? "font-medium text-warning" : "text-muted"}`}>
              {formatDueIn(days)}
            </p>
          </>
        )}
      </div>

      <div className="col-span-2 -mx-2 flex gap-1 @2xl:col-span-1 @2xl:mx-0 @2xl:justify-end">
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
