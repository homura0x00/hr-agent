import * as React from "react";
import { useLocation } from "react-router";

import { useIsMobile } from "~/hooks/use-mobile";
import { writeSidebarState, type SidebarState } from "~/lib/sidebar";

type SidebarContextValue = {
  /** Desktop collapse state. On mobile the sidebar always renders full width. */
  state: SidebarState;
  isMobile: boolean;
  /** Whether the mobile off-canvas drawer is open. */
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  /** Collapses/expands on desktop, opens/closes the drawer on mobile. */
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

export function useSidebar(): SidebarContextValue {
  const context = React.useContext(SidebarContext);

  if (!context) {
    throw new Error("useSidebar must be used within a <SidebarProvider>.");
  }

  return context;
}

export function SidebarProvider({
  defaultState,
  children,
}: {
  /** Server-read cookie value, so first paint matches the persisted preference. */
  defaultState: SidebarState;
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  const [state, setState] = React.useState<SidebarState>(defaultState);
  const [openMobile, setOpenMobile] = React.useState(false);
  const { pathname } = useLocation();

  const toggleSidebar = React.useCallback(() => {
    if (isMobile) {
      setOpenMobile((open) => !open);
      return;
    }

    setState((previous) => {
      const next: SidebarState = previous === "expanded" ? "collapsed" : "expanded";

      writeSidebarState(next);

      return next;
    });
  }, [isMobile]);

  // Navigating away should dismiss the mobile drawer.
  React.useEffect(() => {
    setOpenMobile(false);
  }, [pathname]);

  const value = React.useMemo<SidebarContextValue>(
    () => ({ state, isMobile, openMobile, setOpenMobile, toggleSidebar }),
    [state, isMobile, openMobile, toggleSidebar],
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}
