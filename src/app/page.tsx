import { DashboardView } from "@/components/dashboard/DashboardView";
import { PageHeader } from "@/components/ui/PageHeader";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Dashboard" description="Your recurring spend and what renews next." />
      <DashboardView />
    </div>
  );
}
