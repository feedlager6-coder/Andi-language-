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
// We pass ssl: { rejectUnauthorized: false } in production so self-signed
// certs used by Railway's internal Postgres are accepted.
const sslConfig =
  process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : undefined;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig,
});
export const db = drizzle(pool, { schema });

export * from "./schema";
