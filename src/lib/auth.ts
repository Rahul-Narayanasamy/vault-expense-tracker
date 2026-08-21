import { cache } from "react";
import { auth, currentUser } from "@clerk/nextjs/server";
import {
  getUserByClerkId,
  syncUserFromClerk,
} from "@/services/user.service";

export const getCurrentUser = cache(async () => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  let user = await getUserByClerkId(userId);

  if (!user) {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return null;
    }

    const primaryEmail = clerkUser.emailAddresses.find(
      (email) => email.id === clerkUser.primaryEmailAddressId
    )?.emailAddress;

    if (!primaryEmail) {
      throw new Error("User has no primary email address");
    }

    await syncUserFromClerk({
      clerkId: clerkUser.id,
      email: primaryEmail,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl,
    });

    user = await getUserByClerkId(userId);
  }

  return user;
});
