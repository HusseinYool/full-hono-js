import { relations } from "drizzle-orm";
import { postTagSchema } from "../../posts/db/schema";
import { tagSchema } from "./schema";

export const tagRelations = relations(tagSchema, ({ many }) => ({
  postTags: many(postTagSchema),
}));
