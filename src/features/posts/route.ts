import { Hono } from "hono";
import type { AuthEnv } from "../../middleware/authenticated";
import { authenticated } from "../../middleware/authenticated";
import { jsonCreated, jsonMessage, jsonOk } from "../../lib/response";
import { validate } from "../../lib/validate";
import {
  createPostSchema,
  linkPostTagSchema,
  postIdParamSchema,
  postTagPairParamSchema,
} from "./schema";
import * as postService from "./services";

export const postRoutes = new Hono<AuthEnv>();

postRoutes.post(
  "/",
  authenticated,
  validate("json", createPostSchema),
  async (c) => {
    const body = c.req.valid("json");
    const user = c.get("user");
    const post = await postService.createPost({
      ...body,
      user_id: user.id,
    });
    return jsonCreated(c, "post created successfully", post);
  },
);

postRoutes.get("/", async (c) => {
  const data = await postService.listPosts();
  return jsonOk(c, "posts fetched successfully", data);
});

postRoutes.get(
  "/:id",
  validate("param", postIdParamSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const post = await postService.getPostByIdOrThrow(id);
    return jsonOk(c, "post fetched successfully", post);
  },
);

postRoutes.post(
  "/:id/tags",
  authenticated,
  validate("param", postIdParamSchema),
  validate("json", linkPostTagSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const body = c.req.valid("json");
    const link = await postService.linkTagToPost(id, body);
    return jsonCreated(c, "tag linked to post successfully", link);
  },
);

postRoutes.delete(
  "/:id/tags/:tagId",
  authenticated,
  validate("param", postTagPairParamSchema),
  async (c) => {
    const { id, tagId } = c.req.valid("param");
    await postService.unlinkTagFromPost(id, tagId);
    return jsonMessage(c, "tag unlinked from post successfully");
  },
);
