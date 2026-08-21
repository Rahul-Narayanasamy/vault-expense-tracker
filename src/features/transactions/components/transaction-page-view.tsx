"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import type { TransactionPageConfig } from "@/features/transactions/config";
import { TransactionFilters } from "@/features/transactions/components/transaction-filters";
import { TransactionFormDialog } from "@/features/transactions/components/transaction-form-dialog";
import { TransactionsTable } from "@/features/transactions/components/transactions-table";
import { useTransactions } from "@/features/transactions/hooks/use-transactions";
import type {
  TransactionAccount,
  TransactionCategory,
  TransactionFiltersState,
} from "@/features/transactions/types";
import type { SerializedTransaction } from "@/lib/serialize";
import { formatCurrency } from "@/utils/format";

interface TransactionPageViewProps {
  config: TransactionPageConfig;
  currency: string;
  accounts: TransactionAccount[];
  categories: TransactionCategory[];
  autoOpenForm?: boolean;
}

function createDefaultFilters(
  config: TransactionPageConfig
): TransactionFiltersState {
  return {
    search: "",
    type: config.fixedType ?? "ALL",
    accountId: "",
    categoryId: "",
    page: 1,
    pageSize: 20,
  };
}

function SummaryCards({
  config,
  currency,
  summary,
  total,
}: {
  config: TransactionPageConfig;
  currency: string;
  summary: { income: number; expense: number; net: number };
  total: number;
}) {
  if (config.summaryMode === "all") {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass-card rounded-xl p-5">
          <p className="text-sm text-muted-foreground">Income</p>
          <p className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(summary.income, currency)}
          </p>
        </div>
        <div className="glass-card rounded-xl p-5">
          <p className="text-sm text-muted-foreground">Expenses</p>
          <p className="mt-2 text-2xl font-bold text-rose-600 dark:text-rose-400">
            {formatCurrency(summary.expense, currency)}
          </p>
        </div>
        <div className="glass-card rounded-xl p-5">
          <p className="text-sm text-muted-foreground">Net</p>
          <p
            className={`mt-2 text-2xl font-bold ${
              summary.net >= 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {formatCurrency(summary.net, currency)}
          </p>
        </div>
      </div>
    );
  }

  const primaryTotal =
    config.summaryMode === "expense" ? summary.expense : summary.income;
  const average = total > 0 ? primaryTotal / total : 0;
  const accentClass =
    config.summaryMode === "expense"
      ? "text-rose-600 dark:text-rose-400"
      : "text-emerald-600 dark:text-emerald-400";

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="glass-card rounded-xl p-5">
        <p className="text-sm text-muted-foreground">
          Total {config.summaryMode === "expense" ? "spent" : "earned"}
        </p>
        <p className={`mt-2 text-2xl font-bold ${accentClass}`}>
          {formatCurrency(primaryTotal, currency)}
        </p>
      </div>
      <div className="glass-card rounded-xl p-5">
        <p className="text-sm text-muted-foreground">Entries</p>
        <p className="mt-2 text-2xl font-bold">{total}</p>
      </div>
      <div className="glass-card rounded-xl p-5">
        <p className="text-sm text-muted-foreground">Average</p>
        <p className={`mt-2 text-2xl font-bold ${accentClass}`}>
          {formatCurrency(average, currency)}
        </p>
      </div>
    </div>
  );
}

export function TransactionPageView({
  config,
  currency,
  accounts,
  categories,
  autoOpenForm = false,
}: TransactionPageViewProps) {
  const [filters, setFilters] = useState<TransactionFiltersState>(() =>
    createDefaultFilters(config)
  );
  const [formOpen, setFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<SerializedTransaction | null>(null);

  const { data, isLoading, isError, error } = useTransactions(filters);

  useEffect(() => {
    if (autoOpenForm) {
      setEditingTransaction(null);
      setFormOpen(true);
    }
  }, [autoOpenForm]);

  function openCreateDialog() {
    setEditingTransaction(null);
    setFormOpen(true);
  }

  function openEditDialog(transaction: SerializedTransaction) {
    setEditingTransaction(transaction);
    setFormOpen(true);
  }

  function handleFormOpenChange(open: boolean) {
    setFormOpen(open);
    if (!open) {
      setEditingTransaction(null);
    }
  }

  const summary = data?.summary ?? { income: 0, expense: 0, net: 0 };
  const totalPages = data?.totalPages ?? 1;
  const filteredCategories = config.fixedType
    ? categories.filter((category) => category.type === config.fixedType)
    : categories;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader title={config.title} description={config.description} />
        <Button onClick={openCreateDialog}>
          <Plus />
          {config.addButtonLabel}
        </Button>
      </div>

      <SummaryCards
        config={config}
        currency={currency}
        summary={summary}
        total={data?.total ?? 0}
      />

      <TransactionFilters
        filters={filters}
        accounts={accounts}
        categories={filteredCategories}
        onChange={setFilters}
        hideTypeFilter={config.hideTypeFilter}
        searchPlaceholder={config.searchPlaceholder}
      />

      {isError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error instanceof Error
            ? error.message
            : "Failed to load transactions"}
        </div>
      )}

      <TransactionsTable
        transactions={data?.data ?? []}
        currency={currency}
        isLoading={isLoading}
        onEdit={openEditDialog}
        hideTypeColumn={config.hideTypeColumn}
        emptyTitle={config.emptyTitle}
        emptyDescription={config.emptyDescription}
        amountMode={config.summaryMode}
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {filters.page} of {totalPages}
            {data?.total !== undefined && ` · ${data.total} total`}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={filters.page <= 1 || isLoading}
              onClick={() =>
                setFilters((current) => ({
                  ...current,
                  page: Math.max(1, current.page - 1),
                }))
              }
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={filters.page >= totalPages || isLoading}
              onClick={() =>
                setFilters((current) => ({
                  ...current,
                  page: current.page + 1,
                }))
              }
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <TransactionFormDialog
        open={formOpen}
        onOpenChange={handleFormOpenChange}
        accounts={accounts}
        categories={categories}
        transaction={editingTransaction}
        defaultType={config.defaultFormType}
        lockType={config.lockFormType}
      />
    </div>
  );
}
