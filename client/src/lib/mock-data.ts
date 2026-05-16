import type { Product, User } from "@/types";

const img = (seed: string, w = 800, h = 1000) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;

function variantsFor(
  productId: string,
  base: number,
  slug: string
): Product["variants"] {
  const colors = ["Obsidian", "Stone", "Ivory"];
  const sizes = ["S", "M", "L"];
  const out: Product["variants"] = [];
  let i = 0;
  for (const color of colors) {
    for (const size of sizes) {
      i += 1;
      const id = `${productId}-v${i}`;
      out.push({
        id,
        productId,
        sku: `${slug}-${color}-${size}`.toUpperCase().replace(/\s/g, ""),
        name: `${color} / ${size}`,
        options: { color, size },
        price: base + (color === "Ivory" ? 10 : 0) + (size === "L" ? 8 : 0),
        compareAtPrice: base + 40,
        stock: 5 + (i % 8),
        image: img(`${slug}-${color}-${size}`),
      });
    }
  }
  return out;
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    slug: "merino-crewneck",
    name: "Merino Crewneck",
    description:
      "Ultra-soft merino wool with a relaxed shoulder and ribbed cuffs. Temperature-regulating comfort for every season.",
    category: "Apparel",
    rating: 4.8,
    reviewCount: 124,
    images: [img("merino-1"), img("merino-2"), img("merino-3")],
    featured: true,
    variants: variantsFor("p1", 128, "merino-crewneck"),
  },
  {
    id: "p2",
    slug: "tailored-trousers",
    name: "Tailored Trousers",
    description:
      "Structured wool blend with a tapered leg. Pressed crease and interior waistband grip for all-day ease.",
    category: "Apparel",
    rating: 4.6,
    reviewCount: 89,
    images: [img("trouser-1"), img("trouser-2")],
    featured: true,
    variants: variantsFor("p2", 168, "tailored-trousers"),
  },
  {
    id: "p3",
    slug: "linen-overshirt",
    name: "Linen Overshirt",
    description:
      "Breathable Italian linen with matte corozo buttons. Layer-ready weight with a modern boxy cut.",
    category: "Apparel",
    rating: 4.7,
    reviewCount: 56,
    images: [img("linen-1"), img("linen-2"), img("linen-3")],
    variants: variantsFor("p3", 142, "linen-overshirt"),
  },
  {
    id: "p4",
    slug: "ceramic-pour-over",
    name: "Ceramic Pour Over",
    description:
      "Hand-glazed stoneware dripper with optimized spiral ribs for even extraction.",
    category: "Home",
    rating: 4.9,
    reviewCount: 210,
    images: [img("ceramic-1"), img("ceramic-2")],
    featured: true,
    variants: [
      {
        id: "p4-v1",
        productId: "p4",
        sku: "POUR-MATTE-BLK",
        name: "Matte Black",
        options: { finish: "Matte Black" },
        price: 64,
        compareAtPrice: 78,
        stock: 24,
        image: img("pour-matte"),
      },
      {
        id: "p4-v2",
        productId: "p4",
        sku: "POUR-SAND",
        name: "Sand",
        options: { finish: "Sand" },
        price: 64,
        stock: 18,
        image: img("pour-sand"),
      },
    ],
  },
  {
    id: "p5",
    slug: "studio-lamp",
    name: "Studio Lamp",
    description:
      "Warm dimmable LED with powder-coated steel arm and weighted base for precise positioning.",
    category: "Home",
    rating: 4.5,
    reviewCount: 72,
    images: [img("lamp-1"), img("lamp-2"), img("lamp-3")],
    variants: [
      {
        id: "p5-v1",
        productId: "p5",
        sku: "LAMP-GRAPHITE",
        name: "Graphite",
        options: { color: "Graphite" },
        price: 189,
        compareAtPrice: 219,
        stock: 12,
        image: img("lamp-graphite"),
      },
      {
        id: "p5-v2",
        productId: "p5",
        sku: "LAMP-BONE",
        name: "Bone",
        options: { color: "Bone" },
        price: 189,
        stock: 9,
        image: img("lamp-bone"),
      },
    ],
  },
  {
    id: "p6",
    slug: "everyday-tote",
    name: "Everyday Tote",
    description:
      "Vegetable-tanned leather with reinforced handles and interior laptop sleeve.",
    category: "Accessories",
    rating: 4.8,
    reviewCount: 198,
    images: [img("tote-1"), img("tote-2")],
    variants: variantsFor("p6", 98, "everyday-tote"),
  },
  {
    id: "p7",
    slug: "minimal-sneaker",
    name: "Minimal Sneaker",
    description:
      "Full-grain leather upper, Margom sole, cushioned footbed. Designed for daily mileage.",
    category: "Footwear",
    rating: 4.4,
    reviewCount: 311,
    images: [img("sneaker-1"), img("sneaker-2"), img("sneaker-3")],
    variants: variantsFor("p7", 195, "minimal-sneaker"),
  },
  {
    id: "p8",
    slug: "cashmere-scarf",
    name: "Cashmere Scarf",
    description:
      "Two-ply Mongolian cashmere with feather-light hand feel and generous length.",
    category: "Accessories",
    rating: 4.9,
    reviewCount: 64,
    images: [img("scarf-1"), img("scarf-2")],
    variants: variantsFor("p8", 88, "cashmere-scarf"),
  },
];

export interface MockUserRecord extends User {
  password: string;
}

export const MOCK_USERS: MockUserRecord[] = [
  {
    id: "u1",
    email: "admin@example.com",
    name: "Alex Admin",
    fullName: "Alex Admin",
    isBlocked: false,
    role: "admin",
    password: "Admin123!",
    createdAt: new Date().toISOString(),
    avatarUrl: img("admin-avatar", 200, 200),
  },
  {
    id: "u2",
    email: "customer@example.com",
    name: "Casey Customer",
    fullName: "Casey Customer",
    isBlocked: false,
    role: "customer",
    password: "Customer123!",
    createdAt: new Date().toISOString(),
    avatarUrl: img("customer-avatar", 200, 200),
  },
];

export const MOCK_COUPONS = [
  {
    code: "WELCOME10",
    type: "percent" as const,
    value: 10,
    minSubtotal: 50,
  },
  {
    code: "FLAT15",
    type: "fixed" as const,
    value: 15,
    minSubtotal: 100,
  },
];
