import { ComingSoon } from "~/components/ui/coming-soon";
import type { DashboardHandle } from "~/layouts/dashboard-layout";

export const handle: DashboardHandle = { navbarTitle: "Analytics" };

export default function AnalyticsPage() {
  return (
    <ComingSoon
      title="Analytics"
      description="Explore how your product is performing. This page is not implemented yet."
    />
  );
}
