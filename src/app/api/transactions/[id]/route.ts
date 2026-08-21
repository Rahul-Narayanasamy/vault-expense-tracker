import { type NextRequest, NextResponse } from "next/server";
import { ApiError, requireAuthUser } from "@/lib/api-auth";
import { serializeTransaction } from "@/lib/serialize";
import { transactionSchema } from "@/schemas";
import {
  deleteTransaction,
  updateTransaction,
} from "@/services/transaction.service";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const user = await requireAuthUser();
    const { id } = await context.params;
    const body = await req.json();
    const parsed = transactionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const transaction = await updateTransaction(user.id, id, parsed.data);

    return NextResponse.json({ data: serializeTransaction(transaction) });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }

    if (
      error instanceof Error &&
      (error.message === "Transaction not found" ||
        error.message === "Account not found" ||
        error.message === "Category not found")
    ) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    console.error("PATCH /api/transactions/[id] failed:", error);
    return NextResponse.json(
      { message: "Failed to update transaction" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, context: RouteContext) {
  try {
    const user = await requireAuthUser();
    const { id } = await context.params;

    await deleteTransaction(user.id, id);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }

    if (error instanceof Error && error.message === "Transaction not found") {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }

    console.error("DELETE /api/transactions/[id] failed:", error);
    return NextResponse.json(
      { message: "Failed to delete transaction" },
      { status: 500 }
    );
  }
}
