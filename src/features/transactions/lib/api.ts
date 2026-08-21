import type { TransactionFormValues } from "@/schemas";
import type {
  TransactionFiltersState,
  TransactionsResponse,
} from "@/features/transactions/types";
import type { SerializedTransaction } from "@/lib/serialize";

function buildQueryString(filters: Partial<TransactionFiltersState>) {
  const params = new URLSearchParams();

  if (filters.search) params.set("search", filters.search);
  if (filters.type && filters.type !== "ALL") params.set("type", filters.type);
  if (filters.accountId) params.set("accountId", filters.accountId);
  if (filters.categoryId) params.set("categoryId", filters.categoryId);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.pageSize) params.set("pageSize", String(filters.pageSize));

  return params.toString();
}

async function parseResponse<T>(response: Response): Promise<T> {
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.message ?? "Request failed");
  }

  return payload as T;
}

export async function fetchTransactions(
  filters: TransactionFiltersState
): Promise<TransactionsResponse> {
  const query = buildQueryString(filters);
  const response = await fetch(`/api/transactions?${query}`);
  return parseResponse<TransactionsResponse>(response);
}

export async function createTransactionRequest(data: TransactionFormValues) {
  const response = await fetch("/api/transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return parseResponse<{ data: SerializedTransaction }>(response);
}

export async function updateTransactionRequest(
  id: string,
  data: TransactionFormValues
) {
  const response = await fetch(`/api/transactions/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return parseResponse<{ data: SerializedTransaction }>(response);
}

export async function deleteTransactionRequest(id: string) {
  const response = await fetch(`/api/transactions/${id}`, {
    method: "DELETE",
  });

  return parseResponse<{ success: boolean }>(response);
}
