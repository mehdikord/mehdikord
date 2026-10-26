import { jwtVerify, SignJWT } from "jose";

/**
 * Stateless admin session: a signed JWT in an HTTP-only cookie scoped to the
 * admin panel. Shared by the proxy (optimistic redirects) and the Data Access
 * Layer in `auth.ts` (the authoritative check).
 */
export const SESSION_COOKIE = "admin_session";
export const SESSION_PATH = "/administrator";
const SESSION_DAYS = 7;

function secret(): Uint8Array {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) throw new Error("AUTH_SECRET must be set to at least 32 characters.");
  return new TextEncoder().encode(value);
}

export async function signSession(userId: bigint): Promise<{ token: string; expires: Date }> {
  const expires = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  const token = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId.toString())
    .setIssuedAt()
    .setExpirationTime(expires)
    .sign(secret());
  return { token, expires };
}

/** The user id in a valid, unexpired token, otherwise `null`. */
export async function verifySession(token: string | undefined): Promise<bigint | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: ["HS256"] });
    return payload.sub && /^\d+$/.test(payload.sub) ? BigInt(payload.sub) : null;
  } catch {
    return null;
  }
}

export const sessionCookieOptions = (expires: Date) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: SESSION_PATH,
  expires,
});
