import { Hono } from "hono";
import type { AuthEnv } from "../../middleware/authenticated";
import { authenticated } from "../../middleware/authenticated";
import { jsonCreated, jsonOk } from "../../lib/response";
import { validate } from "../../lib/validate";
import { createTagSchema } from "./schema";
import * as tagService from "./services";

export const tagRoutes = new Hono<AuthEnv>();

tagRoutes.post(
  "/",
  authenticated,
  validate("json", createTagSchema),
  async (c) => {
    const body = c.req.valid("json");
    const tag = await tagService.createTag(body);
    return jsonCreated(c, "tag created successfully", tag);
  },
);

tagRoutes.get("/", async (c) => {
  const data = await tagService.listTags();
  return jsonOk(c, "tags fetched successfully", data);
});
