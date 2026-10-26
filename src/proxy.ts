import { NextResponse, type NextRequest } from "next/server";

import { defaultLocale, isLocale, LOCALE_COOKIE, type Locale } from "@/i18n/config";
import { MISSING_PROJECT_SLUG } from "@/lib/project-slugs";
import { createPrismaClient } from "@/server/prisma-client";
import { SESSION_COOKIE, verifySession } from "@/server/session";

const ADMIN_PREFIX = "/administrator";
const ADMIN_LOGIN = `${ADMIN_PREFIX}/login`;

let prisma: ReturnType<typeof createPrismaClient> | undefined;

async function projectExists(slug: string): Promise<boolean> {
  prisma ??= createPrismaClient();
  return (await prisma.project.count({ where: { slug } })) > 0;
}

/** An explicit choice from the switcher wins, then the browser's languages. */
function preferredLocale(request: NextRequest): Locale {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(saved)) return saved;

  const ranked = (request.headers.get("accept-language") ?? "")
    .split(",")
    .map((part) => {
      const [tag = "", quality] = part.trim().split(";q=");
      return { language: tag.toLowerCase().split("-")[0], weight: quality ? Number(quality) : 1 };
    })
    .sort((a, b) => b.weight - a.weight);

  return ranked.find(({ language }) => isLocale(language))?.language as Locale | undefined ?? defaultLocale;
}

/**
 * Optimistic admin gate: signed-out visitors go to the login page and
 * signed-in admins skip it. Pages and Server Actions still verify the
 * session against the database (see `src/server/auth.ts`).
 */
async function adminProxy(request: NextRequest, pathname: string) {
  const signedIn = (await verifySession(request.cookies.get(SESSION_COOKIE)?.value)) !== null;
  const onLogin = pathname === ADMIN_LOGIN;

  if (!signedIn && !onLogin) return NextResponse.redirect(new URL(ADMIN_LOGIN, request.url));
  if (signedIn && onLogin) return NextResponse.redirect(new URL(ADMIN_PREFIX, request.url));
  return NextResponse.next();
}

/**
 * Sends paths without a locale prefix (e.g. "/" or "/projects") to the
 * visitor's language, serves unknown project slugs the prerendered project
 * 404 so they get a real 404 status, and guards the admin panel.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === ADMIN_PREFIX || pathname.startsWith(`${ADMIN_PREFIX}/`)) return adminProxy(request, pathname);

  const [, first, section, slug, ...rest] = pathname.split("/");

  if (isLocale(first)) {
    if (section === "projects" && slug && rest.length === 0 && slug !== MISSING_PROJECT_SLUG && !(await projectExists(slug))) {
      const url = request.nextUrl.clone();
      url.pathname = `/${first}/projects/${MISSING_PROJECT_SLUG}`;
      return NextResponse.rewrite(url, { status: 404 });
    }
    return;
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${preferredLocale(request)}${pathname === "/" ? "" : pathname}`;
  const response = NextResponse.redirect(url);
  response.headers.set("Vary", "Accept-Language, Cookie");
  return response;
}

export const config = {
  // Skip Next internals, metadata routes, uploaded media and any file with an extension.
  matcher: ["/((?!_next|opengraph-image|uploads/|.*\\..*).*)"],
};
