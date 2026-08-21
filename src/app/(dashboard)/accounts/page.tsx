import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ComingSoonPlaceholder } from "@/components/shared/coming-soon";

export const metadata: Metadata = { title: "Accounts" };

export default function AccountsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Accounts"
        description="Manage bank accounts, cards, and cash wallets."
      />
      <ComingSoonPlaceholder feature="Accounts" />
    </div>
  );
}
