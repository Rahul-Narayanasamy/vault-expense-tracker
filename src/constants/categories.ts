export const DEFAULT_EXPENSE_CATEGORIES = [
  { name: "Food & Dining", color: "#f97316", icon: "UtensilsCrossed" },
  { name: "Transportation", color: "#3b82f6", icon: "Car" },
  { name: "Shopping", color: "#ec4899", icon: "ShoppingBag" },
  { name: "Entertainment", color: "#8b5cf6", icon: "Gamepad2" },
  { name: "Bills & Utilities", color: "#ef4444", icon: "Zap" },
  { name: "Healthcare", color: "#10b981", icon: "Heart" },
  { name: "Education", color: "#06b6d4", icon: "GraduationCap" },
  { name: "Travel", color: "#f59e0b", icon: "Plane" },
  { name: "Housing", color: "#6366f1", icon: "Home" },
  { name: "Personal Care", color: "#d946ef", icon: "Sparkles" },
  { name: "Subscriptions", color: "#64748b", icon: "Repeat" },
  { name: "Other", color: "#94a3b8", icon: "MoreHorizontal" },
] as const;

export const DEFAULT_INCOME_CATEGORIES = [
  { name: "Salary", color: "#10b981", icon: "Briefcase" },
  { name: "Freelance", color: "#3b82f6", icon: "Laptop" },
  { name: "Investments", color: "#8b5cf6", icon: "TrendingUp" },
  { name: "Bonus", color: "#f59e0b", icon: "Gift" },
  { name: "Rental Income", color: "#06b6d4", icon: "Building" },
  { name: "Other Income", color: "#94a3b8", icon: "CircleDollarSign" },
] as const;

export const SUPPORTED_CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
] as const;
