import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function NotFound() {
  return (
    <p className="text-center text-sm">
      Not found.{" "}
      <Link href={ROUTES.forgotPassword} className="underline-offset-4 hover:underline">
        Forgot password
      </Link>
    </p>
  );
}
