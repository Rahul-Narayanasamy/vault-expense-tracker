import { endOfMonth, startOfMonth } from "date-fns";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { serializeTransaction } from "@/lib/serialize";

const transactionInclude = {
  account: {
    select: { id: true, name: true, color: true, type: true },
  },
  category: {
    select: { id: true, name: true, color: true, type: true },
  },
} as const;

export async function getDashboardData(userId: string) {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const [accounts, monthlyAggregates, recentTransactions, categorySpending] =
    await Promise.all([
      prisma.account.findMany({
        where: { userId, isArchived: false },
        select: { balance: true },
      }),
      prisma.transaction.groupBy({
        by: ["type"],
        where: {
          userId,
          date: { gte: monthStart, lte: monthEnd },
        },
        _sum: { amount: true },
      }),
      prisma.transaction.findMany({
        where: { userId },
        include: transactionInclude,
        orderBy: [{ date: "desc" }, { createdAt: "desc" }],
        take: 6,
      }),
      prisma.transaction.groupBy({
        by: ["categoryId"],
        where: {
          userId,
          type: "EXPENSE",
          date: { gte: monthStart, lte: monthEnd },
        },
        _sum: { amount: true },
      }),
    ]);

  const totalBalance = accounts
    .reduce((sum, account) => sum.plus(account.balance), new Prisma.Decimal(0))
    .toNumber();

  const income =
    monthlyAggregates.find((item) => item.type === "INCOME")?._sum.amount ??
    new Prisma.Decimal(0);
  const expenses =
    monthlyAggregates.find((item) => item.type === "EXPENSE")?._sum.amount ??
    new Prisma.Decimal(0);

  const categoryIds = categorySpending
    .map((item) => item.categoryId)
    .filter((id): id is string => Boolean(id));

  const categories =
    categoryIds.length > 0
      ? await prisma.category.findMany({
          where: { id: { in: categoryIds } },
          select: { id: true, name: true, color: true },
        })
      : [];

  const spendingByCategory = categorySpending
    .map((item) => {
      const category = categories.find(
        (entry) => entry.id === item.categoryId
      );

      return {
        name: category?.name ?? "Uncategorized",
        value: Number(item._sum.amount ?? 0),
        color: category?.color ?? "#94a3b8",
      };
    })
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  return {
    stats: {
      totalBalance,
      monthlyIncome: income.toNumber(),
      monthlyExpenses: expenses.toNumber(),
      monthlySavings: income.minus(expenses).toNumber(),
    },
    recentTransactions: recentTransactions.map(serializeTransaction),
    spendingByCategory,
  };
}
