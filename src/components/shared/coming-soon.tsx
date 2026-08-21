import { Construction } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ComingSoonPlaceholderProps {
  feature: string;
}

export function ComingSoonPlaceholder({ feature }: ComingSoonPlaceholderProps) {
  return (
    <Card className="glass-card mt-6">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <Construction className="h-12 w-12 text-muted-foreground/50" />
        <h2 className="mt-4 text-lg font-semibold">Coming soon</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          {feature} is on the roadmap. We&apos;re building Vault incrementally —
          this section is next.
        </p>
      </CardContent>
    </Card>
  );
}
