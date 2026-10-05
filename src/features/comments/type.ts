import type { commentSchema } from "./db/schema";

export type Comment = typeof commentSchema.$inferSelect;
export type NewComment = typeof commentSchema.$inferInsert;

export type CreateCommentInput = Pick<
  NewComment,
  "content" | "post_id" | "user_id"
>;
