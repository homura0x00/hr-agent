import * as React from "react";
import { Link, useLocation } from "react-router";
import { ScrollShadow, cn } from "@heroui/react";

import { PanelLeftIcon } from "~/components/icons";
import { useSidebar } from "./sidebar-context";

/* -------------------------------------------------------------------- provider */

export { SidebarProvider, useSidebar } from "./sidebar-context";

/* ----------------------------------------------------------------------- shell */

export function SidebarBackdrop() {
  const { isMobile, openMobile, setOpenMobile } = useSidebar();

  if (!isMobile || !openMobile) {
    return null;
  }

  return (
    <div
      data-slot="sidebar-backdrop"
      aria-hidden="true"
      onClick={() => setOpenMobile(false)}
      className="fixed inset-0 z-40 bg-black/50 lg:hidden"
    />
  );
}

export function Sidebar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { state, isMobile, openMobile } = useSidebar();

  return (
    <aside
      data-slot="sidebar"
      data-state={isMobile ? (openMobile ? "expanded" : "collapsed") : state}
      data-collapsible={isMobile ? "offcanvas" : "icon"}
      data-side="left"
      data-variant="sidebar"
      className={cn(
        "group/sidebar z-50 flex flex-col border-r border-border bg-surface",
        "transition-[width,transform] duration-200 ease-linear",
        isMobile
          ? cn(
              "fixed inset-y-0 left-0 h-svh w-64 shadow-xl",
              openMobile ? "translate-x-0" : "-translate-x-full",
            )
          : cn("sticky top-0 h-svh shrink-0", state === "expanded" ? "w-64" : "w-12"),
        className,
      )}
    >
      {children}
    </aside>
  );
}

export function SidebarHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div data-slot="sidebar-header" className={cn("flex shrink-0 flex-col gap-2 p-2", className)}>
      {children}
    </div>
  );
}

export function SidebarContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <ScrollShadow
      orientation="vertical"
      hideScrollBar
      className={cn("flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-2 py-1", className)}
    >
      {children}
    </ScrollShadow>
  );
}

export function SidebarFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn("flex shrink-0 flex-col gap-2 px-2 pb-2", className)}
    >
      {children}
    </div>
  );
}

/* ----------------------------------------------------------------------- group */

export function SidebarGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div data-slot="sidebar-group" className={cn("flex flex-col gap-1", className)}>
      {children}
    </div>
  );
}

export function SidebarGroupLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      data-slot="sidebar-group-label"
      className={cn(
        "px-2 pt-1 pb-0.5 text-xs font-medium text-muted",
        "group-data-[state=collapsed]/sidebar:hidden",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------------ menu */

export function SidebarMenu({
  children,
  label,
  className,
}: {
  children: React.ReactNode;
  /** Accessible name for the navigation landmark. */
  label: string;
  className?: string;
}) {
  return (
    <nav
      data-slot="sidebar-menu"
      aria-label={label}
      className={cn("flex flex-col gap-1", className)}
    >
      {children}
    </nav>
  );
}

/**
 * Shared row styling for every sidebar entry so links and actions line up.
 */
function sidebarItemClasses(isActive: boolean, isCollapsed: boolean) {
  return cn(
    "flex h-8 w-full items-center gap-2 rounded-lg px-2 text-sm outline-none",
    "transition-colors focus-visible:ring-2 focus-visible:ring-focus",
    isCollapsed && "justify-center px-0",
    isActive
      ? "bg-surface-secondary font-medium text-foreground"
      : "text-muted hover:bg-surface-secondary hover:text-foreground",
  );
}

function SidebarItemContent({
  icon,
  label,
  isCollapsed,
  trailing,
}: {
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
  trailing?: React.ReactNode;
}) {
  return (
    <>
      <span
        data-slot="sidebar-menu-icon"
        className="flex size-4 shrink-0 items-center justify-center [&>svg]:size-4"
      >
        {icon}
      </span>
      <span
        data-slot="sidebar-menu-label"
        // `sr-only` rather than `hidden` in the rail: `display: none` would strip
        // the label from the accessibility tree and leave the link unnamed.
        className={cn("flex-1 truncate text-left", isCollapsed && "sr-only")}
      >
        {label}
      </span>
      {trailing ? (
        <span data-slot="sidebar-menu-chip" className={cn("shrink-0", isCollapsed && "hidden")}>
          {trailing}
        </span>
      ) : null}
    </>
  );
}

export function SidebarMenuItem({
  href,
  icon,
  label,
  chip,
  end = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  /** Optional trailing badge, hidden while the sidebar is collapsed. */
  chip?: React.ReactNode;
  /** Match the path exactly — used by index routes. */
  end?: boolean;
}) {
  const { state, isMobile, setOpenMobile } = useSidebar();
  const { pathname } = useLocation();

  const isActive = end ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  // The icon rail only exists on desktop.
  const isCollapsed = !isMobile && state === "collapsed";

  // In the rail the label is visually hidden, so a native tooltip carries it on
  // hover. Wrapping the link in an ARIA tooltip trigger would nest interactive
  // controls and add a redundant tab stop, so `title` is used instead.
  return (
    <Link
      to={href}
      data-slot="sidebar-menu-item"
      data-active={isActive ? "true" : undefined}
      aria-current={isActive ? "page" : undefined}
      title={isCollapsed ? label : undefined}
      onClick={() => {
        if (isMobile) {
          setOpenMobile(false);
        }
      }}
      className={sidebarItemClasses(isActive, isCollapsed)}
    >
      <SidebarItemContent icon={icon} label={label} isCollapsed={isCollapsed} trailing={chip} />
    </Link>
  );
}

/**
 * Non-navigational sidebar row, for actions such as logging out.
 */
export function SidebarMenuButton({
  icon,
  label,
  onPress,
  isDanger = false,
}: {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
  isDanger?: boolean;
}) {
  const { state, isMobile } = useSidebar();
  const isCollapsed = !isMobile && state === "collapsed";

  return (
    <button
      type="button"
      data-slot="sidebar-menu-item"
      title={isCollapsed ? label : undefined}
      onClick={onPress}
      className={cn(
        sidebarItemClasses(false, isCollapsed),
        isDanger && "hover:bg-danger-soft hover:text-danger-soft-foreground",
      )}
    >
      <SidebarItemContent icon={icon} label={label} isCollapsed={isCollapsed} />
    </button>
  );
}

/* --------------------------------------------------------------------- trigger */

/**
 * Toggles the sidebar. On desktop this collapses the rail; on mobile it opens the
 * off-canvas drawer, which is why the drawer also gets a dedicated visible
 * affordance (`AppLayout.MenuToggle`) while this one is hidden below `lg`.
 */
export function SidebarTrigger({ className }: { className?: string }) {
  const { toggleSidebar, state, isMobile } = useSidebar();

  return (
    <button
      type="button"
      data-slot="sidebar-trigger"
      onClick={toggleSidebar}
      aria-label={
        isMobile ? "Open navigation" : state === "expanded" ? "Collapse sidebar" : "Expand sidebar"
      }
      aria-expanded={isMobile ? undefined : state === "expanded"}
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-lg",
        "text-muted outline-none transition-colors hover:bg-surface-secondary hover:text-foreground",
        "focus-visible:ring-2 focus-visible:ring-focus",
        className,
      )}
    >
      <PanelLeftIcon className="size-4" />
    </button>
  );
}
