import { Prisma } from "@/generated/prisma/client";
import {
  DEFAULT_EXPENSE_CATEGORIES,
  DEFAULT_INCOME_CATEGORIES,
} from "@/constants/categories";
import { prisma } from "@/lib/prisma";

interface ClerkUserData {
  clerkId: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
}

function getDefaultCategories() {
  return [
    ...DEFAULT_EXPENSE_CATEGORIES.map((category) => ({
      name: category.name,
      type: "EXPENSE" as const,
      color: category.color,
      icon: category.icon,
      isDefault: true,
    })),
    ...DEFAULT_INCOME_CATEGORIES.map((category) => ({
      name: category.name,
      type: "INCOME" as const,
      color: category.color,
      icon: category.icon,
      isDefault: true,
    })),
  ];
}

export async function syncUserFromClerk(data: ClerkUserData) {
  const profile = {
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    imageUrl: data.imageUrl,
  };

  const existing = await prisma.user.findUnique({
    where: { clerkId: data.clerkId },
  });

  if (existing) {
    return prisma.user.update({
      where: { clerkId: data.clerkId },
      data: profile,
    });
  }

  try {
    const user = await prisma.user.create({
      data: {
        clerkId: data.clerkId,
        ...profile,
        settings: {
          create: {},
        },
        accounts: {
          create: {
            name: "Cash",
            type: "CASH",
            balance: 0,
            isDefault: true,
            color: "#6366f1",
            icon: "Wallet",
          },
        },
        categories: {
          create: getDefaultCategories(),
        },
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: "USER_CREATED",
        entity: "user",
        entityId: user.id,
      },
    });

    return user;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const user = await prisma.user.findUnique({
        where: { clerkId: data.clerkId },
      });

      if (user) {
        return prisma.user.update({
          where: { clerkId: data.clerkId },
          data: profile,
        });
      }
    }

    throw error;
  }
}

export async function deleteUserByClerkId(clerkId: string) {
  return prisma.user.delete({
    where: { clerkId },
  });
}

export async function getUserByClerkId(clerkId: string) {
  return prisma.user.findUnique({
    where: { clerkId },
    include: {
      settings: true,
      accounts: { where: { isArchived: false } },
    },
  });
}
