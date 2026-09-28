import * as React from "react";
import {
  Button,
  ButtonGroup,
  Card,
  Dropdown,
  Label,
  Select,
  ListBox,
  Table,
  Tabs,
} from "@heroui/react";

import { BarChart } from "~/components/charts/bar-chart";
import { ChartLegend, LineChart } from "~/components/charts/line-chart";
import {
  ArrowUpDownIcon,
  CalendarIcon,
  ChevronDownIcon,
  ColumnsIcon,
  DownloadIcon,
  FilterIcon,
  MoreHorizontalIcon,
  RefreshIcon,
} from "~/components/icons";
import { Kpi, KpiGrid } from "~/components/ui/kpi";
import {
  CopyButton,
  DataGridHeading,
  DataGridSearch,
  DataGridToolbar,
  DataGridToolbarGroup,
  RowActions,
  UserCell,
} from "~/components/ui/data-grid";
import { TrendChip } from "~/components/ui/trend-chip";
import {
  DASHBOARD_TABS,
  KPIS_BY_TAB,
  SALES_BY_PERIOD,
  SALES_PERIODS,
  SALES_STATS,
  TRAFFIC_LABELS,
  TRAFFIC_SERIES,
  TRAFFIC_TOTAL,
  type DashboardTabId,
  type SalesPeriodId,
} from "~/data/dashboard";
import { EMPLOYEES, type Employee } from "~/data/employees";
import { selectionToKeys } from "~/lib/selection";
import type { DashboardHandle } from "~/layouts/dashboard-layout";

// No `navbarTitle`: the index route keeps the layout's time-of-day greeting.
export const handle: DashboardHandle = {};

/* ------------------------------------------------------------ employees table */

type ColumnId = "workerId" | "name" | "role" | "workerType";

type ColumnDef = {
  id: ColumnId;
  label: string;
  sortable?: boolean;
  className?: string;
  render: (employee: Employee) => React.ReactNode;
};

const COLUMN_DEFS: ColumnDef[] = [
  {
    id: "workerId",
    label: "Worker ID",
    sortable: true,
    render: (employee) => (
      <div className="flex items-center gap-2">
        <span className="font-medium tabular-nums">#{employee.workerId}</span>
        <CopyButton value={employee.workerId} label="worker ID" />
      </div>
    ),
  },
  {
    id: "name",
    label: "Member",
    sortable: true,
    render: (employee) => <UserCell name={employee.name} email={employee.email} />,
  },
  { id: "role", label: "Role", sortable: true, render: (employee) => employee.role },
  {
    id: "workerType",
    label: "Worker Type",
    sortable: true,
    render: (employee) => employee.workerType,
  },
];

const DEFAULT_VISIBLE_COLUMNS: ColumnId[] = ["workerId", "name", "role", "workerType"];

type SortState = {
  column: ColumnId;
  direction: "ascending" | "descending";
};

type WorkerTypeFilter = "all" | Employee["workerType"];

function EmployeesSection() {
  const [search, setSearch] = React.useState("");
  const [sort, setSort] = React.useState<SortState>({
    column: "workerId",
    direction: "ascending",
  });
  const [workerType, setWorkerType] = React.useState<WorkerTypeFilter>("all");
  const [visibleColumns, setVisibleColumns] = React.useState<ColumnId[]>(DEFAULT_VISIBLE_COLUMNS);

  const rows = React.useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = EMPLOYEES.filter((employee) => {
      const matchesType = workerType === "all" || employee.workerType === workerType;
      const matchesQuery =
        query.length === 0 ||
        [employee.workerId, employee.name, employee.email, employee.role, employee.workerType]
          .join(" ")
          .toLowerCase()
          .includes(query);

      return matchesType && matchesQuery;
    });

    const direction = sort.direction === "ascending" ? 1 : -1;

    return [...filtered].sort((a, b) => a[sort.column].localeCompare(b[sort.column]) * direction);
  }, [search, sort, workerType]);

  const shownColumns = COLUMN_DEFS.filter((column) => visibleColumns.includes(column.id));

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <DataGridHeading title="All Employees" count={rows.length} />

        <DataGridToolbar>
          <DataGridToolbarGroup>
            <Dropdown>
              <Button size="sm" variant="tertiary">
                <FilterIcon className="size-4" />
                {workerType === "all" ? "Filter" : workerType}
              </Button>
              <Dropdown.Popover>
                <Dropdown.Menu
                  selectionMode="single"
                  selectedKeys={new Set([workerType])}
                  onSelectionChange={(keys) => {
                    const [next] = selectionToKeys(keys);

                    if (next !== undefined) {
                      setWorkerType(next as WorkerTypeFilter);
                    }
                  }}
                >
                  <Dropdown.Item id="all" textValue="All worker types">
                    <Label>All worker types</Label>
                  </Dropdown.Item>
                  <Dropdown.Item id="Employee" textValue="Employee">
                    <Label>Employee</Label>
                  </Dropdown.Item>
                  <Dropdown.Item id="Contractor" textValue="Contractor">
                    <Label>Contractor</Label>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>

            <Button
              size="sm"
              variant="tertiary"
              aria-label={`Sort ${sort.direction === "ascending" ? "descending" : "ascending"}`}
              onPress={() =>
                setSort((previous) => ({
                  ...previous,
                  direction: previous.direction === "ascending" ? "descending" : "ascending",
                }))
              }
            >
              <ArrowUpDownIcon className="size-4" />
              Sort
            </Button>

            <Dropdown>
              <Button size="sm" variant="tertiary">
                <ColumnsIcon className="size-4" />
                Columns
              </Button>
              <Dropdown.Popover>
                <Dropdown.Menu
                  selectionMode="multiple"
                  selectedKeys={new Set(visibleColumns)}
                  onSelectionChange={(keys) => {
                    const next = selectionToKeys(keys).filter((key): key is ColumnId =>
                      COLUMN_DEFS.some((column) => column.id === key),
                    );

                    // Always keep at least one data column visible.
                    if (next.length > 0) {
                      setVisibleColumns(next);
                    }
                  }}
                >
                  {COLUMN_DEFS.map((column) => (
                    <Dropdown.Item key={column.id} id={column.id} textValue={column.label}>
                      <Label>{column.label}</Label>
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          </DataGridToolbarGroup>

          <DataGridSearch
            value={search}
            onValueChange={setSearch}
            placeholder="Search..."
            ariaLabel="Search employees"
          />
        </DataGridToolbar>
      </div>

      {rows.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted">
          No employees match the current filters.
        </Card>
      ) : (
        <Table.Root>
          <Table.ScrollContainer>
            <Table.Content
              aria-label="All employees"
              className="min-w-[700px]"
              sortDescriptor={sort}
              onSortChange={(descriptor) =>
                setSort({
                  column: descriptor.column as ColumnId,
                  direction: descriptor.direction,
                })
              }
            >
              <Table.Header>
                {shownColumns.map((column, index) => (
                  <Table.Column
                    key={column.id}
                    id={column.id}
                    isRowHeader={index === 0}
                    allowsSorting={column.sortable}
                  >
                    {column.sortable
                      ? ({ sortDirection }) => (
                          <Table.SortableColumnHeader sortDirection={sortDirection}>
                            {column.label}
                          </Table.SortableColumnHeader>
                        )
                      : column.label}
                  </Table.Column>
                ))}
                <Table.Column id="actions">Actions</Table.Column>
              </Table.Header>

              <Table.Body>
                {rows.map((employee) => (
                  <Table.Row key={employee.workerId} id={employee.workerId}>
                    {shownColumns.map((column) => (
                      <Table.Cell key={column.id}>{column.render(employee)}</Table.Cell>
                    ))}
                    <Table.Cell>
                      <RowActions label={employee.name} />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table.Root>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ page body */

export default function DashboardHome() {
  const [tab, setTab] = React.useState<DashboardTabId>("overview");
  const [period, setPeriod] = React.useState<SalesPeriodId>("last-2-weeks");

  const stats = SALES_STATS[period];

  return (
    <>
      {/* Page toolbar: tab strip on the left, actions on the right. */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Tabs selectedKey={tab} onSelectionChange={(key) => setTab(key as DashboardTabId)}>
          <Tabs.List aria-label="Dashboard tabs">
            {DASHBOARD_TABS.map((entry) => (
              <Tabs.Tab key={entry.id} id={entry.id}>
                {entry.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs>

        <div className="flex flex-wrap items-center gap-2">
          <Button isIconOnly size="sm" variant="tertiary" aria-label="Refresh">
            <RefreshIcon className="size-4" />
          </Button>
          <ButtonGroup size="sm" variant="tertiary">
            <Button>
              <CalendarIcon className="size-4" />
              Monthly
            </Button>
            <Button isIconOnly aria-label="Change period">
              <ChevronDownIcon className="size-4" />
            </Button>
          </ButtonGroup>
          <Button size="sm" variant="primary">
            <DownloadIcon className="size-4" />
            Download
          </Button>
        </div>
      </div>

      <KpiGrid>
        {KPIS_BY_TAB[tab].map((kpi) => (
          <Kpi key={kpi.title} title={kpi.title} value={kpi.value} trend={kpi.trend} />
        ))}
      </KpiGrid>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <Card className="gap-4">
          <div className="flex flex-row items-center justify-between gap-2">
            <Card.Title className="text-base">Sales Performance</Card.Title>
            <Select
              aria-label="Sales period"
              variant="secondary"
              className="w-[150px]"
              selectedKey={period}
              onSelectionChange={(key) => setPeriod(key as SalesPeriodId)}
            >
              <Select.Trigger className="h-auto min-h-0 px-3 py-1.5 text-xs">
                <Select.Value />
                <Select.Indicator className="size-3.5" />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {SALES_PERIODS.map((option) => (
                    <ListBox.Item key={option.id} id={option.id}>
                      {option.label}
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg font-semibold tabular-nums text-foreground">
                      {stat.value}
                    </span>
                    <TrendChip value={stat.change} direction="up" />
                  </div>
                  <span className="text-xs text-muted">{stat.label}</span>
                </div>
              ))}
            </div>

            <BarChart
              data={SALES_BY_PERIOD[period]}
              ariaLabel="Sales performance by period"
              formatValue={(value) => `$${value.toLocaleString("en-US")}`}
            />
          </div>
        </Card>

        <Card className="gap-4">
          <div className="flex flex-row items-center justify-between gap-2">
            <Card.Title className="text-base">Traffic Source</Card.Title>
            <div className="flex items-center gap-4">
              <ChartLegend
                entries={TRAFFIC_SERIES.map((entry) => ({
                  name: entry.name,
                  color: entry.color,
                }))}
              />
              <Button isIconOnly size="sm" variant="tertiary" aria-label="More options">
                <MoreHorizontalIcon className="size-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <span className="text-lg font-semibold tabular-nums text-foreground">
                {TRAFFIC_TOTAL}
              </span>
              <span className="text-xs text-muted">Sessions</span>
            </div>

            <LineChart
              series={TRAFFIC_SERIES}
              labels={TRAFFIC_LABELS}
              ariaLabel="Traffic source sessions over the last eight weeks"
              formatValue={(value) => value.toLocaleString("en-US")}
            />
          </div>
        </Card>
      </div>

      <EmployeesSection />
    </>
  );
}
