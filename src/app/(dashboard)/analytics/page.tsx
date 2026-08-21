import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ComingSoonPlaceholder } from "@/components/shared/coming-soon";

export const metadata: Metadata = { title: "Analytics" };

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Visualize trends, breakdowns, and spending patterns."
      />
      <ComingSoonPlaceholder feature="Analytics" />
    </div>
  );
}
