import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import { StackIcon } from "@/components/ui/icons";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { CYCLE_LABELS, formatCurrency, formatDate } from "@/lib/format";
import { getNextRenewalDate } from "@/lib/renewals";
import type { Subscription } from "@/types/subscription";

type SubscriptionTableProps = {
  subscriptions: Subscription[];
  today: string;
  /** How many there are in total, for the "View all" link. */
  totalCount: number;
};

/** A read-only preview of the list; editing happens on the Subscriptions page. */
export function SubscriptionTable({ subscriptions, today, totalCount }: SubscriptionTableProps) {
  return (
    <Card
      className="h-full"
      title="Subscriptions"
      icon={<StackIcon />}
      action={
        <Link href="/subscriptions" className="text-sm font-medium text-muted hover:text-accent focus-visible:outline-2 focus-visible:outline-accent">
          View all {totalCount}
        </Link>
      }
    >
      {/* Scrolls sideways on narrow screens instead of crushing the columns. */}
      <div className="-mx-5 overflow-x-auto px-5 sm:-mx-6 sm:px-6">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead>
            <tr className="text-xs tracking-wide text-muted uppercase">
              <th scope="col" className="pb-3 font-medium">Service</th>
              <th scope="col" className="pb-3 font-medium">Billing</th>
              <th scope="col" className="pb-3 font-medium">Next billing</th>
              <th scope="col" className="pb-3 text-right font-medium">Amount</th>
              <th scope="col" className="pb-3 pl-6 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub) => (
              <tr key={sub.id} className="border-t border-border">
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={sub.name} size="sm" />
                    <div className="min-w-0">
                      <p className="truncate font-medium">{sub.name}</p>
                      <p className="truncate text-[13px] text-muted">{sub.category}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 pr-4">{CYCLE_LABELS[sub.billingCycle]}</td>
                <td className="py-3 pr-4 text-muted">
                  {sub.status === "paused" ? "—" : formatDate(getNextRenewalDate(sub.nextBillingDate, sub.billingCycle, today))}
                </td>
                <td className="py-3 text-right font-medium tabular-nums">{formatCurrency(sub.price)}</td>
                <td className="py-3 pl-6">
                  <StatusBadge status={sub.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
