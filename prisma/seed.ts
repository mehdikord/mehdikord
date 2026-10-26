import "dotenv/config";

import { createPrismaClient } from "@/server/prisma-client";

import { adminUserSeeder } from "./seeders/admin-user-seeder";
import { contentSeeder } from "./seeders/content-seeder";

/** Entry point for `prisma db seed` — runs every seeder in order. */
async function databaseSeeder() {
  const db = createPrismaClient();
  try {
    console.log("Seeding database…");
    await adminUserSeeder(db);
    await contentSeeder(db);
    console.log("Done.");
  } finally {
    await db.$disconnect();
  }
}

databaseSeeder().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
