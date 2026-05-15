import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findProductBySlug, getProductCatalog } from "@/lib/product-store";
import { ProductDetailView } from "@/modules/customer/products/components/product-detail-view";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 120;

export async function generateStaticParams() {
  return getProductCatalog().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = findProductBySlug(slug);
  if (!product) {
    return { title: "Product" };
  }
  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: product.images?.[0] ? [{ url: product.images[0] }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description.slice(0, 160),
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = findProductBySlug(slug);
  if (!product) {
    notFound();
  }
  return <ProductDetailView product={product} />;
}
