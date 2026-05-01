import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/constants/routes";
import { LoginForm } from "@/modules/auth/components/login-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: `Sign in to ${siteConfig.name}`,
};

function LoginFallback() {
  return (
    <p className="text-muted-foreground text-center text-sm">Loading form…</p>
  );
}

export default function LoginPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Welcome back
        </h1>
        <p className="text-muted-foreground text-sm">
          Demo admin: <code className="rounded bg-muted px-1 text-xs">admin@example.com</code> /{" "}
          <code className="rounded bg-muted px-1 text-xs">Admin123!</code>
        </p>
      </div>
      <Suspense fallback={<LoginFallback />}>
        <LoginForm />
      </Suspense>
      <p className="text-muted-foreground text-center text-sm">
        New here?{" "}
        <Link
          className="text-foreground font-medium underline-offset-4 hover:underline"
          href={ROUTES.register}
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
