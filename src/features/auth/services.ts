import { db } from "../../db";
import { user } from "./db/schema";
import type { UserPublic } from "./type";

export const listUsers = async (): Promise<UserPublic[]> => {
  return db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      createdAt: user.createdAt,
    })
    .from(user);
};
