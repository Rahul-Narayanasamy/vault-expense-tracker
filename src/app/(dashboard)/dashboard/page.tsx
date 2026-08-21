import type { Metadata } from "next";
import { DashboardStats } from "@/features/dashboard/components/dashboard-stats";
import { RecentTransactions } from "@/features/dashboard/components/recent-transactions";
import { SpendingChart } from "@/features/dashboard/components/spending-chart";
import { getCurrentUser } from "@/lib/auth";
import { getDashboardData } from "@/services/dashboard.service";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const displayName = user.firstName ?? user.email.split("@")[0] ?? "there";
  const currency = user.settings?.currency ?? "USD";
  const { stats, recentTransactions, spendingByCategory } =
    await getDashboardData(user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {displayName}
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s your financial overview.
        </p>
      </div>

      <DashboardStats currency={currency} stats={stats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <SpendingChart data={spendingByCategory} currency={currency} />
        <RecentTransactions
          transactions={recentTransactions}
          currency={currency}
        />
      </div>
    </div>
  );
}
