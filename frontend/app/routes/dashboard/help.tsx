import { ComingSoon } from "~/components/ui/coming-soon";
import type { DashboardHandle } from "~/layouts/dashboard-layout";

export const handle: DashboardHandle = { navbarTitle: "Help & Information" };

export default function HelpPage() {
  return (
    <ComingSoon
      title="Help & Information"
      description="Find answers, contact support, or dig into the docs. This page is not implemented yet."
    />
  );
}
