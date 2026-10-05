import type { postSchema, postTagSchema } from "./db/schema";

export type Post = typeof postSchema.$inferSelect;
export type NewPost = typeof postSchema.$inferInsert;

export type CreatePostInput = Pick<NewPost, "title" | "content" | "user_id">;

export type PostTagLink = typeof postTagSchema.$inferSelect;

export type LinkPostTagInput =
  | { tag_id: number; name?: never }
  | { name: string; tag_id?: never };
