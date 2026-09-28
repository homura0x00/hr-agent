import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/login.tsx"),
  route("dashboard", "layouts/dashboard-layout.tsx", [
    index("routes/dashboard/home.tsx"),
    route("orders", "routes/dashboard/orders.tsx"),
    route("tracker", "routes/dashboard/tracker.tsx"),
    route("analytics", "routes/dashboard/analytics.tsx"),
    route("settings", "routes/dashboard/settings.tsx"),
    route("help", "routes/dashboard/help.tsx"),
  ]),
] satisfies RouteConfig;
