import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

const globalDatabase = globalThis as unknown as {
  frescoSql?: ReturnType<typeof postgres>;
};

function databaseUrl(): string {
  const value = process.env.DATABASE_URL;
  if (!value) {
    throw new Error("DATABASE_URL is required");
  }
  return value;
}

const sql = globalDatabase.frescoSql ?? postgres(databaseUrl(), { max: 10, prepare: false });

if (process.env.NODE_ENV !== "production") {
  globalDatabase.frescoSql = sql;
}

export const db = drizzle(sql, { schema });
