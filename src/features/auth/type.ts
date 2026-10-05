import type { user } from "./db/schema";

export type User = typeof user.$inferSelect;
export type UserPublic = Pick<
  User,
  "id" | "name" | "email" | "image" | "createdAt"
>;
