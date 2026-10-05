import { eq } from "drizzle-orm";
import { db } from "../../db";
import { commentSchema } from "./db/schema";
import type { Comment, CreateCommentInput } from "./type";

export const createComment = async (
  input: CreateCommentInput,
): Promise<Comment> => {
  const [comment] = await db.insert(commentSchema).values(input).returning();
  return comment;
};

export const listComments = async (postId?: number) => {
  if (postId !== undefined) {
    return db.query.commentSchema.findMany({
      where: eq(commentSchema.post_id, postId),
      with: {
        user: { columns: { id: true, name: true } },
      },
    });
  }

  return db.query.commentSchema.findMany({
    with: {
      user: { columns: { id: true, name: true } },
      post: { columns: { id: true, title: true } },
    },
  });
};
