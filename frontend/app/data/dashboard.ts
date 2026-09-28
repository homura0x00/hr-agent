import type { BarChartDatum } from "~/components/charts/bar-chart";
import type { LineChartSeries } from "~/components/charts/line-chart";
import type { TrendDirection } from "~/components/ui/trend-chip";

export type DashboardKpi = {
  title: string;
  value: string;
  trend: { value: string; direction: TrendDirection };
};

export type DashboardTabId = "overview" | "sales" | "expenses";

export const DASHBOARD_TABS: { id: DashboardTabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "sales", label: "Sales" },
  { id: "expenses", label: "Expenses" },
];

/** The tab strip swaps the KPI row, so each tab carries its own figures. */
export const KPIS_BY_TAB: Record<DashboardTabId, DashboardKpi[]> = {
  overview: [
    {
      title: "Revenue",
      value: "$228,441",
      trend: { value: "3.3%", direction: "up" },
    },
    {
      title: "Expenses",
      value: "$25,108",
      trend: { value: "3.3%", direction: "down" },
    },
    { title: "Sales", value: "458", trend: { value: "3.3%", direction: "up" } },
    {
      title: "Profit",
      value: "$203,133",
      trend: { value: "4.1%", direction: "up" },
    },
  ],
  sales: [
    {
      title: "Units sold",
      value: "1,284",
      trend: { value: "5.2%", direction: "up" },
    },
    {
      title: "Avg. order value",
      value: "$177.90",
      trend: { value: "1.8%", direction: "up" },
    },
    {
      title: "New customers",
      value: "312",
      trend: { value: "2.4%", direction: "down" },
    },
    {
      title: "Refund rate",
      value: "1.9%",
      trend: { value: "0.4%", direction: "down" },
    },
  ],
  expenses: [
    {
      title: "Payroll",
      value: "$14,820",
      trend: { value: "1.1%", direction: "up" },
    },
    {
      title: "Infrastructure",
      value: "$6,240",
      trend: { value: "2.7%", direction: "down" },
    },
    {
      title: "Marketing",
      value: "$3,180",
      trend: { value: "4.6%", direction: "up" },
    },
    {
      title: "Software",
      value: "$868",
      trend: { value: "0.9%", direction: "up" },
    },
  ],
};

/** Selectable ranges for the Sales Performance card. */
export const SALES_PERIODS = [
  { id: "last-week", label: "Last week" },
  { id: "last-2-weeks", label: "Last 2 weeks" },
  { id: "last-month", label: "Last month" },
  { id: "last-3-months", label: "Last 3 months" },
] as const;

export type SalesPeriodId = (typeof SALES_PERIODS)[number]["id"];

/**
 * Weekly sales series per period. Kept as static fixtures so the select is
 * genuinely interactive without a data layer.
 */
export const SALES_BY_PERIOD: Record<SalesPeriodId, BarChartDatum[]> = {
  "last-week": [
    { label: "Mon", value: 3200 },
    { label: "Tue", value: 4100 },
    { label: "Wed", value: 2800 },
    { label: "Thu", value: 5200 },
    { label: "Fri", value: 6100 },
    { label: "Sat", value: 4400 },
    { label: "Sun", value: 2641 },
  ],
  "last-2-weeks": [
    { label: "W1", value: 14200 },
    { label: "W2", value: 14241 },
  ],
  "last-month": [
    { label: "Week 1", value: 26800 },
    { label: "Week 2", value: 31200 },
    { label: "Week 3", value: 24400 },
    { label: "Week 4", value: 29841 },
  ],
  "last-3-months": [
    { label: "Sep", value: 82400 },
    { label: "Oct", value: 96100 },
    { label: "Nov", value: 88441 },
  ],
};

export type SalesStat = { label: string; value: string; change: string };

/** Summary figures shown above the Sales Performance chart. */
export const SALES_STATS: Record<SalesPeriodId, SalesStat[]> = {
  "last-week": [
    { label: "Weekly Sales", value: "$28,441", change: "3.3%" },
    { label: "Daily Sales", value: "$4,063", change: "2.1%" },
    { label: "Total Sales", value: "278", change: "1.4%" },
  ],
  "last-2-weeks": [
    { label: "Weekly Sales", value: "$28,441", change: "3.3%" },
    { label: "Daily Sales", value: "$4,063", change: "3.3%" },
    { label: "Total Sales", value: "278", change: "3.3%" },
  ],
  "last-month": [
    { label: "Weekly Sales", value: "$31,200", change: "4.8%" },
    { label: "Daily Sales", value: "$4,457", change: "2.6%" },
    { label: "Total Sales", value: "1,124", change: "5.2%" },
  ],
  "last-3-months": [
    { label: "Weekly Sales", value: "$88,441", change: "6.7%" },
    { label: "Daily Sales", value: "$12,634", change: "4.1%" },
    { label: "Total Sales", value: "3,418", change: "7.9%" },
  ],
};

/**
 * Traffic Source line chart. Colours reference theme tokens so the chart follows
 * light/dark mode automatically.
 */
export const TRAFFIC_SERIES: LineChartSeries[] = [
  {
    name: "Organic",
    color: "var(--color-accent)",
    area: true,
    values: [18200, 21400, 19800, 24600, 23100, 27800, 26400, 31200],
  },
  {
    name: "Paid Ads",
    color: "var(--color-success)",
    values: [9800, 10400, 12100, 11200, 13800, 12900, 15200, 16400],
  },
];

export const TRAFFIC_LABELS = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"];

export const TRAFFIC_TOTAL = "231,856";
