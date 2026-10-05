import { createMiddleware } from "hono/factory";
import { auth, type Session } from "../lib/auth";
import { UnauthorizedError } from "../lib/errors";

export type AuthEnv = {
  Variables: {
    session: Session;
    user: Session["user"];
  };
};

/** Requires a valid Better Auth session (cookie or bearer). */
export const authenticated = createMiddleware<AuthEnv>(async (c, next) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    throw new UnauthorizedError("authentication required");
  }

  c.set("session", session);
  c.set("user", session.user);
  await next();
});
