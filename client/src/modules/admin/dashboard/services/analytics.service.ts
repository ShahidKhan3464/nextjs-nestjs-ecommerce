import type { AdminAnalyticsData } from "../types";

export async function fetchAdminAnalytics(): Promise<AdminAnalyticsData> {
  /* Dashboard analytics API not wired to Nest yet — avoid failing requests.
  const res = await api.get<{ data: AdminAnalyticsData }>(
    "/api/v1/admin/analytics"
  );
  return res.data.data;
  */
  return {
    totals: { orders: 0, revenue: 0, products: 0, variants: 0 },
    revenueByDay: [],
    lowStock: [],
  };
}
