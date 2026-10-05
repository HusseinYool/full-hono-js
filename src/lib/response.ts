import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import type { ApiMessage, ApiResponse, FieldError } from "./types";

export const jsonOk = <T>(
  c: Context,
  message: string,
  data: T,
  status: ContentfulStatusCode = 200,
) => c.json<ApiResponse<T>>({ message, data }, status);

export const jsonCreated = <T>(c: Context, message: string, data: T) =>
  jsonOk(c, message, data, 201);

export const jsonMessage = (
  c: Context,
  message: string,
  status: ContentfulStatusCode = 200,
  options?: { code?: string; field?: string; errors?: FieldError[] },
) => {
  const body: ApiMessage = { message };

  if (options?.code) {
    body.code = options.code;
  }

  if (options?.field) {
    body.field = options.field;
  }

  if (options?.errors?.length) {
    body.errors = options.errors;
  }

  return c.json(body, status);
};
