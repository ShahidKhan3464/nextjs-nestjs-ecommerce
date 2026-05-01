import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function NotFound() {
  return (
    <p className="text-sm">
      Not found. <Link href={ROUTES.adminProducts}>Products</Link>
    </p>
  );
}
