import * as React from "react";
import { Card, cn } from "@heroui/react";

import { TrendChip, type TrendDirection } from "./trend-chip";

export type KpiProps = {
  /** Metric name, e.g. "Revenue". */
  title: string;
  /** Pre-formatted metric value, e.g. `"$228,441"`. */
  value: React.ReactNode;
  /** Optional delta rendered beside the value. */
  trend?: { value: string; direction: TrendDirection };
  /** Optional leading glyph, used by the tracker's status counters. */
  icon?: React.ReactNode;
  className?: string;
};

/**
 * Headline metric card. Rebuilds HeroUI Pro's `kpi` composite on the free `Card`
 * primitives while keeping the same slot structure (`kpi-header`, `kpi-content`,
 * `kpi-value`).
 */
export function Kpi({ title, value, trend, icon, className }: KpiProps) {
  return (
    <Card data-slot="kpi" className={cn("justify-between", className)}>
      <div data-slot="kpi-header" className="flex items-center gap-2">
        {icon ? (
          <span
            data-slot="kpi-icon"
            className="flex size-4 shrink-0 items-center justify-center text-muted [&>svg]:size-4"
          >
            {icon}
          </span>
        ) : null}
        <span data-slot="kpi-title" className="text-sm font-medium text-muted">
          {title}
        </span>
      </div>

      <div data-slot="kpi-content" className="flex flex-wrap items-center justify-between gap-2">
        <span data-slot="kpi-value" className="text-2xl font-semibold tabular-nums text-foreground">
          {value}
        </span>
        {trend ? <TrendChip value={trend.value} direction={trend.direction} /> : null}
      </div>
    </Card>
  );
}

/** Responsive grid wrapper for a row of `Kpi` cards. */
export function KpiGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      data-slot="kpi-grid"
      className={cn("grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4", className)}
    >
      {children}
    </div>
  );
}
