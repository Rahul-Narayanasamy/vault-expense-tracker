"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  TransactionAccount,
  TransactionCategory,
  TransactionFiltersState,
} from "@/features/transactions/types";

interface TransactionFiltersProps {
  filters: TransactionFiltersState;
  accounts: TransactionAccount[];
  categories: TransactionCategory[];
  onChange: (filters: TransactionFiltersState) => void;
  hideTypeFilter?: boolean;
  searchPlaceholder?: string;
}

export function TransactionFilters({
  filters,
  accounts,
  categories,
  onChange,
  hideTypeFilter = false,
  searchPlaceholder = "Search transactions...",
}: TransactionFiltersProps) {
  const [search, setSearch] = useState(filters.search);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (search !== filters.search) {
        onChange({ ...filters, search, page: 1 });
      }
    }, 300);

    return () => window.clearTimeout(timer);
  }, [filters, onChange, search]);

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="relative flex-1">
        <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={searchPlaceholder}
          className="pl-8"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {!hideTypeFilter && (
          <Select
            value={filters.type}
            items={[
              { value: "ALL", label: "All types" },
              { value: "EXPENSE", label: "Expense" },
              { value: "INCOME", label: "Income" },
            ]}
            onValueChange={(value) =>
              value &&
              onChange({
                ...filters,
                type: value as TransactionFiltersState["type"],
                categoryId: "",
                page: 1,
              })
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All types</SelectItem>
              <SelectItem value="EXPENSE">Expense</SelectItem>
              <SelectItem value="INCOME">Income</SelectItem>
            </SelectContent>
          </Select>
        )}

        <Select
          value={filters.accountId || "ALL"}
          items={[
            { value: "ALL", label: "All accounts" },
            ...accounts.map((account) => ({
              value: account.id,
              label: account.name,
            })),
          ]}
          onValueChange={(value) =>
            onChange({
              ...filters,
              accountId: !value || value === "ALL" ? "" : value,
              page: 1,
            })
          }
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Account" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All accounts</SelectItem>
            {accounts.map((account) => (
              <SelectItem key={account.id} value={account.id}>
                {account.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.categoryId || "ALL"}
          items={[
            { value: "ALL", label: "All categories" },
            ...categories
              .filter(
                (category) =>
                  filters.type === "ALL" || category.type === filters.type
              )
              .map((category) => ({
                value: category.id,
                label: category.name,
              })),
          ]}
          onValueChange={(value) =>
            onChange({
              ...filters,
              categoryId: !value || value === "ALL" ? "" : value,
              page: 1,
            })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All categories</SelectItem>
            {categories
              .filter(
                (category) =>
                  filters.type === "ALL" || category.type === filters.type
              )
              .map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
