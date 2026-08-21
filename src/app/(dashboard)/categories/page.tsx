import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ComingSoonPlaceholder } from "@/components/shared/coming-soon";

export const metadata: Metadata = { title: "Categories" };

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Organize transactions with custom categories."
      />
      <ComingSoonPlaceholder feature="Categories" />
    </div>
  );
}
