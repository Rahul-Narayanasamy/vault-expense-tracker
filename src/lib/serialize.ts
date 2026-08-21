import type { Prisma } from "@/generated/prisma/client";

type TransactionWithRelations = Prisma.TransactionGetPayload<{
  include: {
    account: { select: { id: true; name: true; color: true; type: true } };
    category: {
      select: { id: true; name: true; color: true; type: true };
    };
  };
}>;

export function serializeTransaction(transaction: TransactionWithRelations) {
  return {
    id: transaction.id,
    type: transaction.type,
    amount: Number(transaction.amount),
    description: transaction.description,
    notes: transaction.notes,
    date: transaction.date.toISOString(),
    accountId: transaction.accountId,
    categoryId: transaction.categoryId,
    account: transaction.account,
    category: transaction.category,
    createdAt: transaction.createdAt.toISOString(),
    updatedAt: transaction.updatedAt.toISOString(),
  };
}

export type SerializedTransaction = ReturnType<typeof serializeTransaction>;
