import { DashboardView } from "@/components/dashboard/DashboardView";

export default function DashboardPage() {
  return (
    <>
      {/* The hero sentence is the visual headline; this keeps a page title for screen readers. */}
      <h1 className="sr-only">Dashboard</h1>
      <DashboardView />
    </>
  );
}
