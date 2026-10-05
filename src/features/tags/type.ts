import type { tagSchema } from "./db/schema";

export type Tag = typeof tagSchema.$inferSelect;
export type NewTag = typeof tagSchema.$inferInsert;

export type CreateTagInput = Pick<NewTag, "name">;
