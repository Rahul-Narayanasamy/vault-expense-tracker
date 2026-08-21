import type { SerializedTransaction } from "@/lib/serialize";
import type { TransactionType } from "@/types";

export interface TransactionAccount {
  id: string;
  name: string;
  type: string;
  color: string | null;
  isDefault?: boolean;
}

export interface TransactionCategory {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
}

export interface TransactionFiltersState {
  search: string;
  type: TransactionType | "ALL";
  accountId: string;
  categoryId: string;
  page: number;
  pageSize: number;
}

export interface TransactionsResponse {
  data: SerializedTransaction[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  summary: {
    income: number;
    expense: number;
    net: number;
  };
}

export interface TransactionFormOptions {
  accounts: TransactionAccount[];
  categories: TransactionCategory[];
}
