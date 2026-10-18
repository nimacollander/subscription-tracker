import type { Metadata } from "next";
import { DataTransfer } from "@/components/settings/DataTransfer";
import { Card } from "@/components/ui/Card";
import { ShieldIcon } from "@/components/ui/icons";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Settings · Subscription Tracker",
};

export default function SettingsPage() {
  return (
    <div className="flex max-w-3xl flex-col gap-8">
      <PageHeader title="Settings" description="Back up, restore, or move your data." />

      <Card title="Data" icon={<ShieldIcon />}>
        <p className="mb-4 text-sm text-muted">
          Your subscriptions are stored only in this browser. Export a JSON backup to keep them safe or move them
          to another device, then import it there.
        </p>
        <DataTransfer />
      </Card>
    </div>
  );
}
