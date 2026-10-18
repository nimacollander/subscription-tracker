import { DashboardView } from "@/components/dashboard/DashboardView";

export default function OverviewPage() {
  return (
    <>
      {/* The summary sentence is the visual headline; this keeps a page title for screen readers. */}
      <h1 className="sr-only">Overview</h1>
      <DashboardView />
    </>
  );
}
