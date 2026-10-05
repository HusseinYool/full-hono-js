import { relations } from "drizzle-orm";
import { user } from "../../auth/db/schema";
import { commentSchema } from "../../comments/db/schema";
import { tagSchema } from "../../tags/db/schema";
import { postSchema, postTagSchema } from "./schema";

export const postRelations = relations(postSchema, ({ one, many }) => ({
  user: one(user, {
    fields: [postSchema.user_id],
    references: [user.id],
  }),
  comments: many(commentSchema),
  postTags: many(postTagSchema),
}));

export const postTagRelations = relations(postTagSchema, ({ one }) => ({
  post: one(postSchema, {
    fields: [postTagSchema.post_id],
    references: [postSchema.id],
  }),
  tag: one(tagSchema, {
    fields: [postTagSchema.tag_id],
    references: [tagSchema.id],
  }),
}));
