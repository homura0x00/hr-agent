import type { ComponentType } from "react";

import {
  ActivityIcon,
  ChartColumnIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  ShoppingCartIcon,
  type IconProps,
} from "~/components/icons";

/** Trailing badge shown next to a nav label while the sidebar is expanded. */
export type NavBadge = "new";

export type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<IconProps>;
  badge?: NavBadge;
  /** Match the path exactly — required for index routes. */
  end?: boolean;
};

/** Main navigation, rendered in the sidebar's scrollable content area. */
export const PRIMARY_NAV: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboardIcon, end: true },
  { href: "/orders", label: "Orders", icon: ShoppingCartIcon },
  { href: "/tracker", label: "Tracker", icon: ActivityIcon, badge: "new" },
  { href: "/analytics", label: "Analytics", icon: ChartColumnIcon },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
];

/** Secondary navigation, pinned to the sidebar footer. */
export const SECONDARY_NAV: NavItem[] = [
  { href: "/help", label: "Help & Information", icon: HelpCircleIcon },
];
