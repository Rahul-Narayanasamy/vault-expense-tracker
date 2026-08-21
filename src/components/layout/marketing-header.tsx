import Link from "next/link";
import { Show, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { VaultLogo } from "@/components/shared/vault-logo";

export function MarketingHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <VaultLogo className="h-8 w-8" />
          <span className="text-lg font-semibold tracking-tight">Vault</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="#features"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </Link>
          <Link
            href="#analytics"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Analytics
          </Link>
          <Link
            href="#pricing"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button size="sm">Get started</Button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <Button
              nativeButton={false}
              render={<Link href="/dashboard" />}
              size="sm"
            >
              Dashboard
            </Button>
          </Show>
        </div>
      </div>
    </header>
  );
}
