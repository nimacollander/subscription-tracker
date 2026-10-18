import type { Metadata } from "next";
import { DataTransfer } from "@/components/settings/DataTransfer";
import { ThemePicker } from "@/components/settings/ThemePicker";
import { Card } from "@/components/ui/Card";
import { SettingsIcon, ShieldIcon } from "@/components/ui/icons";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Settings · Subscription Tracker",
};

export default function SettingsPage() {
  return (
    <div className="flex max-w-3xl flex-col gap-8">
      <PageHeader title="Settings" description="Appearance and your data." />

      <Card title="Appearance" icon={<SettingsIcon />}>
        <ThemePicker />
      </Card>

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
