import { type NextRequest, NextResponse } from "next/server";
import { TransactionType } from "@/generated/prisma/client";
import { ApiError, requireAuthUser } from "@/lib/api-auth";
import { serializeTransaction } from "@/lib/serialize";
import { transactionSchema } from "@/schemas";
import {
  createTransaction,
  getTransactions,
} from "@/services/transaction.service";

function parseTransactionType(value: string | null) {
  if (!value || value === "ALL") return undefined;
  if (Object.values(TransactionType).includes(value as TransactionType)) {
    return value as TransactionType;
  }
  return undefined;
}

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuthUser();
    const { searchParams } = new URL(req.url);

    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const pageSize = Math.min(
      100,
      Math.max(1, Number(searchParams.get("pageSize") ?? 20))
    );
    const search = searchParams.get("search")?.trim() || undefined;
    const type = parseTransactionType(searchParams.get("type"));
    const accountId = searchParams.get("accountId") || undefined;
    const categoryId = searchParams.get("categoryId") || undefined;
    const fromParam = searchParams.get("from");
    const toParam = searchParams.get("to");

    const result = await getTransactions({
      userId: user.id,
      search,
      type,
      accountId,
      categoryId,
      from: fromParam ? new Date(fromParam) : undefined,
      to: toParam ? new Date(toParam) : undefined,
      page,
      pageSize,
    });

    return NextResponse.json({
      data: result.transactions.map(serializeTransaction),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
      totalPages: result.totalPages,
      summary: result.summary,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }

    console.error("GET /api/transactions failed:", error);
    return NextResponse.json(
      { message: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuthUser();
    const body = await req.json();
    const parsed = transactionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const transaction = await createTransaction(user.id, parsed.data);

    return NextResponse.json(
      { data: serializeTransaction(transaction) },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }

    if (error instanceof Error && error.message === "Account not found") {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    if (error instanceof Error && error.message === "Category not found") {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    console.error("POST /api/transactions failed:", error);
    return NextResponse.json(
      { message: "Failed to create transaction" },
      { status: 500 }
    );
  }
}
