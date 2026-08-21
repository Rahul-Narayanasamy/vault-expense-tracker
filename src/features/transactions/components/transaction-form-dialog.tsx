"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateTransaction,
  useUpdateTransaction,
} from "@/features/transactions/hooks/use-transactions";
import type {
  TransactionAccount,
  TransactionCategory,
} from "@/features/transactions/types";
import { cn } from "@/lib/utils";
import type { SerializedTransaction } from "@/lib/serialize";
import { transactionSchema, type TransactionFormValues } from "@/schemas";

import type { TransactionType } from "@/types";

interface TransactionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accounts: TransactionAccount[];
  categories: TransactionCategory[];
  transaction?: SerializedTransaction | null;
  defaultType?: TransactionType;
  lockType?: boolean;
}

function getDefaultValues(
  accounts: TransactionAccount[],
  transaction?: SerializedTransaction | null,
  defaultType: TransactionType = "EXPENSE"
): TransactionFormValues {
  const defaultAccount =
    accounts.find((account) => account.isDefault)?.id ?? accounts[0]?.id ?? "";

  if (transaction) {
    return {
      type: transaction.type === "TRANSFER" ? "EXPENSE" : transaction.type,
      amount: transaction.amount,
      description: transaction.description,
      notes: transaction.notes ?? undefined,
      date: new Date(transaction.date),
      accountId: transaction.accountId,
      categoryId: transaction.categoryId ?? undefined,
    };
  }

  return {
    type: defaultType,
    amount: 0,
    description: "",
    notes: undefined,
    date: new Date(),
    accountId: defaultAccount,
    categoryId: undefined,
  };
}

export function TransactionFormDialog({
  open,
  onOpenChange,
  accounts,
  categories,
  transaction,
  defaultType = "EXPENSE",
  lockType = false,
}: TransactionFormDialogProps) {
  const isEditing = Boolean(transaction);
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: getDefaultValues(accounts, transaction, defaultType),
  });

  const selectedType = form.watch("type");
  const selectedAccountId = form.watch("accountId");
  const selectedCategoryId = form.watch("categoryId");
  const filteredCategories = categories.filter(
    (category) => category.type === selectedType
  );

  const typeItems = [
    { value: "EXPENSE", label: "Expense" },
    { value: "INCOME", label: "Income" },
  ];

  const accountItems = accounts.map((account) => ({
    value: account.id,
    label: account.name,
  }));

  const categoryItems = [
    { value: "", label: "No category" },
    ...filteredCategories.map((category) => ({
      value: category.id,
      label: category.name,
    })),
  ];

  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues(accounts, transaction, defaultType));
    }
  }, [accounts, defaultType, form, open, transaction]);

  useEffect(() => {
    const categoryId = form.getValues("categoryId");
    if (
      categoryId &&
      !filteredCategories.some((category) => category.id === categoryId)
    ) {
      form.setValue("categoryId", undefined);
    }
  }, [filteredCategories, form, selectedType]);

  useEffect(() => {
    if (open && lockType) {
      form.setValue("type", defaultType);
    }
  }, [defaultType, form, lockType, open]);

  async function onSubmit(values: TransactionFormValues) {
    try {
      if (isEditing && transaction) {
        await updateMutation.mutateAsync({ id: transaction.id, data: values });
        toast.success("Transaction updated");
      } else {
        await createMutation.mutateAsync(values);
        toast.success("Transaction created");
      }

      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? `Edit ${defaultType === "INCOME" ? "income" : "expense"}`
              : lockType && defaultType === "INCOME"
                ? "Add income"
                : lockType
                  ? "Add expense"
                  : "Add transaction"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details of this entry."
              : lockType && defaultType === "INCOME"
                ? "Record a new income source."
                : lockType
                  ? "Record a new expense."
                  : "Record a new income or expense."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className={`grid gap-4 ${lockType ? "" : "sm:grid-cols-2"}`}>
            {!lockType && (
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  modal={false}
                  value={selectedType}
                  items={typeItems}
                  onValueChange={(value) =>
                    value &&
                    form.setValue("type", value as TransactionFormValues["type"], {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger id="type" className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EXPENSE">Expense</SelectItem>
                    <SelectItem value="INCOME">Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className={`space-y-2 ${lockType ? "" : ""}`}>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                {...form.register("amount")}
              />
              {form.formState.errors.amount && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.amount.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Coffee, salary, rent..."
              {...form.register("description")}
            />
            {form.formState.errors.description && (
              <p className="text-xs text-destructive">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={format(form.watch("date"), "yyyy-MM-dd")}
                onChange={(event) =>
                  form.setValue("date", new Date(event.target.value), {
                    shouldValidate: true,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="account">Account</Label>
              <Select
                modal={false}
                value={selectedAccountId}
                items={accountItems}
                onValueChange={(value) =>
                  value &&
                  form.setValue("accountId", value, { shouldValidate: true })
                }
              >
                <SelectTrigger id="account" className="w-full">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.accountId && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.accountId.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              modal={false}
              value={selectedCategoryId ?? ""}
              items={categoryItems}
              onValueChange={(value) =>
                form.setValue("categoryId", value || undefined, {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Select category (optional)" />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              rows={3}
              placeholder="Optional notes..."
              className={cn(
                "flex min-h-[80px] w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              )}
              {...form.register("notes")}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Saving..."
                : isEditing
                  ? "Save changes"
                  : "Add transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
