import * as React from "react";
import { Avatar, Button, Dropdown, Label, cn, useTheme } from "@heroui/react";

import { MonitorIcon, MoonIcon, SunIcon } from "~/components/icons";
import { useSidebar } from "./sidebar";

export type NavUserProps = {
  name: string;
  role: string;
  email: string;
  /** Two-letter fallback shown when no avatar image is available. */
  initials: string;
  avatarSrc?: string;
};

/**
 * Account block pinned to the top of the sidebar. Doubles as the theme switcher
 * and the sign-out entry point, mirroring the user block in the HeroUI Pro
 * dashboard shell.
 */
export function NavUser({ name, role, email, initials, avatarSrc }: NavUserProps) {
  const { state, isMobile } = useSidebar();
  const { theme, setTheme } = useTheme("system");
  const isCollapsed = !isMobile && state === "collapsed";

  const themeOptions = [
    { id: "light", label: "Light", icon: SunIcon },
    { id: "dark", label: "Dark", icon: MoonIcon },
    { id: "system", label: "System", icon: MonitorIcon },
  ] as const;

  return (
    <Dropdown>
      <Button
        variant="ghost"
        aria-label={`Account menu for ${name}`}
        className={cn(
          "h-auto w-full gap-2 px-1 py-1",
          isCollapsed ? "justify-center px-0" : "justify-start",
        )}
      >
        <Avatar size="sm" className="size-9 shrink-0">
          {avatarSrc ? <Avatar.Image alt={name} src={avatarSrc} /> : null}
          <Avatar.Fallback>{initials}</Avatar.Fallback>
        </Avatar>
        <span
          data-sidebar="label"
          className={cn("flex min-w-0 flex-col items-start", isCollapsed && "hidden")}
        >
          <span className="max-w-full truncate text-sm leading-tight font-medium text-foreground">
            {name}
          </span>
          <span className="max-w-full truncate text-xs leading-tight font-medium text-muted">
            {role}
          </span>
        </span>
      </Button>
      <Dropdown.Popover>
        <Dropdown.Menu
          onAction={(key) => {
            if (key === "logout") {
              // Replace with a real sign-out once auth is wired up.
              window.location.assign("/");
              return;
            }

            const next = themeOptions.find((option) => option.id === key);

            if (next) {
              setTheme(next.id);
            }
          }}
        >
          <Dropdown.Item id="account" textValue={email} className="gap-2">
            <Avatar size="sm" className="size-8 shrink-0">
              {avatarSrc ? <Avatar.Image alt={name} src={avatarSrc} /> : null}
              <Avatar.Fallback>{initials}</Avatar.Fallback>
            </Avatar>
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium">{name}</span>
              <span className="truncate text-xs text-muted">{email}</span>
            </span>
          </Dropdown.Item>

          {themeOptions.map((option) => {
            const Icon = option.icon;

            return (
              <Dropdown.Item key={option.id} id={option.id} textValue={`${option.label} theme`}>
                <Icon className="size-4" />
                <Label>{option.label}</Label>
                {theme === option.id ? (
                  <span aria-hidden="true" className="ml-auto text-xs text-muted">
                    ●
                  </span>
                ) : null}
              </Dropdown.Item>
            );
          })}

          <Dropdown.Item id="logout" textValue="Log out" variant="danger">
            <Label>Log out</Label>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
