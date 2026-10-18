import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CYCLE_SUFFIXES, formatCurrency, formatDate, formatDueIn } from "@/lib/format";
import { toMonthlyPrice } from "@/lib/pricing";
import { daysUntilRenewal, getNextRenewalDate, isDueSoon } from "@/lib/renewals";
import type { Subscription } from "@/types/subscription";

/**
 * Shared by the header and every row so the columns line up. Applies once the
 * list's container is wide enough (container query); narrower, rows become cards.
 */
export const ROW_COLUMNS = "@3xl:grid-cols-[minmax(0,1fr)_8.5rem_9.5rem_6.5rem_13rem]";

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
  const dim = isPaused ? "opacity-60" : "";

  return (
    <li
      className={`grid grid-cols-2 items-center gap-x-4 gap-y-3 border-t border-border px-5 py-4 first:border-t-0 transition-colors hover:bg-surface-2/40 sm:px-6 @3xl:gap-6 ${ROW_COLUMNS}`}
    >
      <div className={`col-span-2 flex min-w-0 items-center gap-3 @3xl:col-span-1 ${dim}`}>
        <Avatar name={sub.name} />
        <div className="min-w-0">
          <h3 className="truncate font-medium">{sub.name}</h3>
          <p className="truncate text-[13px] text-muted">
            {sub.category}
            {sub.notes && ` · ${sub.notes}`}
          </p>
        </div>
      </div>

      <div className={dim}>
        <p className="font-semibold tabular-nums">
          {formatCurrency(sub.price)}
          <span className="text-[13px] font-normal text-muted">{CYCLE_SUFFIXES[sub.billingCycle]}</span>
        </p>
        {sub.billingCycle !== "monthly" && (
          <p className="text-xs text-muted tabular-nums">≈ {formatCurrency(toMonthlyPrice(sub.price, sub.billingCycle))}/mo</p>
        )}
      </div>

      <div className={dim}>
        {isPaused ? (
          <p className="text-sm text-muted">Not renewing</p>
        ) : (
          <>
            <p className="text-sm">{formatDate(nextDate)}</p>
            <p className={`text-xs ${isDueSoon(days) ? "font-medium text-warning" : "text-muted"}`}>{formatDueIn(days)}</p>
          </>
        )}
      </div>

      <div className="@max-3xl:hidden">
        <StatusBadge status={sub.status} />
      </div>

      <div className="col-span-2 -mx-2 flex gap-1 @3xl:col-span-1 @3xl:mx-0 @3xl:justify-end">
        <Button size="sm" variant="ghost" onClick={onEdit} aria-label={`Edit ${sub.name}`}>
          Edit
        </Button>
        <Button size="sm" variant="ghost" onClick={onToggleStatus} aria-label={`${isPaused ? "Resume" : "Pause"} ${sub.name}`}>
          {isPaused ? "Resume" : "Pause"}
        </Button>
        <Button size="sm" variant="ghost-danger" onClick={onDelete} aria-label={`Delete ${sub.name}`}>
          Delete
        </Button>
      </div>
    </li>
  );
}
