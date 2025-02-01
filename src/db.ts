import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/schemas";

const pool = postgres(process.env.DATABASE_URL!, { max: 1 });
export const db = drizzle(pool, { schema });
