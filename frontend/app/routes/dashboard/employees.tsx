import * as React from "react";
import { Button, Card, Chip, Dropdown, Label, Table } from "@heroui/react";

import { CalendarIcon, FilterIcon } from "~/components/icons";
import {
  CopyButton,
  DataGridHeading,
  DataGridSearch,
  DataGridToolbar,
  DataGridToolbarGroup,
  RowActions,
  UserCell,
} from "~/components/ui/data-grid";
import {
  ORDER_STATUSES,
  ORDER_STATUS_COLOR,
  ORDERS,
  formatCurrency,
  formatDate,
  type OrderStatus,
} from "~/data/orders";
import type { DashboardHandle } from "~/layouts/dashboard-layout";
import { selectionToKeys } from "~/lib/selection";

export const handle: DashboardHandle = { navbarTitle: "Employee" };

type StatusFilter = OrderStatus | "all";

type DateRangeId = "all" | "7d" | "30d";

const DATE_RANGES: { id: DateRangeId; label: string; days?: number }[] = [
  { id: "all", label: "All time" },
  { id: "7d", label: "Last 7 days", days: 7 },
  { id: "30d", label: "Last 30 days", days: 30 },
];

/** Newest order in the fixture set, used as the reference point for ranges. */
const REFERENCE_DATE = ORDERS.reduce(
  (latest, order) => (order.date > latest ? order.date : latest),
  ORDERS[0]?.date ?? "1970-01-01",
);

function withinRange(orderDate: string, days: number): boolean {
  const reference = new Date(`${REFERENCE_DATE}T00:00:00Z`).getTime();
  const target = new Date(`${orderDate}T00:00:00Z`).getTime();
  const cutoff = reference - days * 24 * 60 * 60 * 1000;

  return target >= cutoff;
}

export default function OrdersPage() {
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<StatusFilter>("all");
  const [range, setRange] = React.useState<DateRangeId>("all");

  const rows = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    const activeRange = DATE_RANGES.find((entry) => entry.id === range);

    return ORDERS.filter((order) => {
      const matchesStatus = status === "all" || order.status === status;
      const matchesRange = !activeRange?.days || withinRange(order.date, activeRange.days);
      const matchesQuery =
        query.length === 0 ||
        [order.orderId, order.customer, order.email, order.status, String(order.total)]
          .join(" ")
          .toLowerCase()
          .includes(query);

      return matchesStatus && matchesRange && matchesQuery;
    });
  }, [search, status, range]);

  const activeRangeLabel = DATE_RANGES.find((entry) => entry.id === range)?.label ?? "Date range";

  return (
    <>
      <p className="text-sm text-muted">Manage and track customer orders.</p>

      <section className="flex flex-col gap-4">
        <DataGridHeading title="Orders" count={rows.length} />

        <DataGridToolbar>
          <DataGridToolbarGroup>
            <Dropdown>
              <Button size="sm" variant="secondary">
                <FilterIcon className="size-4" />
                {status === "all" ? "Status" : status}
              </Button>
              <Dropdown.Popover>
                <Dropdown.Menu
                  selectionMode="single"
                  selectedKeys={new Set([status])}
                  onSelectionChange={(keys) => {
                    const [next] = selectionToKeys(keys);

                    if (next !== undefined) {
                      setStatus(next as StatusFilter);
                    }
                  }}
                >
                  <Dropdown.Item id="all" textValue="All statuses">
                    <Label>All statuses</Label>
                  </Dropdown.Item>
                  {ORDER_STATUSES.map((entry) => (
                    <Dropdown.Item key={entry} id={entry} textValue={entry}>
                      <Label>{entry}</Label>
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>

            <Dropdown>
              <Button size="sm" variant="secondary">
                <CalendarIcon className="size-4" />
                {activeRangeLabel}
              </Button>
              <Dropdown.Popover>
                <Dropdown.Menu
                  selectionMode="single"
                  selectedKeys={new Set([range])}
                  onSelectionChange={(keys) => {
                    const [next] = selectionToKeys(keys);

                    if (next !== undefined) {
                      setRange(next as DateRangeId);
                    }
                  }}
                >
                  {DATE_RANGES.map((entry) => (
                    <Dropdown.Item key={entry.id} id={entry.id} textValue={entry.label}>
                      <Label>{entry.label}</Label>
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          </DataGridToolbarGroup>

          <DataGridSearch
            value={search}
            onValueChange={setSearch}
            placeholder="Search orders..."
            ariaLabel="Search orders"
            className="sm:w-[240px]"
          />
        </DataGridToolbar>

        {rows.length === 0 ? (
          <Card className="p-8 text-center text-sm text-muted">
            No orders match the current filters.
          </Card>
        ) : (
          <Table.Root>
            <Table.ScrollContainer>
              <Table.Content aria-label="Orders" className="min-w-[820px]">
                <Table.Header>
                  <Table.Column id="orderId" isRowHeader>
                    Order ID
                  </Table.Column>
                  <Table.Column id="customer">Customer</Table.Column>
                  <Table.Column id="status">Status</Table.Column>
                  <Table.Column id="total">Total</Table.Column>
                  <Table.Column id="date">Date</Table.Column>
                  <Table.Column id="actions">Actions</Table.Column>
                </Table.Header>

                <Table.Body>
                  {rows.map((order) => (
                    <Table.Row key={order.orderId} id={order.orderId}>
                      <Table.Cell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium tabular-nums">#{order.orderId}</span>
                          <CopyButton value={order.orderId} label="order ID" />
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <UserCell name={order.customer} email={order.email} />
                      </Table.Cell>
                      <Table.Cell>
                        <Chip color={ORDER_STATUS_COLOR[order.status]} size="sm" variant="soft">
                          <Chip.Label>{order.status}</Chip.Label>
                        </Chip>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="tabular-nums">{formatCurrency(order.total)}</span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="text-muted">{formatDate(order.date)}</span>
                      </Table.Cell>
                      <Table.Cell>
                        <RowActions label={order.orderId} />
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table.Root>
        )}
      </section>
    </>
  );
}
