import { Prisma, type TransactionType } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { TransactionFormValues } from "@/schemas";

const transactionInclude = {
  account: {
    select: { id: true, name: true, color: true, type: true },
  },
  category: {
    select: { id: true, name: true, color: true, type: true },
  },
} as const;

export interface TransactionFilters {
  userId: string;
  search?: string;
  type?: TransactionType;
  accountId?: string;
  categoryId?: string;
  from?: Date;
  to?: Date;
  page?: number;
  pageSize?: number;
}

function getBalanceDelta(type: TransactionType, amount: Prisma.Decimal) {
  if (type === "EXPENSE") return amount.negated();
  if (type === "INCOME") return amount;
  return new Prisma.Decimal(0);
}

async function assertAccountOwnership(userId: string, accountId: string) {
  const account = await prisma.account.findFirst({
    where: { id: accountId, userId, isArchived: false },
  });

  if (!account) {
    throw new Error("Account not found");
  }

  return account;
}

async function assertCategoryOwnership(
  userId: string,
  categoryId: string,
  type: TransactionType
) {
  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId, type },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
}

export async function getTransactions(filters: TransactionFilters) {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 20;
  const skip = (page - 1) * pageSize;

  const where: Prisma.TransactionWhereInput = {
    userId: filters.userId,
    ...(filters.search && {
      OR: [
        { description: { contains: filters.search, mode: "insensitive" } },
        { notes: { contains: filters.search, mode: "insensitive" } },
      ],
    }),
    ...(filters.type && { type: filters.type }),
    ...(filters.accountId && { accountId: filters.accountId }),
    ...(filters.categoryId && { categoryId: filters.categoryId }),
    ...((filters.from || filters.to) && {
      date: {
        ...(filters.from && { gte: filters.from }),
        ...(filters.to && { lte: filters.to }),
      },
    }),
  };

  const [transactions, total, aggregates] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: transactionInclude,
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      skip,
      take: pageSize,
    }),
    prisma.transaction.count({ where }),
    prisma.transaction.groupBy({
      by: ["type"],
      where,
      _sum: { amount: true },
    }),
  ]);

  const income =
    aggregates.find((item) => item.type === "INCOME")?._sum.amount ??
    new Prisma.Decimal(0);
  const expense =
    aggregates.find((item) => item.type === "EXPENSE")?._sum.amount ??
    new Prisma.Decimal(0);

  return {
    transactions,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
    summary: {
      income: income.toNumber(),
      expense: expense.toNumber(),
      net: income.minus(expense).toNumber(),
    },
  };
}

export async function getTransactionFormOptions(userId: string) {
  const [accounts, categories] = await Promise.all([
    prisma.account.findMany({
      where: { userId, isArchived: false },
      orderBy: [{ isDefault: "desc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        type: true,
        color: true,
        isDefault: true,
      },
    }),
    prisma.category.findMany({
      where: { userId },
      orderBy: [{ type: "asc" }, { name: "asc" }],
      select: { id: true, name: true, type: true, color: true },
    }),
  ]);

  return { accounts, categories };
}

export async function createTransaction(
  userId: string,
  data: TransactionFormValues
) {
  await assertAccountOwnership(userId, data.accountId);

  if (data.categoryId) {
    await assertCategoryOwnership(userId, data.categoryId, data.type);
  }

  const amount = new Prisma.Decimal(data.amount);
  const balanceDelta = getBalanceDelta(data.type, amount);

  return prisma.$transaction(async (tx) => {
    const transaction = await tx.transaction.create({
      data: {
        userId,
        accountId: data.accountId,
        categoryId: data.categoryId ?? null,
        type: data.type,
        amount,
        description: data.description,
        notes: data.notes ?? null,
        date: data.date,
      },
      include: transactionInclude,
    });

    if (!balanceDelta.isZero()) {
      await tx.account.update({
        where: { id: data.accountId },
        data: { balance: { increment: balanceDelta } },
      });
    }

    await tx.activityLog.create({
      data: {
        userId,
        action: "TRANSACTION_CREATED",
        entity: "transaction",
        entityId: transaction.id,
        metadata: { type: data.type, amount: data.amount },
      },
    });

    return transaction;
  });
}

export async function updateTransaction(
  userId: string,
  transactionId: string,
  data: TransactionFormValues
) {
  const existing = await prisma.transaction.findFirst({
    where: { id: transactionId, userId },
  });

  if (!existing) {
    throw new Error("Transaction not found");
  }

  await assertAccountOwnership(userId, data.accountId);

  if (data.categoryId) {
    await assertCategoryOwnership(userId, data.categoryId, data.type);
  }

  const amount = new Prisma.Decimal(data.amount);
  const oldDelta = getBalanceDelta(existing.type, existing.amount);
  const newDelta = getBalanceDelta(data.type, amount);

  return prisma.$transaction(async (tx) => {
    if (existing.accountId !== data.accountId) {
      if (!oldDelta.isZero()) {
        await tx.account.update({
          where: { id: existing.accountId },
          data: { balance: { increment: oldDelta.negated() } },
        });
      }

      if (!newDelta.isZero()) {
        await tx.account.update({
          where: { id: data.accountId },
          data: { balance: { increment: newDelta } },
        });
      }
    } else {
      const adjustment = newDelta.minus(oldDelta);

      if (!adjustment.isZero()) {
        await tx.account.update({
          where: { id: data.accountId },
          data: { balance: { increment: adjustment } },
        });
      }
    }

    const transaction = await tx.transaction.update({
      where: { id: transactionId },
      data: {
        accountId: data.accountId,
        categoryId: data.categoryId ?? null,
        type: data.type,
        amount,
        description: data.description,
        notes: data.notes ?? null,
        date: data.date,
      },
      include: transactionInclude,
    });

    await tx.activityLog.create({
      data: {
        userId,
        action: "TRANSACTION_UPDATED",
        entity: "transaction",
        entityId: transaction.id,
      },
    });

    return transaction;
  });
}

export async function deleteTransaction(userId: string, transactionId: string) {
  const existing = await prisma.transaction.findFirst({
    where: { id: transactionId, userId },
  });

  if (!existing) {
    throw new Error("Transaction not found");
  }

  const reversal = getBalanceDelta(existing.type, existing.amount).negated();

  return prisma.$transaction(async (tx) => {
    if (!reversal.isZero()) {
      await tx.account.update({
        where: { id: existing.accountId },
        data: { balance: { increment: reversal } },
      });
    }

    await tx.transaction.delete({
      where: { id: transactionId },
    });

    await tx.activityLog.create({
      data: {
        userId,
        action: "TRANSACTION_DELETED",
        entity: "transaction",
        entityId: transactionId,
      },
    });
  });
}
