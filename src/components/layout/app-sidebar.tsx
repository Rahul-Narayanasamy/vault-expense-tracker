"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeftRight,
  BarChart3,
  Calendar,
  LayoutDashboard,
  PiggyBank,
  Settings,
  Tags,
  Target,
  TrendingDown,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { MAIN_NAV, SECONDARY_NAV } from "@/constants/navigation";
import { VaultLogo } from "@/components/shared/vault-logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  ArrowLeftRight,
  TrendingDown,
  TrendingUp,
  PiggyBank,
  BarChart3,
  Target,
  Calendar,
  Wallet,
  Tags,
  Settings,
};

function NavItems({ items }: { items: typeof MAIN_NAV }) {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {items.map((item) => {
        const Icon = iconMap[item.icon];
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              render={<Link href={item.href} />}
              isActive={isActive}
              tooltip={item.title}
            >
              {Icon && <Icon />}
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<Link href="/dashboard" />}
              className="data-[state=open]:bg-sidebar-accent"
            >
              <VaultLogo className="h-8 w-8 shrink-0" />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Vault</span>
                <span className="truncate text-xs text-muted-foreground">
                  Expense Tracker
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <NavItems items={MAIN_NAV} />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Manage</SidebarGroupLabel>
          <SidebarGroupContent>
            <NavItems items={SECONDARY_NAV} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 px-2 py-1.5">
              <UserButton
                appearance={{
                  elements: { avatarBox: "h-8 w-8" },
                }}
              />
              <span className="truncate text-sm text-muted-foreground group-data-[collapsible=icon]:hidden">
                Account
              </span>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border/50 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex-1" />
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-6">{children}</div>
      </main>
    </SidebarProvider>
  );
}
