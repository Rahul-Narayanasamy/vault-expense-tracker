import type { TransactionType } from "@/types";

export interface TransactionPageConfig {
  title: string;
  description: string;
  addButtonLabel: string;
  searchPlaceholder: string;
  emptyTitle: string;
  emptyDescription: string;
  fixedType?: TransactionType;
  lockFormType?: boolean;
  defaultFormType?: TransactionType;
  hideTypeFilter?: boolean;
  hideTypeColumn?: boolean;
  summaryMode: "all" | "expense" | "income";
}

export const TRANSACTIONS_PAGE_CONFIG: TransactionPageConfig = {
  title: "Transactions",
  description: "View and manage all your income and expenses.",
  addButtonLabel: "Add transaction",
  searchPlaceholder: "Search transactions...",
  emptyTitle: "No transactions yet",
  emptyDescription:
    "Add your first income or expense to start tracking your money.",
  summaryMode: "all",
};

export const EXPENSES_PAGE_CONFIG: TransactionPageConfig = {
  title: "Expenses",
  description: "Track spending across categories and accounts.",
  addButtonLabel: "Add expense",
  searchPlaceholder: "Search expenses...",
  emptyTitle: "No expenses yet",
  emptyDescription: "Record your first expense to start tracking spending.",
  fixedType: "EXPENSE",
  lockFormType: true,
  defaultFormType: "EXPENSE",
  hideTypeFilter: true,
  hideTypeColumn: true,
  summaryMode: "expense",
};

export const INCOME_PAGE_CONFIG: TransactionPageConfig = {
  title: "Income",
  description: "Track salary, freelance, and other income sources.",
  addButtonLabel: "Add income",
  searchPlaceholder: "Search income...",
  emptyTitle: "No income yet",
  emptyDescription: "Record your first income source to track earnings.",
  fixedType: "INCOME",
  lockFormType: true,
  defaultFormType: "INCOME",
  hideTypeFilter: true,
  hideTypeColumn: true,
  summaryMode: "income",
};
