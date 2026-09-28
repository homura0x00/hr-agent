import * as React from "react";
import { cn } from "@heroui/react";

import type { SidebarState } from "~/lib/sidebar";
import { MenuIcon } from "~/components/icons";
import { SidebarBackdrop, SidebarProvider, useSidebar } from "./sidebar";

/**
 * Root shell: a horizontal flex row holding the sidebar rail plus the scrolling
 * content column. Mirrors HeroUI Pro's `app-layout` structure, rebuilt on the
 * free primitives.
 */
export function AppLayoutRoot({
  defaultState,
  sidebar,
  children,
}: {
  defaultState: SidebarState;
  /** The `<AppSidebar />` element; rendered as a flex sibling of the content. */
  sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultState={defaultState}>
      <div data-slot="sidebar-provider" data-sidebar="provider" className="flex min-h-svh w-full">
        <SidebarBackdrop />
        {sidebar}
        <div data-slot="app-layout-body" className="flex min-w-0 flex-1 flex-col">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}

export function AppLayoutHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <header data-slot="app-layout-header" className={cn("shrink-0", className)}>
      {children}
    </header>
  );
}

/**
 * Page body. Caps content at `max-w-7xl` and applies the shared vertical rhythm,
 * so route modules only render their own sections.
 */
export function AppLayoutMain({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main data-slot="app-layout-main" className="flex-1">
      <div className={cn("mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-4", className)}>
        {children}
      </div>
    </main>
  );
}

/**
 * Mobile drawer affordance. Hidden at `lg` and up, where `SidebarTrigger` takes
 * over for the collapse/expand behaviour instead.
 */
export function AppLayoutMenuToggle({ className }: { className?: string }) {
  const { setOpenMobile } = useSidebar();

  return (
    <button
      type="button"
      data-slot="app-layout-menu-toggle"
      aria-label="Open navigation"
      onClick={() => setOpenMobile(true)}
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-lg",
        "text-muted outline-none transition-colors hover:bg-surface-secondary hover:text-foreground",
        "focus-visible:ring-2 focus-visible:ring-focus lg:hidden",
        className,
      )}
    >
      <MenuIcon className="size-4" />
    </button>
  );
}

export const AppLayout = {
  Root: AppLayoutRoot,
  Header: AppLayoutHeader,
  Main: AppLayoutMain,
  MenuToggle: AppLayoutMenuToggle,
};
