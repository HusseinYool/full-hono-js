import { sql } from "drizzle-orm";
import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "../../auth/db/schema";
import { tagSchema } from "../../tags/db/schema";

export const postSchema = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title"),
  content: text("content"),
  user_id: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: text("updated_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

export const postTagSchema = sqliteTable(
  "post_tags",
  {
    post_id: integer("post_id")
      .notNull()
      .references(() => postSchema.id, { onDelete: "cascade" }),
    tag_id: integer("tag_id")
      .notNull()
      .references(() => tagSchema.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.post_id, table.tag_id] })],
);
