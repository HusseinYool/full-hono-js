import type { ContentfulStatusCode } from "hono/utils/http-status";

export class AppError extends Error {
  readonly status: ContentfulStatusCode;
  readonly code: string;
  readonly field?: string;

  constructor(
    message: string,
    status: ContentfulStatusCode = 500,
    code = "INTERNAL_ERROR",
    field?: string,
  ) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = code;
    this.field = field;
  }
}

export class NotFoundError extends AppError {
  constructor(message = "resource not found") {
    super(message, 404, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class BadRequestError extends AppError {
  constructor(message = "bad request", field?: string) {
    super(message, 400, "BAD_REQUEST", field);
    this.name = "BadRequestError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "authentication required") {
    super(message, 401, "UNAUTHORIZED");
    this.name = "UnauthorizedError";
  }
}

const uniqueFieldMessages: Record<string, { message: string; field: string }> = {
  "user.email": {
    message: "Email already exists",
    field: "email",
  },
  "organization.slug": {
    message: "Organization slug already exists",
    field: "slug",
  },
  "tags.name": {
    message: "Tag name already exists",
    field: "name",
  },
  "post_tags.post_id, post_tags.tag_id": {
    message: "Tag is already linked to this post",
    field: "tag_id",
  },
};

export const mapDbError = (err: unknown): AppError | null => {
  if (!(err instanceof Error)) {
    return null;
  }

  const uniqueMatch = err.message.match(/UNIQUE constraint failed:\s*(.+)$/i);
  if (uniqueMatch) {
    const columns = uniqueMatch[1].trim();
    const mapped = uniqueFieldMessages[columns];

    if (mapped) {
      return new BadRequestError(mapped.message, mapped.field);
    }

    const field = columns.split(".").pop() ?? "value";
    return new BadRequestError(`${field} already exists`, field);
  }

  if (/FOREIGN KEY constraint failed/i.test(err.message)) {
    return new BadRequestError("invalid reference to related resource");
  }

  return null;
};
