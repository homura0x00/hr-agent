import * as React from "react";
import { cn } from "@heroui/react";

/** Sticky top bar container. */
export function NavbarRoot({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <nav
      data-slot="navbar"
      className={cn(
        "sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-sm",
        className,
      )}
    >
      {children}
    </nav>
  );
}

/** Inner flex row: leading controls, title, spacer, trailing actions. */
export function NavbarHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div data-slot="navbar-header" className={cn("flex h-14 items-center gap-2 px-5", className)}>
      {children}
    </div>
  );
}

/** Flexible gap that pushes trailing actions to the far edge. */
export function NavbarSpacer({ className }: { className?: string }) {
  return <div data-slot="navbar-spacer" className={cn("flex-1", className)} />;
}

/** Page title rendered inside the navbar. */
export function NavbarTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h1
      data-slot="navbar-title"
      className={cn("truncate text-xl font-semibold text-foreground", className)}
    >
      {children}
    </h1>
  );
}

/** Trailing action cluster. */
export function NavbarActions({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div data-slot="navbar-actions" className={cn("flex items-center gap-2", className)}>
      {children}
    </div>
  );
}

export const Navbar = {
  Root: NavbarRoot,
  Header: NavbarHeader,
  Spacer: NavbarSpacer,
  Title: NavbarTitle,
  Actions: NavbarActions,
};
