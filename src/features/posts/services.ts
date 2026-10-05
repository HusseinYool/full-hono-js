import { and, eq } from "drizzle-orm";
import { db } from "../../db";
import { NotFoundError } from "../../lib/errors";
import { tagSchema } from "../tags/db/schema";
import { postSchema, postTagSchema } from "./db/schema";
import type { CreatePostInput, LinkPostTagInput, Post, PostTagLink } from "./type";

const postWithRelations = {
  user: {
    columns: { id: true, name: true, email: true },
  },
  comments: {
    with: {
      user: { columns: { id: true, name: true } },
    },
  },
  postTags: {
    with: { tag: true },
  },
} as const;

export const createPost = async (input: CreatePostInput): Promise<Post> => {
  const [post] = await db.insert(postSchema).values(input).returning();
  return post;
};

export const listPosts = async () => {
  return db.query.postSchema.findMany({ with: postWithRelations });
};

export const getPostById = async (id: number) => {
  return db.query.postSchema.findFirst({
    where: eq(postSchema.id, id),
    with: postWithRelations,
  });
};

export const getPostByIdOrThrow = async (id: number) => {
  const post = await getPostById(id);
  if (!post) {
    throw new NotFoundError("post not found");
  }
  return post;
};

export const linkTagToPost = async (
  postId: number,
  input: LinkPostTagInput,
): Promise<PostTagLink> => {
  await getPostByIdOrThrow(postId);

  let tagId = input.tag_id;

  if (tagId === undefined && input.name) {
    const [tag] = await db.insert(tagSchema).values({ name: input.name }).returning();
    tagId = tag.id;
  }

  const [link] = await db
    .insert(postTagSchema)
    .values({ post_id: postId, tag_id: tagId! })
    .returning();

  return link;
};

export const unlinkTagFromPost = async (
  postId: number,
  tagId: number,
): Promise<void> => {
  const deleted = await db
    .delete(postTagSchema)
    .where(
      and(eq(postTagSchema.post_id, postId), eq(postTagSchema.tag_id, tagId)),
    )
    .returning();

  if (deleted.length === 0) {
    throw new NotFoundError("post tag link not found");
  }
};
