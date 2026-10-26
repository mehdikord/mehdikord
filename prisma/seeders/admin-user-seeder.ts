import { hash } from "bcryptjs";

import type { PrismaClient } from "@/generated/prisma/client";

const admin = {
  name: "Mehdi Kord",
  phone: "09117926950",
  password: "Mehdi137615",
};

/** Creates the site administrator, or resets its name and password if it exists. */
export async function adminUserSeeder(db: PrismaClient): Promise<void> {
  const password = await hash(admin.password, 12);

  await db.user.upsert({
    where: { phone: admin.phone },
    create: { name: admin.name, phone: admin.phone, password },
    update: { name: admin.name, password },
  });

  console.log(`  ✓ admin user ${admin.phone}`);
}
