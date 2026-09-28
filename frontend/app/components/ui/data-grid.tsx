import * as React from "react";
import { Avatar, Button, SearchField, cn } from "@heroui/react";

import { CopyIcon, EyeIcon, PencilIcon, TrashIcon } from "~/components/icons";

/* --------------------------------------------------------------------- toolbar */

/** Toolbar row above a table: control cluster on the left, search on the right. */
export function DataGridToolbar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      data-slot="data-grid-toolbar"
      className={cn(
        "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Groups toolbar controls so they wrap together. */
export function DataGridToolbarGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("flex flex-wrap items-center gap-2", className)}>{children}</div>;
}

/** Search input bound to a page's filter state. */
export function DataGridSearch({
  value,
  onValueChange,
  placeholder = "Search...",
  ariaLabel,
  className,
}: {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  ariaLabel: string;
  className?: string;
}) {
  return (
    <SearchField
      value={value}
      onChange={onValueChange}
      aria-label={ariaLabel}
      variant="primary"
      className={cn("w-full sm:w-[220px]", className)}
    >
      <SearchField.Group>
        <SearchField.SearchIcon />
        <SearchField.Input placeholder={placeholder} />
        <SearchField.ClearButton />
      </SearchField.Group>
    </SearchField>
  );
}

/** Section heading with an item-count chip, e.g. "All Employees (10)". */
export function DataGridHeading({
  title,
  count,
  chip,
  className,
}: {
  title: string;
  count?: number;
  chip?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      {typeof count === "number" ? (
        <span className="rounded-full bg-surface-secondary px-2 py-0.5 text-xs font-medium tabular-nums text-muted">
          {count}
        </span>
      ) : null}
      {chip}
    </div>
  );
}

/* ----------------------------------------------------------------- table cells */

/** Avatar + name + email cell shared by the employee and order tables. */
export function UserCell({
  name,
  email,
  avatarSrc,
  className,
}: {
  name: string;
  email: string;
  avatarSrc?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Avatar size="sm" className="size-8 shrink-0">
        {avatarSrc ? <Avatar.Image alt={name} src={avatarSrc} /> : null}
        <Avatar.Fallback>
          {name
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase() ?? "")
            .join("")}
        </Avatar.Fallback>
      </Avatar>
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-xs font-medium text-foreground">{name}</span>
        <span className="truncate text-xs text-muted">{email}</span>
      </div>
    </div>
  );
}

/**
 * Copy-to-clipboard affordance for identifier cells.
 *
 * Clipboard access needs a secure context, so failures are swallowed rather than
 * surfaced — the id remains selectable either way.
 */
export function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!copied) {
      return;
    }

    const timeout = window.setTimeout(() => setCopied(false), 1200);

    return () => window.clearTimeout(timeout);
  }, [copied]);

  return (
    <Button
      isIconOnly
      size="sm"
      variant="ghost"
      aria-label={copied ? `${label} copied` : `Copy ${label}`}
      onPress={() => {
        void navigator.clipboard
          ?.writeText(value)
          .then(() => setCopied(true))
          .catch(() => undefined);
      }}
    >
      <CopyIcon className={cn("size-3.5", copied ? "text-success" : "text-muted")} />
    </Button>
  );
}

/** Row-level view / edit / delete actions. */
export function RowActions({
  label,
  onView,
  onEdit,
  onDelete,
}: {
  /** Entity name used to build the accessible labels. */
  label: string;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className="flex items-center justify-end gap-0.5">
      <Button isIconOnly size="sm" variant="tertiary" aria-label={`View ${label}`} onPress={onView}>
        <EyeIcon className="size-4" />
      </Button>
      <Button isIconOnly size="sm" variant="tertiary" aria-label={`Edit ${label}`} onPress={onEdit}>
        <PencilIcon className="size-4" />
      </Button>
      <Button
        isIconOnly
        size="sm"
        variant="danger-soft"
        aria-label={`Delete ${label}`}
        onPress={onDelete}
      >
        <TrashIcon className="size-4" />
      </Button>
    </div>
  );
}
