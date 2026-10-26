/**
 * Builds the MySQL connection URL from the Laravel-style `DB_*` variables in
 * `.env`. Shared by the Prisma CLI (`prisma.config.ts`) and the app client.
 */
export function databaseUrl(database = process.env.DB_DATABASE): string {
  const { DB_HOST = "127.0.0.1", DB_PORT = "3306", DB_USERNAME = "root", DB_PASSWORD = "" } = process.env;
  if (!database) throw new Error("DB_DATABASE is not set. Copy .env.example to .env and fill in the database settings.");

  const credentials = `${encodeURIComponent(DB_USERNAME)}:${encodeURIComponent(DB_PASSWORD)}`;
  return `mysql://${credentials}@${DB_HOST}:${DB_PORT}/${encodeURIComponent(database)}`;
}
