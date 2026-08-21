import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Show, SignUpButton } from "@clerk/nextjs";
import { Button, type buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";

interface AuthCtaButtonProps
  extends VariantProps<typeof buttonVariants> {
  className?: string;
  children: React.ReactNode;
  signedInLabel?: string;
}

export function AuthCtaButton({
  className,
  children,
  signedInLabel = "Go to dashboard",
  variant = "default",
  size = "lg",
}: AuthCtaButtonProps) {
  return (
    <>
      <Show when="signed-out">
        <SignUpButton mode="modal">
          <Button variant={variant} size={size} className={className}>
            {children}
          </Button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <Button
          variant={variant}
          size={size}
          className={className}
          nativeButton={false}
          render={<Link href="/dashboard" />}
        >
          {signedInLabel}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Show>
    </>
  );
}
