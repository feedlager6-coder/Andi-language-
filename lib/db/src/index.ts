import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Railway (and other cloud providers) require SSL for Postgres.
// We pass ssl: { rejectUnauthorized: false } when DATABASE_URL points to an
// external host (Railway, Neon, Supabase, etc.) so self-signed or chain certs
// are accepted both in development and production.
const isExternalDb =
  process.env.DATABASE_URL &&
  !process.env.DATABASE_URL.includes("localhost") &&
  !process.env.DATABASE_URL.includes("127.0.0.1");

const sslConfig =
  (process.env.NODE_ENV === "production" || isExternalDb)
    ? { rejectUnauthorized: false }
    : undefined;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig,
});
export const db = drizzle(pool, { schema });

export * from "./schema";
