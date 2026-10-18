import type { SubscriptionStatus } from "@/types/subscription";

export function StatusBadge({ status }: { status: SubscriptionStatus }) {
  const active = status === "active";
  return (
    <span className={`inline-flex items-center gap-2 text-[13px] font-medium ${active ? "text-success" : "text-muted"}`}>
      <span aria-hidden className={`size-2 rounded-full ${active ? "bg-success" : "border border-muted"}`} />
      {active ? "Active" : "Paused"}
    </span>
  );
}
