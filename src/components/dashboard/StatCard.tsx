import { Card } from "@/components/ui/Card";

type StatCardProps = {
  label: string;
  value: string;
  hint?: React.ReactNode;
  /** Smaller value text, for words rather than numbers. */
  compact?: boolean;
};

export function StatCard({ label, value, hint, compact }: StatCardProps) {
  return (
    <Card title={label}>
      <p
        title={value}
        className={`truncate font-semibold tracking-tight tabular-nums ${compact ? "text-xl leading-9" : "text-2xl sm:text-3xl"}`}
      >
        {value}
      </p>
      {hint && <p className="mt-1 truncate text-sm text-muted">{hint}</p>}
    </Card>
  );
}

export function StatCardSkeleton() {
  return <div aria-hidden className="h-[118px] animate-pulse rounded-xl border border-border bg-surface" />;
}
