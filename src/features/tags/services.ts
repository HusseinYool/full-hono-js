import { db } from "../../db";
import { tagSchema } from "./db/schema";
import type { CreateTagInput, Tag } from "./type";

export const createTag = async (input: CreateTagInput): Promise<Tag> => {
  const [tag] = await db.insert(tagSchema).values(input).returning();
  return tag;
};

export const listTags = async () => {
  return db.query.tagSchema.findMany({
    with: {
      postTags: {
        with: {
          post: { columns: { id: true, title: true } },
        },
      },
    },
  });
};
