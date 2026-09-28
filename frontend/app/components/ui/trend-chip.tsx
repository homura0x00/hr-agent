import { Chip, cn } from "@heroui/react";

import { TrendingDownIcon, TrendingUpIcon } from "~/components/icons";

export type TrendDirection = "up" | "down";

export type TrendChipProps = {
  /** Pre-formatted change, e.g. `"3.3%"`. */
  value: string;
  direction: TrendDirection;
  size?: "sm" | "md" | "lg";
  className?: string;
};

/**
 * Compact delta indicator used by KPI cards and table rows.
 *
 * `direction` drives the colour, so a rising cost figure can still be rendered as
 * a warning by passing `"up"` with `tone="danger"` at the call site if needed.
 */
export function TrendChip({ value, direction, size = "sm", className }: TrendChipProps) {
  const isUp = direction === "up";
  const Icon = isUp ? TrendingUpIcon : TrendingDownIcon;

  return (
    <Chip
      data-slot="trend-chip"
      color={isUp ? "success" : "danger"}
      size={size}
      variant="soft"
      className={cn("gap-1", className)}
    >
      <Icon className="size-3" />
      <Chip.Label className="tabular-nums">{value}</Chip.Label>
    </Chip>
  );
}
