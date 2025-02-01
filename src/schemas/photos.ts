import { customType, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

const bytea = customType<{ data: Buffer }>({
  dataType() {
    return "bytea";
  },
});

export const photos = pgTable("photos", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  buffer: bytea("buffer").notNull(),
  thumbnail: bytea("thumbnail").notNull(),
  created_at: timestamp({ precision: 0, withTimezone: true })
    .defaultNow()
    .notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id),
});
