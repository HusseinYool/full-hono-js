import { relations } from "drizzle-orm";
import { user } from "../../auth/db/schema";
import { postSchema } from "../../posts/db/schema";
import { commentSchema } from "./schema";

export const commentRelations = relations(commentSchema, ({ one }) => ({
  post: one(postSchema, {
    fields: [commentSchema.post_id],
    references: [postSchema.id],
  }),
  user: one(user, {
    fields: [commentSchema.user_id],
    references: [user.id],
  }),
}));
