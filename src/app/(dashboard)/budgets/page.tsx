import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ComingSoonPlaceholder } from "@/components/shared/coming-soon";

export const metadata: Metadata = { title: "Budgets" };

export default function BudgetsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Budgets"
        description="Set spending limits and stay on track each month."
      />
      <ComingSoonPlaceholder feature="Budgets" />
    </div>
  );
}
