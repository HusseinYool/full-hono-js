import { defineConfig } from "drizzle-kit";

const featureDb = (name: string) => [
  `./src/features/${name}/db/schema.ts`,
  `./src/features/${name}/db/relations.ts`,
];

export default defineConfig({
  dialect: "sqlite",
  schema: [
    "./src/features/auth/db/schema.ts",
    ...featureDb("posts"),
    ...featureDb("comments"),
    ...featureDb("tags"),
  ],
  out: "./drizzle",
  dbCredentials: {
    url: "./sqlite.db",
  },
});
