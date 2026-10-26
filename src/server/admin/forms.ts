import "server-only";

import { refresh, updateTag } from "next/cache";
import { headers } from "next/headers";
import { after } from "next/server";
import { z } from "zod";

import { locales, type Locale } from "@/i18n/config";
import { contentTags, type ContentTag } from "@/lib/content-tags";
import type { ActionState } from "@/server/admin/action-state";
import { db } from "@/server/db";

/* ── Field schemas (Persian messages) ───────────────────────────────────── */

export const required = (max = 255) =>
  z.string().trim().min(1, "این فیلد الزامی است.").max(max, `حداکثر ${max} کاراکتر مجاز است.`);

export const optional = (max = 255) => z.string().trim().max(max, `حداکثر ${max} کاراکتر مجاز است.`).default("");

export const longText = (min = 1) => z.string().trim().min(min, "این فیلد الزامی است.").max(20_000, "متن بیش از حد طولانی است.");

/** A textarea with one entry per line; blank lines are dropped. */
export const lines = (min = 0) =>
  z
    .string()
    .default("")
    .transform((value) => value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean))
    .pipe(z.array(z.string().max(2_000, "یکی از خطوط بیش از حد طولانی است.")).min(min, "حداقل یک مورد وارد کنید."));

export const checkbox = z
  .string()
  .optional()
  .transform((value) => value === "on" || value === "true" || value === "1");

export const sortOrder = z.coerce
  .number({ error: "عدد معتبر وارد کنید." })
  .int("عدد صحیح وارد کنید.")
  .min(0, "عدد منفی مجاز نیست.")
  .max(100_000, "عدد بیش از حد بزرگ است.")
  .default(0);

/** `{ title, detail }[]` posted as JSON from the notes repeater. */
export const notes = z
  .string()
  .default("[]")
  .transform((value, context) => {
    try {
      return JSON.parse(value) as unknown;
    } catch {
      context.addIssue({ code: "custom", message: "داده نامعتبر است." });
      return z.NEVER;
    }
  })
  .pipe(
    z
      .array(z.object({ title: z.string().trim(), detail: z.string().trim() }))
      .transform((items) => items.filter((item) => item.title || item.detail)),
  )
  .pipe(
    z.array(
      z.object({ title: required(255), detail: required(2_000) }, { error: "عنوان و توضیح هر مورد الزامی است." }),
    ),
  );

export const recordId = z
  .string()
  .regex(/^\d+$/, "شناسه نامعتبر است.")
  .transform((value) => BigInt(value));

/** A record id passed directly to a delete action, or `null` when malformed. */
export function parseId(value: string): bigint | null {
  return /^\d+$/.test(value) ? BigInt(value) : null;
}

/** One translation schema per locale, read from fields named `<locale>.<field>`. */
export function translated<T extends z.ZodRawShape>(shape: T) {
  return z.object(Object.fromEntries(locales.map((locale) => [locale, z.object(shape)])) as Record<Locale, z.ZodObject<T>>);
}

/* ── Parsing ────────────────────────────────────────────────────────────── */

/** FormData → nested object: `"fa.title"` becomes `{ fa: { title } }`. Files are skipped. */
export function formObject(formData: FormData): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [name, value] of formData) {
    if (typeof value !== "string" || name.startsWith("$ACTION")) continue;
    const path = name.split(".");
    let target = result;
    for (const key of path.slice(0, -1)) {
      target[key] ??= {};
      target = target[key] as Record<string, unknown>;
    }
    target[path.at(-1)!] = value;
  }
  return result;
}

export type Parsed<T> = { data: T; failure?: never } | { data?: never; failure: ActionState };

export function parseForm<S extends z.ZodType>(schema: S, formData: FormData): Parsed<z.output<S>> {
  const result = schema.safeParse(formObject(formData));
  if (result.success) return { data: result.data };

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = issue.path.join(".");
    errors[key] ??= issue.message;
  }
  return { failure: { ok: false, message: "لطفاً خطاهای فرم را برطرف کنید.", errors, at: Date.now() } };
}

/* ── Results ────────────────────────────────────────────────────────────── */

/**
 * Prerendered project pages (a dynamic segment without a fallback shell)
 * answer the first request after a tag update with the stale page and
 * regenerate in the background. Requesting them right after the action
 * responds absorbs that stale hit, so visitors and the admin see fresh pages.
 */
async function warmProjectPages(): Promise<void> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host");
  if (!host) return;
  const origin = `${requestHeaders.get("x-forwarded-proto") ?? "http"}://${host}`;
  const projects = await db.project.findMany({ select: { slug: true } });

  after(async () => {
    const urls = locales.flatMap((locale) => projects.map(({ slug }) => `${origin}/${locale}/projects/${slug}`));
    await Promise.allSettled(urls.map((url) => fetch(url, { cache: "no-store" }).then((response) => response.arrayBuffer())));
  });
}

/** Expires the public pages built from `tags` and refreshes the panel. */
export async function succeed(message: string, ...tags: ContentTag[]): Promise<ActionState> {
  for (const tag of tags) updateTag(tag);
  if (tags.some((tag) => tag === contentTags.projects || tag === contentTags.profile)) await warmProjectPages();
  refresh();
  return { ok: true, message, at: Date.now() };
}

export function fail(message: string, errors?: Record<string, string>): ActionState {
  return { ok: false, message, errors, at: Date.now() };
}

/** Prisma unique-constraint violation (e.g. a duplicate slug). */
export function isUniqueViolation(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}

/** Prisma foreign-key violation (e.g. deleting a category that still has projects). */
export function isForeignKeyViolation(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2003";
}

type TranslationKey<K extends string> = { [P in `${K}_locale`]: Record<K, bigint> & { locale: string } };

/** Upsert payload for a `*_translations` relation on update, e.g. `upsertTranslations("projectId", id, values)`. */
export function upsertTranslations<K extends string, T extends object>(foreignKey: K, id: bigint, values: Record<Locale, T>) {
  return {
    upsert: locales.map((locale) => ({
      where: { [`${foreignKey}_locale`]: { [foreignKey]: id, locale } } as TranslationKey<K>,
      create: { locale, ...values[locale] },
      update: values[locale],
    })),
  };
}

/** Create payload for a `*_translations` relation. */
export function createTranslations<T extends object>(values: Record<Locale, T>) {
  return { create: locales.map((locale) => ({ locale, ...values[locale] })) };
}
