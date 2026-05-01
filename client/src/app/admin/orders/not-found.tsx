import Link from "next/link";

import { ROUTES } from "@/constants/routes";

export default function NotFound() {
  return (
    <p className="text-sm">
      <Link href={ROUTES.adminOrders}>Orders</Link>
    </p>
  );
}
