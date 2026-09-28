import { ComingSoon } from "~/components/ui/coming-soon";
import type { DashboardHandle } from "~/layouts/dashboard-layout";

export const handle: DashboardHandle = { navbarTitle: "Tracker" };

export default function TrackerPage() {
  return (
    <ComingSoon
      title="Tracker"
      description="Track work across your team. This page is not implemented yet."
    />
  );
}
