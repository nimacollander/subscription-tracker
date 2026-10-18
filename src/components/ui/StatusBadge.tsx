import type { SubscriptionStatus } from "@/types/subscription";

export function StatusBadge({ status }: { status: SubscriptionStatus }) {
  return status === "active" ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-2.5 py-1 text-xs font-medium text-success">
      <span aria-hidden className="size-1.5 rounded-full bg-success" />
      Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1 text-xs font-medium text-muted">
      <span aria-hidden className="size-1.5 rounded-full bg-muted" />
      Paused
    </span>
  );
}
