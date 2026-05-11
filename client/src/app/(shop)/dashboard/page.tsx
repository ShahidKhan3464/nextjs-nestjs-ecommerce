import type { Metadata } from "next";
import { AdminAnalytics } from "@/modules/admin/dashboard";
import { getAccessTokenPayload } from "@/lib/session-cookie";
import { DashboardOverview } from "@/modules/dashboard/components/dashboard-overview";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await getAccessTokenPayload();

  if (session?.role === "admin") {
    return (
      <div className="space-y-8">
        <header className="space-y-2">
          <h1 className="font-heading text-3xl font-semibold tracking-tight">
            Analytics
          </h1>
          <p className="text-muted-foreground text-sm">
            Monitor sales trends and order volume to spot what is performing well.
          </p>
        </header>
        <AdminAnalytics />
      </div>
    );
  }

  return <DashboardOverview />;
}
