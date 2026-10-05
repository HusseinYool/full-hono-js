import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().trim().optional(),
  content: z.string().trim().optional(),
});

export const postIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const postTagPairParamSchema = z.object({
  id: z.coerce.number().int().positive(),
  tagId: z.coerce.number().int().positive(),
});

export const linkPostTagSchema = z
  .object({
    tag_id: z.number().int().positive().optional(),
    name: z.string().trim().min(1).optional(),
  })
  .refine((body) => body.tag_id !== undefined || body.name !== undefined, {
    message: "provide tag_id or name",
  });
