import type {
  AccountType,
  BudgetPeriod,
  GoalStatus,
  RecurrenceFrequency,
  TransactionType,
} from "@/generated/prisma/client";

export type {
  AccountType,
  BudgetPeriod,
  GoalStatus,
  RecurrenceFrequency,
  TransactionType,
};

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: string;
  disabled?: boolean;
}

export interface StatCard {
  title: string;
  value: string;
  change?: number;
  changeLabel?: string;
  trend?: "up" | "down" | "neutral";
}

export interface ChartDataPoint {
  name: string;
  value: number;
  fill?: string;
}

export interface DateRange {
  from: Date;
  to: Date;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}
