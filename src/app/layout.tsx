import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppProviders } from "@/providers/app-providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Vault — Smart Expense Tracker",
    template: "%s | Vault",
  },
  description:
    "Track expenses, manage budgets, and gain financial clarity with Vault — the modern expense tracker built for professionals.",
  keywords: [
    "expense tracker",
    "budget",
    "personal finance",
    "money management",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body
        className={`${inter.variable} min-h-full font-sans antialiased`}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
