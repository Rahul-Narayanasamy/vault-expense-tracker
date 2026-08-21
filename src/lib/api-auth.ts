import { auth } from "@clerk/nextjs/server";
import { getCurrentUser } from "@/lib/auth";

export async function requireAuthUser() {
  const { userId } = await auth();

  if (!userId) {
    throw new ApiError("Unauthorized", 401);
  }

  const user = await getCurrentUser();

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  return user;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}
