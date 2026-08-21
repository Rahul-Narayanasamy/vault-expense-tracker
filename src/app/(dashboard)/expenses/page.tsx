import type { Metadata } from "next";
import { TransactionPageView } from "@/features/transactions/components/transaction-page-view";
import { EXPENSES_PAGE_CONFIG } from "@/features/transactions/config";
import { getCurrentUser } from "@/lib/auth";
import { getTransactionFormOptions } from "@/services/transaction.service";

export const metadata: Metadata = { title: "Expenses" };

export default async function ExpensesPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const { accounts, categories } = await getTransactionFormOptions(user.id);
  const currency = user.settings?.currency ?? "USD";

  return (
    <TransactionPageView
      config={EXPENSES_PAGE_CONFIG}
      currency={currency}
      accounts={accounts}
      categories={categories}
    />
  );
}
