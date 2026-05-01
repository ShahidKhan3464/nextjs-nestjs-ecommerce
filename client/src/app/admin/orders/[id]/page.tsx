import type { Metadata } from "next";
import { AdminOrderDetail } from "@/modules/admin/components/admin-order-detail";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: `Order ${id}` };
}

export default async function AdminOrderPage({ params }: Props) {
  const { id } = await params;
  return <AdminOrderDetail orderId={id} />;
}
