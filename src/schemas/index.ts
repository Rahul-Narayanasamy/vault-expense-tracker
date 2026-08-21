import { z } from "zod";

export const transactionSchema = z.object({
  type: z.enum(["EXPENSE", "INCOME", "TRANSFER"]),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  description: z.string().min(1, "Description is required").max(200),
  notes: z.string().max(1000).optional(),
  date: z.coerce.date(),
  accountId: z.string().min(1, "Account is required"),
  categoryId: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;

export const budgetSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  period: z.enum(["WEEKLY", "MONTHLY", "YEARLY"]),
  categoryId: z.string().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  alertAt: z.coerce.number().min(1).max(100).default(80),
});

export type BudgetFormValues = z.infer<typeof budgetSchema>;

export const accountSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  type: z.enum([
    "CHECKING",
    "SAVINGS",
    "CREDIT_CARD",
    "CASH",
    "INVESTMENT",
    "OTHER",
  ]),
  balance: z.coerce.number().default(0),
  currency: z.string().default("USD"),
  color: z.string().optional(),
  icon: z.string().optional(),
});

export type AccountFormValues = z.infer<typeof accountSchema>;

export const goalSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  targetAmount: z.coerce.number().positive("Target must be greater than 0"),
  currentAmount: z.coerce.number().min(0).default(0),
  deadline: z.coerce.date().optional(),
  color: z.string().default("#10b981"),
});

export type GoalFormValues = z.infer<typeof goalSchema>;

export const userSettingsSchema = z.object({
  currency: z.string().min(3).max(3),
  timezone: z.string(),
  locale: z.string(),
  theme: z.enum(["light", "dark", "system"]),
  emailNotifications: z.boolean(),
  budgetAlerts: z.boolean(),
  billReminders: z.boolean(),
});

export type UserSettingsFormValues = z.infer<typeof userSettingsSchema>;
