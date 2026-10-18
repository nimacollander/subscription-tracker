import { formatCurrency, formatDueIn, formatMonthYear } from "@/lib/format";
import { calculateTotals } from "@/lib/pricing";
import type { UpcomingRenewal } from "@/lib/renewals";
import type { Subscription } from "@/types/subscription";

type HeroSummaryProps = {
  subscriptions: Subscription[];
  nextRenewal: UpcomingRenewal | undefined;
  next30: UpcomingRenewal[];
  today: string;
};

export function HeroSummary({ subscriptions, nextRenewal, next30, today }: HeroSummaryProps) {
  const totals = calculateTotals(subscriptions);
  const pausedCount = subscriptions.length - totals.activeCount;
  const dueIn30 = next30.reduce((sum, r) => sum + r.subscription.price, 0);

  return (
    <section aria-labelledby="hero-title">
      <p className="font-label text-muted">
        {formatMonthYear(today)} · {totals.activeCount} active
        {pausedCount > 0 && ` · ${pausedCount} paused`}
      </p>

      {/* The headline is the product's answer: what this month of subscriptions costs. */}
      <h2 id="hero-title" className="mt-5 font-display font-extrabold">
        <span className="block text-2xl leading-none text-muted sm:text-4xl">You pay</span>
        <span className="mt-2 flex flex-wrap items-baseline gap-x-4">
          <span className="text-[clamp(2.75rem,12.5vw,7.5rem)] leading-[0.9]">
            {formatCurrency(totals.monthly)}
          </span>
          <span className="text-2xl leading-none text-muted sm:text-4xl">a month</span>
        </span>
      </h2>

      <dl className="mt-10 grid gap-6 border-t border-border pt-6 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-border">
        <Figure label="Per year" value={formatCurrency(totals.yearly)} detail="Active subscriptions only" />
        <Figure
          label="Next charge"
          value={nextRenewal ? nextRenewal.subscription.name : "—"}
          detail={
            nextRenewal
              ? `${formatDueIn(nextRenewal.daysUntil)} · ${formatCurrency(nextRenewal.subscription.price)}`
              : "Nothing active"
          }
        />
        <Figure
          label="Next 30 days"
          value={formatCurrency(dueIn30)}
          detail={`${next30.length} ${next30.length === 1 ? "charge" : "charges"}`}
        />
      </dl>
    </section>
  );
}

function Figure({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="min-w-0 sm:px-6 sm:first:pl-0 sm:last:pr-0">
      <dt className="font-label text-muted">{label}</dt>
      <dd className="mt-2 truncate font-display text-2xl font-bold" title={value}>
        {value}
      </dd>
      <dd className="mt-1 truncate text-sm text-muted">{detail}</dd>
    </div>
  );
}
