import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SerializedTransaction } from "@/lib/serialize";
import { formatCurrency, formatDate } from "@/utils/format";

interface RecentTransactionsProps {
  transactions: SerializedTransaction[];
  currency: string;
}

export function RecentTransactions({
  transactions,
  currency,
}: RecentTransactionsProps) {
  return (
    <Card className="glass-card border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Recent transactions</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          render={<Link href="/transactions" />}
        >
          View all
          <ArrowRight />
        </Button>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-sm text-muted-foreground">
              No transactions yet.
            </p>
            <Button
              className="mt-4"
              size="sm"
              nativeButton={false}
              render={<Link href="/transactions" />}
            >
              Add your first transaction
            </Button>
          </div>
        ) : (
          <div className="space-y-1">
            {transactions.map((transaction) => {
              const isIncome = transaction.type === "INCOME";

              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between rounded-lg px-2 py-3 transition-colors hover:bg-muted/50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(transaction.date)}
                      {transaction.category
                        ? ` · ${transaction.category.name}`
                        : ""}
                    </p>
                  </div>
                  <p
                    className={`ml-4 shrink-0 font-semibold tabular-nums ${
                      isIncome
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-foreground"
                    }`}
                  >
                    {isIncome ? "+" : "-"}
                    {formatCurrency(transaction.amount, currency)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
