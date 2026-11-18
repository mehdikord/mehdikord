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

/**
 * Every `admin_session` value in a raw `Cookie` header, in the order sent.
 *
 * Cookies are scoped by host, not port, so another app on the same host
 * (e.g. anything else run on `localhost`) can leave its own `admin_session`
 * cookie with `Path=/`. The browser then sends both, and Next.js's cookie
 * parser keeps only the *last* one — the foreign cookie — so a valid
 * session looked signed out on every request after login.
 */
export function sessionTokens(cookieHeader: string | null | undefined): string[] {
  if (!cookieHeader) return [];
  const tokens: string[] = [];
  for (const pair of cookieHeader.split(/;\s*/)) {
    const splitAt = pair.indexOf("=");
    if (splitAt === -1 || pair.slice(0, splitAt).trim() !== SESSION_COOKIE) continue;
    const value = pair.slice(splitAt + 1).trim();
    try {
      tokens.push(decodeURIComponent(value));
    } catch {
      tokens.push(value);
    }
  }
  return tokens;
}

/** The user id from the first candidate token that verifies, otherwise `null`. */
export async function verifyAnySession(tokens: Iterable<string | undefined>): Promise<bigint | null> {
  for (const token of new Set(tokens)) {
    const userId = await verifySession(token);
    if (userId !== null) return userId;
  }
  return null;
}

/**
 * Whether a request reached the site over HTTPS, from `x-forwarded-proto`
 * (set by Next.js itself, or passed on by a reverse proxy that terminates TLS).
 */
export function isHttpsRequest(headers: Headers): boolean {
  return headers.get("x-forwarded-proto")?.split(",")[0]?.trim().toLowerCase() === "https";
}

/**
 * `secure` must follow the actual protocol, not NODE_ENV: browsers silently
 * drop `Secure` cookies sent over plain HTTP (anywhere but localhost), which
 * logged admins out on the very next request.
 */
export const sessionCookieOptions = (expires: Date, secure: boolean) => ({
  httpOnly: true,
  secure,
  sameSite: "lax" as const,
  path: SESSION_PATH,
  expires,
});
