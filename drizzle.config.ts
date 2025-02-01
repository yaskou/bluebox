import { defineConfig } from "drizzle-kit";

process.loadEnvFile(".env.local");

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schemas/*",
  dbCredentials: {
    url: process.env.DATABASE_URL!
  }
});
