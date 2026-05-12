export type AdminAnalyticsData = {
  totals: {
    orders: number;
    revenue: number;
    products: number;
    variants: number;
  };
  revenueByDay: { date: string; revenue: number }[];
  lowStock: { sku: string; product: string; stock: number }[];
};
