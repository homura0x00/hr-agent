import * as React from "react";
import { cn } from "@heroui/react";

export type LineChartSeries = {
  name: string;
  /** Any CSS colour, typically a theme token such as `var(--color-accent)`. */
  color: string;
  values: number[];
  /** Fills the area beneath the line with a soft gradient. */
  area?: boolean;
};

export type LineChartProps = {
  series: LineChartSeries[];
  /** X-axis tick labels; spacing is even, so this is used for the first/last too. */
  labels: string[];
  height?: number;
  formatValue?: (value: number) => string;
  ariaLabel: string;
  className?: string;
};

/**
 * Vertical padding inside the viewBox so a non-scaling stroke is not clipped at
 * the top and bottom edges.
 */
const PAD_Y = 6;

/**
 * Responsive multi-series line chart.
 *
 * The SVG stretches with `preserveAspectRatio="none"` while every stroke opts into
 * `vector-effect="non-scaling-stroke"`, so the lines keep a constant pixel width
 * instead of scaling with the container. Axis labels are real DOM text below the
 * plot, which keeps them crisp and selectable.
 */
export function LineChart({
  series,
  labels,
  height = 200,
  formatValue = (value) => String(value),
  ariaLabel,
  className,
}: LineChartProps) {
  // useId keeps the gradient ids unique across charts and stable during SSR.
  const gradientId = React.useId().replace(/:/g, "");

  const allValues = series.flatMap((entry) => entry.values);
  const maxValue = Math.max(...allValues);
  const minValue = Math.min(...allValues);
  const valueSpan = maxValue - minValue || 1;
  const pointCount = Math.max(...series.map((entry) => entry.values.length));

  const toPolyline = (values: number[]) =>
    values
      .map((value, index) => {
        const x = pointCount <= 1 ? 50 : (index / (pointCount - 1)) * 100;
        const y = 100 - ((value - minValue) / valueSpan) * 100;

        return `${x.toFixed(2)},${(PAD_Y + (y / 100) * (100 - PAD_Y * 2)).toFixed(2)}`;
      })
      .join(" ");

  return (
    <figure
      data-slot="line-chart"
      role="img"
      aria-label={ariaLabel}
      className={cn("flex flex-col gap-2", className)}
    >
      <div className="relative" style={{ height }}>
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="size-full overflow-visible"
          aria-hidden="true"
        >
          <defs>
            {series.map((entry, index) => (
              <linearGradient
                key={entry.name}
                id={`${gradientId}-${index}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" style={{ stopColor: entry.color }} stopOpacity="0.28" />
                <stop offset="100%" style={{ stopColor: entry.color }} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>

          <line
            x1="0"
            y1="100"
            x2="100"
            y2="100"
            stroke="currentColor"
            className="text-border"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />

          {series.map((entry, index) =>
            entry.area ? (
              <polygon
                key={`${entry.name}-area`}
                points={`0,100 ${toPolyline(entry.values)} 100,100`}
                fill={`url(#${gradientId}-${index})`}
              />
            ) : null,
          )}

          {series.map((entry) => (
            <polyline
              key={entry.name}
              points={toPolyline(entry.values)}
              fill="none"
              style={{ stroke: entry.color }}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
      </div>

      <div className="flex justify-between gap-2">
        {labels.map((label) => (
          <span key={label} className="truncate text-xs text-muted">
            {label}
          </span>
        ))}
      </div>

      <figcaption className="sr-only">
        {series
          .map(
            (entry) =>
              `${entry.name}: ${entry.values.map((value) => formatValue(value)).join(", ")}`,
          )
          .join(". ")}
      </figcaption>
    </figure>
  );
}

/** Legend swatch matching a `LineChartSeries` colour. */
export function ChartLegend({
  entries,
  className,
}: {
  entries: { name: string; color: string }[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {entries.map((entry) => (
        <span key={entry.name} className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="size-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-muted">{entry.name}</span>
        </span>
      ))}
    </div>
  );
}
