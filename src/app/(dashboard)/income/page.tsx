import type { Metadata } from "next";
import { TransactionPageView } from "@/features/transactions/components/transaction-page-view";
import { INCOME_PAGE_CONFIG } from "@/features/transactions/config";
import { getCurrentUser } from "@/lib/auth";
import { getTransactionFormOptions } from "@/services/transaction.service";

export const metadata: Metadata = { title: "Income" };

export default async function IncomePage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const { accounts, categories } = await getTransactionFormOptions(user.id);
  const currency = user.settings?.currency ?? "USD";

  return (
    <TransactionPageView
      config={INCOME_PAGE_CONFIG}
      currency={currency}
      accounts={accounts}
      categories={categories}
    />
  );
}
