import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required")
    .refine(
      (value) =>
        value.startsWith("postgresql://") || value.startsWith("postgres://"),
      "DATABASE_URL must be a PostgreSQL connection string"
    ),
  CLERK_SECRET_KEY: z
    .string()
    .min(1, "CLERK_SECRET_KEY is required")
    .startsWith("sk_", "CLERK_SECRET_KEY must start with sk_"),
  CLERK_WEBHOOK_SIGNING_SECRET: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
});

const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is required")
    .startsWith("pk_", "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY must start with pk_"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional().or(z.literal("")),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET: z.string().default("receipts"),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;

export function getServerEnv(): ServerEnv {
  return serverEnvSchema.parse({
    DATABASE_URL: process.env.DATABASE_URL,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLERK_WEBHOOK_SIGNING_SECRET: process.env.CLERK_WEBHOOK_SIGNING_SECRET,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  });
}

export function getClientEnv(): ClientEnv {
  return clientEnvSchema.parse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET:
      process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET,
  });
}

export function validateEnv(): {
  server: ServerEnv;
  client: ClientEnv;
  warnings: string[];
} {
  const server = getServerEnv();
  const client = getClientEnv();
  const warnings: string[] = [];

  if (!server.CLERK_WEBHOOK_SIGNING_SECRET) {
    warnings.push(
      "CLERK_WEBHOOK_SIGNING_SECRET is missing — user sync via webhook won't work until configured"
    );
  }

  if (!client.NEXT_PUBLIC_SUPABASE_URL || !client.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    warnings.push(
      "Supabase keys are missing — receipt uploads will be disabled until configured"
    );
  }

  if (!server.SUPABASE_SERVICE_ROLE_KEY) {
    warnings.push(
      "SUPABASE_SERVICE_ROLE_KEY is missing — server-side file uploads won't work"
    );
  }

  return { server, client, warnings };
}
