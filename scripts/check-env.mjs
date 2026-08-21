#!/usr/bin/env node
/**
 * Validates .env and tests database connectivity.
 * Run: npm run setup:check
 */
import "dotenv/config";
import { Pool } from "pg";

const required = [
  { key: "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", prefix: "pk_" },
  { key: "CLERK_SECRET_KEY", prefix: "sk_" },
  { key: "DATABASE_URL", prefix: "postgresql://" },
];

const optional = [
  "CLERK_WEBHOOK_SIGNING_SECRET",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
];

let hasErrors = false;

console.log("\n🔍 Vault — Environment Check\n");

for (const { key, prefix } of required) {
  const value = process.env[key];
  if (!value) {
    console.log(`❌ ${key} — missing`);
    hasErrors = true;
  } else if (!value.startsWith(prefix) && key !== "DATABASE_URL") {
    console.log(`⚠️  ${key} — unexpected format (expected prefix: ${prefix})`);
    hasErrors = true;
  } else {
    console.log(`✅ ${key}`);
  }
}

console.log("\nOptional:");
for (const key of optional) {
  const value = process.env[key];
  console.log(value ? `✅ ${key}` : `⏭️  ${key} — not set`);
}

if (hasErrors) {
  console.log("\n❌ Fix required variables in .env, then re-run.\n");
  process.exit(1);
}

const databaseUrl = process.env.DATABASE_URL;
if (databaseUrl) {
  const placeholders = ["xxxxxxxx", "YOUR_PASSWORD", "xxxxx", "[YOUR-PASSWORD]"];
  const hasPlaceholder = placeholders.some((token) =>
    databaseUrl.includes(token)
  );

  if (hasPlaceholder) {
    console.log("\n❌ DATABASE_URL still contains placeholder text.");
    console.log(
      "   Copy the real connection string from Supabase → Connect → Session pooler"
    );
    console.log("   Replace [YOUR-PASSWORD] with your actual database password.\n");
    hasErrors = true;
  } else if (databaseUrl.includes("db.") && databaseUrl.includes(".supabase.co")) {
    console.log("\n⚠️  DATABASE_URL uses Direct connection (db.*.supabase.co).");
    console.log(
      "   This often fails on home networks. Use Session pooler from Supabase → Connect instead.\n"
    );
    hasErrors = true;
  } else if (
    databaseUrl.match(/:\/\/[^:]+:[^@]*@[^/]+/) &&
    databaseUrl.split("://")[1]?.split("@")[0]?.includes("@")
  ) {
    console.log("\n❌ DATABASE_URL password contains '@' — it must be URL-encoded as %40");
    console.log("   Example: Nyra@23nyra → Nyra%4023nyra\n");
    hasErrors = true;
  } else {
    console.log("\n🗄️  Testing database connection...");
    const pool = new Pool({ connectionString: databaseUrl });

    try {
      const result = await pool.query("SELECT 1 AS ok");
      if (result.rows[0]?.ok === 1) {
        console.log("✅ Database connection successful\n");
      }
    } catch (error) {
      console.log("❌ Database connection failed:");
      console.log(`   ${error instanceof Error ? error.message : error}`);
      console.log("\n   Common fixes:");
      console.log("   • Use the full URI from Supabase (don’t edit the host/region manually)");
      console.log("   • Replace [YOUR-PASSWORD] with your actual database password");
      console.log("   • Try “Session” mode (port 5432) if “Transaction” (6543) fails");
      console.log("   • Reset password: Supabase → Project Settings → Database → Reset database password\n");
      hasErrors = true;
    } finally {
      await pool.end();
    }
  }
}

if (hasErrors) {
  process.exit(1);
}

console.log("Next steps:");
console.log("  1. npm run db:push     # create tables in Supabase");
console.log("  2. npm run dev         # start the app");
console.log("  3. Sign up at http://localhost:3000\n");
