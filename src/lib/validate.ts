import { zValidator } from "@hono/zod-validator";
import type { ValidationTargets } from "hono";
import type { ZodType } from "zod";
import { jsonMessage } from "./response";
import type { FieldError } from "./types";

export const validate = <
  T extends ZodType,
  Target extends keyof ValidationTargets,
>(
  target: Target,
  schema: T,
) =>
  zValidator(target, schema, (result, c) => {
    if (result.success) {
      return;
    }

    const errors: FieldError[] = result.error.issues.map((issue) => ({
      field:
        issue.path.length > 0
          ? String(issue.path[issue.path.length - 1])
          : "body",
      message: issue.message,
    }));

    return jsonMessage(c, "validation failed", 400, {
      code: "BAD_REQUEST",
      errors,
    });
  });
