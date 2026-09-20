const config = {
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgresql://fresco:fresco@localhost:5434/fresco",
  },
  strict: true,
  verbose: true,
};

export default config;
