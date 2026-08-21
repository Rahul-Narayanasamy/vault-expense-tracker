import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ComingSoonPlaceholder } from "@/components/shared/coming-soon";

export const metadata: Metadata = { title: "Calendar" };

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendar"
        description="See transactions and bills on a monthly calendar."
      />
      <ComingSoonPlaceholder feature="Calendar view" />
    </div>
  );
}
