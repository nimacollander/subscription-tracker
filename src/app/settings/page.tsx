import type { Metadata } from "next";
import { DataTransfer } from "@/components/settings/DataTransfer";
import { ThemePicker } from "@/components/settings/ThemePicker";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Settings · Subscription Tracker",
};

export default function SettingsPage() {
  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted">Appearance and your data.</p>
      </div>

      <Card title="Appearance">
        <ThemePicker />
      </Card>

      <Card title="Data">
        <p className="mb-4 text-sm text-muted">
          Your subscriptions are stored only in this browser. Export a JSON backup to keep them safe or move them
          to another device, then import it there.
        </p>
        <DataTransfer />
      </Card>
    </div>
  );
}
