import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ComingSoonPlaceholder } from "@/components/shared/coming-soon";

export const metadata: Metadata = { title: "Goals" };

export default function GoalsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Goals"
        description="Set savings targets and monitor your progress."
      />
      <ComingSoonPlaceholder feature="Financial goals" />
    </div>
  );
}
