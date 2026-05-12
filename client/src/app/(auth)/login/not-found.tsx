import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function NotFound() {
  return (
    <p className="text-center text-sm">
      Page missing. <Link href={ROUTES.login}>Back to sign in</Link>
    </p>
  );
}
