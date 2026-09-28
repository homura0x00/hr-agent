/**
 * Sidebar state helpers shared by the layout loader (server) and the
 * `SidebarProvider` (browser).
 *
 * The expanded/collapsed preference lives in a cookie rather than localStorage so
 * the server can render the correct width on the very first paint — the layout
 * streams with SSR enabled, and reading it in a loader avoids a hydration flash.
 */

export type SidebarState = "expanded" | "collapsed";

export const SIDEBAR_COOKIE_NAME = "sidebar_state";

const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

const SIDEBAR_STATE_PATTERN = new RegExp(`(?:^|;\\s*)${SIDEBAR_COOKIE_NAME}=(expanded|collapsed)`);

/** Reads the persisted sidebar state off an incoming request's `Cookie` header. */
export function readSidebarState(request: Request): SidebarState {
  const cookieHeader = request.headers.get("Cookie") ?? "";

  return SIDEBAR_STATE_PATTERN.exec(cookieHeader)?.[1] === "collapsed" ? "collapsed" : "expanded";
}

/** Persists the sidebar state. No-ops during SSR. */
export function writeSidebarState(state: SidebarState): void {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${SIDEBAR_COOKIE_NAME}=${state}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}; samesite=lax`;
}
