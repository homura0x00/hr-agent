import { Chip } from "@heroui/react";

import { LogOutIcon } from "~/components/icons";
import { PRIMARY_NAV, SECONDARY_NAV, type NavBadge } from "~/lib/navigation";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./sidebar";

/**
 * Signed-in account shown in the sidebar header. Swap for real session data once
 * authentication is wired up.
 */
const CURRENT_USER = {
  name: "Kate Moore",
  role: "Admin",
  email: "kate@acme.com",
  initials: "KM",
};

function NavBadgeChip({ badge }: { badge: NavBadge }) {
  switch (badge) {
    case "new":
      return (
        <Chip color="success" size="sm" variant="soft">
          <Chip.Label>New</Chip.Label>
        </Chip>
      );
    default:
      return null;
  }
}

/**
 * The application's sidebar: account block, primary navigation, and the pinned
 * account/help section.
 */
export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <NavUser {...CURRENT_USER} />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu label="Dashboard navigation">
            {PRIMARY_NAV.map((item) => (
              <SidebarMenuItem
                key={item.href}
                href={item.href}
                icon={<item.icon />}
                label={item.label}
                end={item.end}
                chip={item.badge ? <NavBadgeChip badge={item.badge} /> : undefined}
              />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarGroup>
          <SidebarMenu label="Account">
            {SECONDARY_NAV.map((item) => (
              <SidebarMenuItem
                key={item.href}
                href={item.href}
                icon={<item.icon />}
                label={item.label}
                end={item.end}
              />
            ))}
            <SidebarMenuButton
              icon={<LogOutIcon />}
              label="Log out"
              isDanger
              onPress={() => {
                // Replace with a real sign-out once auth is wired up.
                window.location.assign("/login");
              }}
            />
          </SidebarMenu>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
