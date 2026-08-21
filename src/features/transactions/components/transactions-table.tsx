"use client";

import { useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  MoreHorizontal,
  Pencil,
  Receipt,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteTransaction } from "@/features/transactions/hooks/use-transactions";
import type { SerializedTransaction } from "@/lib/serialize";
import { formatCurrency, formatDate } from "@/utils/format";

interface TransactionsTableProps {
  transactions: SerializedTransaction[];
  currency: string;
  isLoading?: boolean;
  onEdit: (transaction: SerializedTransaction) => void;
  hideTypeColumn?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  amountMode?: "all" | "expense" | "income";
}

function TransactionTypeBadge({ type }: { type: SerializedTransaction["type"] }) {
  if (type === "INCOME") {
    return (
      <Badge variant="secondary" className="gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
        <ArrowUpRight className="size-3" />
        Income
      </Badge>
    );
  }

  if (type === "EXPENSE") {
    return (
      <Badge variant="secondary" className="gap-1 bg-rose-500/10 text-rose-600 dark:text-rose-400">
        <ArrowDownLeft className="size-3" />
        Expense
      </Badge>
    );
  }

  return <Badge variant="outline">Transfer</Badge>;
}

function CategoryDot({ color }: { color: string }) {
  return (
    <span
      className="inline-block size-2.5 shrink-0 rounded-full"
      style={{ backgroundColor: color }}
    />
  );
}

export function TransactionsTable({
  transactions,
  currency,
  isLoading,
  onEdit,
  hideTypeColumn = false,
  emptyTitle = "No transactions yet",
  emptyDescription = "Add your first income or expense to start tracking your money.",
  amountMode = "all",
}: TransactionsTableProps) {
  const deleteMutation = useDeleteTransaction();
  const [deleteTarget, setDeleteTarget] =
    useState<SerializedTransaction | null>(null);

  async function handleDelete() {
    if (!deleteTarget) return;

    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success("Transaction deleted");
      setDeleteTarget(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete transaction"
      );
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="glass-card flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
        <Receipt className="size-12 text-muted-foreground/40" />
        <h3 className="mt-4 text-lg font-semibold">{emptyTitle}</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          {emptyDescription}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="glass-card overflow-hidden rounded-xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Account</TableHead>
              {!hideTypeColumn && <TableHead>Type</TableHead>}
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => {
              const isIncome = transaction.type === "INCOME";
              const showPlus =
                amountMode === "income" ||
                (amountMode === "all" && isIncome);

              return (
                <TableRow key={transaction.id}>
                  <TableCell className="text-muted-foreground">
                    {formatDate(transaction.date)}
                  </TableCell>
                  <TableCell className="max-w-[220px] truncate font-medium">
                    {transaction.description}
                  </TableCell>
                  <TableCell>
                    {transaction.category ? (
                      <span className="flex items-center gap-2">
                        <CategoryDot color={transaction.category.color} />
                        {transaction.category.name}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>{transaction.account.name}</TableCell>
                  {!hideTypeColumn && (
                    <TableCell>
                      <TransactionTypeBadge type={transaction.type} />
                    </TableCell>
                  )}
                  <TableCell
                    className={`text-right font-semibold tabular-nums ${
                      showPlus
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-foreground"
                    }`}
                  >
                    {showPlus ? "+" : "-"}
                    {formatCurrency(transaction.amount, currency)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button variant="ghost" size="icon-sm" />
                        }
                      >
                        <MoreHorizontal />
                        <span className="sr-only">Open menu</span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(transaction)}>
                          <Pencil />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => setDeleteTarget(transaction)}
                        >
                          <Trash2 />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete transaction?</DialogTitle>
            <DialogDescription>
              This will permanently remove &quot;{deleteTarget?.description}
              &quot; and update your account balance.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
