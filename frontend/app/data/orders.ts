export type OrderStatus = "Paid" | "Pending" | "Refunded" | "Processing";

export type Order = {
  orderId: string;
  customer: string;
  email: string;
  status: OrderStatus;
  total: number;
  /** ISO date, formatted at render time. */
  date: string;
};

/**
 * Maps an order status onto the `Chip` colour that represents it.
 */
export const ORDER_STATUS_COLOR: Record<OrderStatus, "success" | "warning" | "danger" | "accent"> =
  {
    Paid: "success",
    Pending: "warning",
    Refunded: "danger",
    Processing: "accent",
  };

export const ORDER_STATUSES: OrderStatus[] = ["Paid", "Pending", "Refunded", "Processing"];

export const ORDERS: Order[] = [
  {
    orderId: "ORD-48291",
    customer: "Kate Moore",
    email: "kate@acme.com",
    status: "Paid",
    total: 1284.0,
    date: "2024-11-04",
  },
  {
    orderId: "ORD-48290",
    customer: "Alex Turner",
    email: "alex@acme.com",
    status: "Processing",
    total: 342.5,
    date: "2024-11-04",
  },
  {
    orderId: "ORD-48289",
    customer: "Emma Davis",
    email: "emma@acme.com",
    status: "Pending",
    total: 89.99,
    date: "2024-11-03",
  },
  {
    orderId: "ORD-48288",
    customer: "John Smith",
    email: "john@acme.com",
    status: "Paid",
    total: 2450.0,
    date: "2024-11-03",
  },
  {
    orderId: "ORD-48287",
    customer: "Sara Johnson",
    email: "sara@acme.com",
    status: "Refunded",
    total: 156.75,
    date: "2024-11-02",
  },
  {
    orderId: "ORD-48286",
    customer: "Mike Wilson",
    email: "mike@acme.com",
    status: "Paid",
    total: 780.25,
    date: "2024-11-02",
  },
  {
    orderId: "ORD-48285",
    customer: "Priya Nair",
    email: "priya@acme.com",
    status: "Processing",
    total: 512.4,
    date: "2024-11-01",
  },
  {
    orderId: "ORD-48284",
    customer: "Diego Alvarez",
    email: "diego@acme.com",
    status: "Pending",
    total: 67.0,
    date: "2024-11-01",
  },
];

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function formatCurrency(value: number): string {
  return CURRENCY_FORMATTER.format(value);
}

export function formatDate(isoDate: string): string {
  return DATE_FORMATTER.format(new Date(`${isoDate}T00:00:00Z`));
}
