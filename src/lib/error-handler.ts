import type { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { AppError, mapDbError } from "./errors";
import { jsonMessage } from "./response";

export const registerErrorHandler = (app: Hono): void => {
  app.onError((err, c) => {
    if (err instanceof HTTPException) {
      return jsonMessage(c, err.message, err.status);
    }

    if (err instanceof AppError) {
      return jsonMessage(c, err.message, err.status, {
        code: err.code,
        field: err.field,
      });
    }

    const dbError = mapDbError(err);
    if (dbError) {
      return jsonMessage(c, dbError.message, dbError.status, {
        code: dbError.code,
        field: dbError.field,
      });
    }

    console.error(err);
    return jsonMessage(c, "internal server error", 500, {
      code: "INTERNAL_ERROR",
    });
  });
};
