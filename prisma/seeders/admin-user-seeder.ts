import { hash } from "bcryptjs";

import type { PrismaClient } from "@/generated/prisma/client";

const admin = {
  name: "Mehdi Kord",
  phone: "09117926950",
  password: "Mehdi137615",
};

/**
 * Creates the site administrator when it doesn't exist yet. An existing admin
 * is left untouched, so seeding on every deploy (`pnpm build`) never resets it.
 */
export async function adminUserSeeder(db: PrismaClient): Promise<void> {
  if (await db.user.findUnique({ where: { phone: admin.phone }, select: { id: true } })) {
    console.log(`  - admin user ${admin.phone}: already exists, skipped`);
    return;
  }

  await db.user.create({ data: { name: admin.name, phone: admin.phone, password: await hash(admin.password, 12) } });
  console.log(`  ✓ admin user ${admin.phone}`);
}
