"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { TransactionFormValues } from "@/schemas";
import {
  createTransactionRequest,
  deleteTransactionRequest,
  fetchTransactions,
  updateTransactionRequest,
} from "@/features/transactions/lib/api";
import type { TransactionFiltersState } from "@/features/transactions/types";

export function useTransactions(filters: TransactionFiltersState) {
  return useQuery({
    queryKey: ["transactions", filters],
    queryFn: () => fetchTransactions(filters),
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TransactionFormValues) => createTransactionRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: TransactionFormValues;
    }) => updateTransactionRequest(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTransactionRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
