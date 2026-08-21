import type { NavItem } from "@/types";

export const MAIN_NAV: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { title: "Transactions", href: "/transactions", icon: "ArrowLeftRight" },
  { title: "Expenses", href: "/expenses", icon: "TrendingDown" },
  { title: "Income", href: "/income", icon: "TrendingUp" },
  { title: "Budgets", href: "/budgets", icon: "PiggyBank" },
  { title: "Analytics", href: "/analytics", icon: "BarChart3" },
  { title: "Goals", href: "/goals", icon: "Target" },
  { title: "Calendar", href: "/calendar", icon: "Calendar" },
];

export const SECONDARY_NAV: NavItem[] = [
  { title: "Accounts", href: "/accounts", icon: "Wallet" },
  { title: "Categories", href: "/categories", icon: "Tags" },
  { title: "Settings", href: "/settings", icon: "Settings" },
];

export const MOBILE_NAV: NavItem[] = [
  { title: "Home", href: "/dashboard", icon: "LayoutDashboard" },
  { title: "Transactions", href: "/transactions", icon: "ArrowLeftRight" },
  { title: "Add", href: "/expenses/new", icon: "Plus" },
  { title: "Analytics", href: "/analytics", icon: "BarChart3" },
  { title: "Settings", href: "/settings", icon: "Settings" },
];
