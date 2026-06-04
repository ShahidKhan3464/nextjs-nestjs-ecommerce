export const queryKeys = {
  products: {
    all: ["products"] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.products.all, "list", filters] as const,
    detail: (slug: string) =>
      [...queryKeys.products.all, "detail", slug] as const,
    infinite: (filters: Record<string, unknown>) =>
      [...queryKeys.products.all, "infinite", filters] as const,
  },
  cart: {
    all: ["cart"] as const,
  },
  wishlist: {
    all: ["wishlist"] as const,
  },
  orders: {
    all: ["orders"] as const,
    list: () => [...queryKeys.orders.all, "list"] as const,
    detail: (id: string) => [...queryKeys.orders.all, "detail", id] as const,
  },
  auth: {
    me: ["auth", "me"] as const,
  },
  admin: {
    users: ["admin", "users"] as const,
    orders: ["admin", "orders"] as const,
    products: ["admin", "products"] as const,
    analytics: ["admin", "analytics"] as const,
    customers: ["admin", "customers"] as const,
    categories: ["admin", "categories"] as const,
    user: (id: string) => ["admin", "users", id] as const,
    order: (id: string) => ["admin", "orders", id] as const,
    customer: (id: string) => ["admin", "customers", id] as const,
    category: (id: number) => ["admin", "categories", id] as const,
  },
  coupons: (code: string) => ["coupons", code] as const,
} as const;
