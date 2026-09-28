import { ComingSoon } from "~/components/ui/coming-soon";
import type { DashboardHandle } from "~/layouts/dashboard-layout";

export const handle: DashboardHandle = { navbarTitle: "Settings" };

export default function SettingsPage() {
  return (
    <ComingSoon
      title="Settings"
      description="Manage your organization profile and preferences. This page is not implemented yet."
    />
  );
}
