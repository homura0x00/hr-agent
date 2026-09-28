import { Outlet, useMatches } from "react-router";
import { Button } from "@heroui/react";

import { BellIcon, PlusIcon, SearchIcon } from "~/components/icons";
import { AppLayout } from "~/components/layout/app-layout";
import { AppSidebar } from "~/components/layout/app-sidebar";
import { Navbar } from "~/components/layout/navbar";
import { SidebarTrigger } from "~/components/layout/sidebar";
import { readSidebarState } from "~/lib/sidebar";
import type { Route } from "./+types/dashboard-layout";

/**
 * Static metadata a child route can declare to drive the shared navbar.
 * Declared via the route's `handle` export.
 */
export type DashboardHandle = {
  /** Title shown in the navbar. Routes that omit it fall back to the greeting. */
  navbarTitle?: string;
};

const CURRENT_USER_FIRST_NAME = "Kate";

function greetingForHour(hour: number): string {
  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 18) {
    return "Good afternoon";
  }

  return "Good evening";
}

export function loader({ request }: Route.LoaderArgs) {
  // `greeting` is computed on the server so the navbar text is identical on
  // hydration — deriving it during render would risk a mismatch at hour boundaries.
  return {
    sidebarState: readSidebarState(request),
    greeting: greetingForHour(new Date().getHours()),
  };
}

export default function DashboardLayout({ loaderData }: Route.ComponentProps) {
  const { sidebarState, greeting } = loaderData;
  const matches = useMatches();

  // The innermost route that declared a title wins; the index route declares
  // none, so it keeps the time-of-day greeting.
  const declaredTitle = [...matches]
    .reverse()
    .map((match) => (match.handle as DashboardHandle | undefined)?.navbarTitle)
    .find((title) => Boolean(title));

  const title = declaredTitle ?? `${greeting}, ${CURRENT_USER_FIRST_NAME}`;

  return (
    <AppLayout.Root defaultState={sidebarState} sidebar={<AppSidebar />}>
      <AppLayout.Header>
        <Navbar.Root>
          <Navbar.Header>
            <AppLayout.MenuToggle />
            <SidebarTrigger className="hidden lg:inline-flex" />
            <Navbar.Title>{title}</Navbar.Title>
            <Navbar.Spacer />
            <Navbar.Actions>
              <Button isIconOnly size="sm" variant="tertiary" aria-label="Search">
                <SearchIcon className="size-4" />
              </Button>
              <Button isIconOnly size="sm" variant="tertiary" aria-label="Notifications">
                <BellIcon className="size-4" />
              </Button>
              <Button size="sm" variant="primary">
                <PlusIcon className="size-4" />
                Invite
              </Button>
            </Navbar.Actions>
          </Navbar.Header>
        </Navbar.Root>
      </AppLayout.Header>

      <AppLayout.Main>
        <Outlet />
      </AppLayout.Main>
    </AppLayout.Root>
  );
}
