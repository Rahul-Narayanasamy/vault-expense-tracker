import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bell,
  PiggyBank,
  Shield,
  Sparkles,
  Target,
  Wallet,
  Zap,
} from "lucide-react";
import { AuthCtaButton } from "@/components/shared/auth-cta";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Wallet,
    title: "Multi-account tracking",
    description:
      "Connect bank accounts, credit cards, and cash wallets in one unified view.",
  },
  {
    icon: PiggyBank,
    title: "Smart budgets",
    description:
      "Set monthly, weekly, or category budgets with real-time progress and alerts.",
  },
  {
    icon: BarChart3,
    title: "Deep analytics",
    description:
      "Visualize spending trends, cash flow, and category breakdowns with beautiful charts.",
  },
  {
    icon: Target,
    title: "Savings goals",
    description:
      "Define goals, track progress, and celebrate milestones along the way.",
  },
  {
    icon: Bell,
    title: "Bill reminders",
    description:
      "Never miss a payment with recurring expense tracking and upcoming bill alerts.",
  },
  {
    icon: Shield,
    title: "Bank-grade security",
    description:
      "Your financial data is encrypted and protected with enterprise-level security.",
  },
];

const stats = [
  { value: "$2.4M+", label: "Tracked monthly" },
  { value: "12k+", label: "Active users" },
  { value: "99.9%", label: "Uptime" },
  { value: "4.9★", label: "User rating" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div className="absolute inset-0 grid-pattern opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-6 gap-1.5 px-3 py-1">
            <Sparkles className="h-3 w-3" />
            Now with AI spending insights
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Financial clarity,{" "}
            <span className="text-gradient">beautifully simple</span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
            Vault helps you track expenses, manage budgets, and understand your
            money — with the polish of a product you&apos;d pay for.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <AuthCtaButton size="lg" className="h-12 px-8 text-base">
              Start for free
              <ArrowRight className="ml-2 h-4 w-4" />
            </AuthCtaButton>
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8 text-base"
              nativeButton={false}
              render={<Link href="#features" />}
            >
              See how it works
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <Card className="overflow-hidden border-border/50 shadow-2xl shadow-primary/5">
            <CardContent className="p-0">
              <div className="border-b border-border/50 bg-muted/30 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
                  <div className="h-3 w-3 rounded-full bg-green-400/80" />
                  <span className="ml-2 text-xs text-muted-foreground">
                    vault.app/dashboard
                  </span>
                </div>
              </div>
              <DashboardPreview />
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold sm:text-3xl">{stat.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <div className="grid gap-4 p-6 sm:grid-cols-4 sm:gap-6">
      {[
        { label: "Total Balance", value: "$24,562", change: "+12.5%", positive: true },
        { label: "Income", value: "$8,420", change: "+3.2%", positive: true },
        { label: "Expenses", value: "$3,847", change: "-8.1%", positive: false },
        { label: "Savings", value: "$4,573", change: "+18.4%", positive: true },
      ].map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-border/50 bg-card p-4"
        >
          <p className="text-xs text-muted-foreground">{stat.label}</p>
          <p className="mt-1 text-xl font-semibold">{stat.value}</p>
          <p
            className={`mt-1 text-xs font-medium ${
              stat.positive ? "text-emerald-500" : "text-red-500"
            }`}
          >
            {stat.change}
          </p>
        </div>
      ))}
      <div className="col-span-full rounded-xl border border-border/50 bg-card p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Spending Overview</p>
          <Zap className="h-4 w-4 text-primary" />
        </div>
        <div className="mt-4 flex h-32 items-end gap-2">
          {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm bg-primary/20 transition-all hover:bg-primary/40"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to master your money
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Powerful features wrapped in an interface you&apos;ll actually enjoy
            using every day.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group border-border/50 transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
            >
              <CardContent className="p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 text-center sm:px-16">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-[oklch(0.45_0.22_320)]" />
          <div className="relative">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              Ready to take control of your finances?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
              Join thousands of professionals who trust Vault to manage their
              money. Free to start, no credit card required.
            </p>
            <AuthCtaButton
              size="lg"
              variant="secondary"
              className="mt-8 h-12 px-8 text-base"
            >
              Get started for free
              <ArrowRight className="ml-2 h-4 w-4" />
            </AuthCtaButton>
          </div>
        </div>
      </div>
    </section>
  );
}
