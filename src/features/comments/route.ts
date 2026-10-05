import { Hono } from "hono";
import type { AuthEnv } from "../../middleware/authenticated";
import { authenticated } from "../../middleware/authenticated";
import { jsonCreated, jsonOk } from "../../lib/response";
import { validate } from "../../lib/validate";
import { createCommentSchema, listCommentsQuerySchema } from "./schema";
import * as commentService from "./services";

export const commentRoutes = new Hono<AuthEnv>();

commentRoutes.post(
  "/",
  authenticated,
  validate("json", createCommentSchema),
  async (c) => {
    const body = c.req.valid("json");
    const user = c.get("user");
    const comment = await commentService.createComment({
      ...body,
      user_id: user.id,
    });
    return jsonCreated(c, "comment created successfully", comment);
  },
);

commentRoutes.get(
  "/",
  validate("query", listCommentsQuerySchema),
  async (c) => {
    const { post_id: postId } = c.req.valid("query");
    const data = await commentService.listComments(postId);
    return jsonOk(c, "comments fetched successfully", data);
  },
);
