import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const photos = pgTable("photos", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  created_at: timestamp({ precision: 0, withTimezone: true })
    .defaultNow()
    .notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id),
});
