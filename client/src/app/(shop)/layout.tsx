import { AuthAwareShell } from "@/shared/components/layout/auth-aware-shell";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthAwareShell>{children}</AuthAwareShell>;
}
