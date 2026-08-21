import { cn } from "@/lib/utils";

interface VaultLogoProps {
  className?: string;
}

export function VaultLogo({ className }: VaultLogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-primary", className)}
      aria-hidden="true"
    >
      <rect
        width="32"
        height="32"
        rx="8"
        className="fill-primary"
      />
      <path
        d="M8 12h16v2H8v-2zm0 4h12v2H8v-2zm0 4h8v2H8v-2z"
        className="fill-primary-foreground"
        opacity="0.9"
      />
      <circle cx="22" cy="20" r="4" className="fill-primary-foreground" />
    </svg>
  );
}
