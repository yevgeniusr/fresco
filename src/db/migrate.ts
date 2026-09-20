import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required to migrate Fresco");

const client = postgres(databaseUrl, { max: 1 });
const database = drizzle(client);

migrate(database, { migrationsFolder: "drizzle" })
  .then(async () => {
    console.info("Fresco migrations are current.");
    await client.end();
  })
  .catch(async (error: unknown) => {
    console.error("Fresco migration failed", error);
    await client.end();
    process.exit(1);
  });
