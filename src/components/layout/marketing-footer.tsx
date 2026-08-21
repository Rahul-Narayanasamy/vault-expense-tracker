import Link from "next/link";
import { VaultLogo } from "@/components/shared/vault-logo";

export function MarketingFooter() {
  return (
    <footer className="border-t border-border/50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <VaultLogo className="h-7 w-7" />
            <span className="font-semibold">Vault</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Vault. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
