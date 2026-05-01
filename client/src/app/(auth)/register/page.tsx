import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/constants/routes";
import { RegisterForm } from "@/modules/auth/components/register-form";

export const metadata: Metadata = {
  title: "Create account",
  description: `Register at ${siteConfig.name}`,
};

export default function RegisterPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Create your account
        </h1>
        <p className="text-muted-foreground text-sm">
          Save your details for faster checkout, order updates, and your wishlist.
        </p>
      </div>
      <RegisterForm />
      <p className="text-muted-foreground text-center text-sm">
        Already registered?{" "}
        <Link
          className="text-foreground font-medium underline-offset-4 hover:underline"
          href={ROUTES.login}
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
