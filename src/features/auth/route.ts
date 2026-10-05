import { Hono } from "hono";
import type { AuthEnv } from "../../middleware/authenticated";
import { jsonOk } from "../../lib/response";
import * as authService from "./services";

export const authRoutes = new Hono<AuthEnv>();

authRoutes.get("/me", async (c) => {
  const session = c.get("session");
  return jsonOk(c, "session fetched successfully", session);
});

authRoutes.get("/users", async (c) => {
  const data = await authService.listUsers();
  return jsonOk(c, "users fetched successfully", data);
});
