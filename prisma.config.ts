import "dotenv/config";

import { defineConfig } from "prisma/config";

import { databaseUrl } from "./src/server/database-url";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: databaseUrl(),
    // `migrate dev` diffs against a throwaway database next to the real one.
    shadowDatabaseUrl: databaseUrl(`${process.env.DB_DATABASE}_shadow`),
  },
});
