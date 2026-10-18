import { StatCard } from "@/components/dashboard/StatCard";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">
          An overview of your recurring payments.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Monthly spend" value="—" hint="No subscriptions yet" />
        <StatCard label="Yearly spend" value="—" hint="No subscriptions yet" />
        <StatCard label="Active subscriptions" value="0" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Upcoming renewals">
          <EmptyState message="Renewals will appear here." />
        </Card>
        <Card title="Spend by category">
          <EmptyState message="A chart will appear here." />
        </Card>
      </div>
    </div>
  );
}
