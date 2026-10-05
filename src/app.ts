import { Hono } from "hono";
import { cors } from "hono/cors";
import { authRoutes } from "./features/auth/route";
import { commentRoutes } from "./features/comments/route";
import { postRoutes } from "./features/posts/route";
import { tagRoutes } from "./features/tags/route";
import { auth } from "./lib/auth";
import { registerErrorHandler } from "./lib/error-handler";
import { authenticated, type AuthEnv } from "./middleware/authenticated";

export const createApp = (): Hono => {
  const app = new Hono();
  const origin = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

  app.use(
    "/api/auth/*",
    cors({
      origin,
      credentials: true,
    }),
  );

  app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

  const authed = new Hono<AuthEnv>();
  authed.use("*", authenticated);
  authed.route("/", authRoutes);
  app.route("/auth", authed);

  app.route("/posts", postRoutes);
  app.route("/comments", commentRoutes);
  app.route("/tags", tagRoutes);

  registerErrorHandler(app);

  return app;
};
