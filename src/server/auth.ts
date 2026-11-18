import "server-only";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/server/db";
import { SESSION_COOKIE, sessionTokens, verifyAnySession } from "@/server/session";

export interface Admin {
  id: string;
  name: string;
  phone: string;
}

export const LOGIN_PATH = "/administrator/login";

/** The signed-in administrator, or `null`. Reads the session cookie. */
export async function getCurrentAdmin(): Promise<Admin | null> {
  // `cookies()` reflects a cookie just set by a Server Action (the login
  // redirect); the raw header holds every same-named cookie the browser sent.
  const [jar, requestHeaders] = await Promise.all([cookies(), headers()]);
  const userId = await verifyAnySession([jar.get(SESSION_COOKIE)?.value, ...sessionTokens(requestHeaders.get("cookie"))]);
  if (userId === null) return null;

  const user = await db.user.findUnique({ where: { id: userId }, select: { id: true, name: true, phone: true } });
  return user ? { id: user.id.toString(), name: user.name, phone: user.phone } : null;
}

/** Use at the top of every admin page and Server Action. */
export async function requireAdmin(): Promise<Admin> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect(LOGIN_PATH);
  return admin;
}
