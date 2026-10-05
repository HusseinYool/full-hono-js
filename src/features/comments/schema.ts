import { z } from "zod";

export const createCommentSchema = z.object({
  content: z.string().trim().min(1, "Content is required"),
  post_id: z.number().int().positive(),
});

export const listCommentsQuerySchema = z.object({
  post_id: z.coerce.number().int().positive().optional(),
});
