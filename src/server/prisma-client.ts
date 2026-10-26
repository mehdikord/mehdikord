import { PrismaMariaDb } from "@prisma/adapter-mariadb";

import { PrismaClient } from "@/generated/prisma/client";

/** A Prisma client for the MySQL database configured by the `DB_*` variables. */
export function createPrismaClient(): PrismaClient {
  const adapter = new PrismaMariaDb({
    host: process.env.DB_HOST ?? "127.0.0.1",
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USERNAME ?? "root",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_DATABASE,
    connectionLimit: 5,
    // MySQL 8's default `caching_sha2_password` needs the server key on a non-TLS connection.
    allowPublicKeyRetrieval: true,
  });
  return new PrismaClient({ adapter });
}
