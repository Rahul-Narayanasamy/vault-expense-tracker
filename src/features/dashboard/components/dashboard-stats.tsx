import {
  PiggyBank,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { formatCurrency } from "@/utils/format";

interface DashboardStatsProps {
  currency: string;
  stats: {
    totalBalance: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    monthlySavings: number;
  };
}

const statCards = [
  {
    key: "totalBalance" as const,
    label: "Total Balance",
    icon: Wallet,
    accent: "text-primary",
  },
  {
    key: "monthlyIncome" as const,
    label: "Income",
    subtitle: "This month",
    icon: TrendingUp,
    accent: "text-emerald-600 dark:text-emerald-400",
  },
  {
    key: "monthlyExpenses" as const,
    label: "Expenses",
    subtitle: "This month",
    icon: TrendingDown,
    accent: "text-rose-600 dark:text-rose-400",
  },
  {
    key: "monthlySavings" as const,
    label: "Savings",
    subtitle: "This month",
    icon: PiggyBank,
    accent: "text-violet-600 dark:text-violet-400",
  },
];

export function DashboardStats({ currency, stats }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card) => {
        const Icon = card.icon;
        const value = stats[card.key];
        const savingsNegative =
          card.key === "monthlySavings" && value < 0;

        return (
          <div key={card.key} className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <Icon className="size-4 text-muted-foreground" />
            </div>
            {card.subtitle && (
              <p className="mt-0.5 text-xs text-muted-foreground/80">
                {card.subtitle}
              </p>
            )}
            <p
              className={`mt-2 text-2xl font-bold tabular-nums ${
                savingsNegative
                  ? "text-rose-600 dark:text-rose-400"
                  : card.accent
              }`}
            >
              {formatCurrency(value, currency)}
            </p>
          </div>
        );
      })}
    </div>
  );
}
