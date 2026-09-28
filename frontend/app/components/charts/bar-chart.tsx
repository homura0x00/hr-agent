import { cn } from "@heroui/react";

export type BarChartDatum = {
  label: string;
  value: number;
};

export type BarChartProps = {
  data: BarChartDatum[];
  /** Plot height in pixels; the axis labels sit below it. */
  height?: number;
  /** Formats values for the tooltip and the screen-reader summary. */
  formatValue?: (value: number) => string;
  /** Accessible description of what the chart shows. */
  ariaLabel: string;
  className?: string;
};

const GRID_LINES = [0, 0.25, 0.5, 0.75, 1];

/**
 * Responsive bar chart built from CSS boxes rather than SVG.
 *
 * Avoiding a charting dependency keeps the bundle small, and laying the bars out
 * with flexbox means labels stay crisp at any width — an SVG scaled via viewBox
 * would stretch its text along with the plot.
 */
export function BarChart({
  data,
  height = 200,
  formatValue = (value) => String(value),
  ariaLabel,
  className,
}: BarChartProps) {
  const maxValue = Math.max(...data.map((datum) => datum.value), 1);

  return (
    <figure
      data-slot="bar-chart"
      role="img"
      aria-label={ariaLabel}
      className={cn("flex flex-col gap-2", className)}
    >
      <div className="relative" style={{ height }}>
        <div aria-hidden="true" className="absolute inset-0 flex flex-col justify-between">
          {GRID_LINES.map((line) => (
            <div key={line} className="border-t border-border/60" />
          ))}
        </div>

        <div className="absolute inset-0 flex items-end gap-1.5">
          {data.map((datum) => (
            <div key={datum.label} className="flex h-full flex-1 items-end">
              <div
                className="w-full rounded-t-sm bg-accent transition-[height] duration-300"
                style={{ height: `${(datum.value / maxValue) * 100}%` }}
                title={`${datum.label}: ${formatValue(datum.value)}`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-1.5">
        {data.map((datum) => (
          <span key={datum.label} className="flex-1 truncate text-center text-xs text-muted">
            {datum.label}
          </span>
        ))}
      </div>

      <figcaption className="sr-only">
        {data.map((datum) => `${datum.label}: ${formatValue(datum.value)}`).join("; ")}
      </figcaption>
    </figure>
  );
}
