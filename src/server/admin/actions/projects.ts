"use server";

import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";

import { contentTags } from "@/lib/content-tags";
import { MISSING_PROJECT_SLUG, SLUG_PATTERN } from "@/lib/project-slugs";
import type { ActionState } from "@/server/admin/action-state";
import {
  checkbox,
  createTranslations,
  fail,
  isForeignKeyViolation,
  isUniqueViolation,
  lines,
  longText,
  notes,
  optional,
  parseForm,
  parseId,
  recordId,
  required,
  sortOrder,
  succeed,
  translated,
  upsertTranslations,
} from "@/server/admin/forms";
import { requireAdmin } from "@/server/auth";
import { db } from "@/server/db";
import { MAX_SCREENSHOT_BYTES, SCREENSHOT_TYPES, ScreenshotError, storeScreenshot, type StoredScreenshot } from "@/server/screenshots";
import { removeUpload, UPLOADS_URL } from "@/server/uploads";
import type { ImageRendition } from "@/types/portfolio";

const slug = (max: number) =>
  required(max)
    .transform((value) => value.toLowerCase())
    .refine((value) => SLUG_PATTERN.test(value), "فقط حروف کوچک انگلیسی، عدد و خط تیره (مثل atlas-crm).");

/* ── Categories ─────────────────────────────────────────────────────────── */

const categorySchema = z.object({
  id: recordId.optional(),
  slug: slug(64),
  sortOrder,
  ...translated({ label: required() }).shape,
});

export async function saveCategory(_state: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const { data, failure } = parseForm(categorySchema, formData);
  if (failure) return failure;
  const { id, en, fa, ...fields } = data;

  try {
    if (id) {
      await db.projectCategory.update({
        where: { id },
        data: { ...fields, translations: upsertTranslations("projectCategoryId", id, { en, fa }) },
      });
    } else {
      await db.projectCategory.create({ data: { ...fields, translations: createTranslations({ en, fa }) } });
    }
  } catch (error) {
    if (isUniqueViolation(error)) return fail("این شناسه قبلاً استفاده شده است.", { slug: "این شناسه تکراری است." });
    throw error;
  }
  return succeed(id ? "دسته‌بندی ویرایش شد." : "دسته‌بندی جدید اضافه شد.", contentTags.projects);
}

export async function deleteCategory(id: string): Promise<ActionState> {
  await requireAdmin();
  const categoryId = parseId(id);
  if (categoryId === null) return fail("شناسه نامعتبر است.");
  try {
    const { count } = await db.projectCategory.deleteMany({ where: { id: categoryId } });
    if (!count) return fail("این مورد پیدا نشد.");
  } catch (error) {
    if (isForeignKeyViolation(error)) return fail("این دسته‌بندی پروژه دارد؛ ابتدا پروژه‌های آن را به دسته دیگری منتقل کنید.");
    throw error;
  }
  return succeed("دسته‌بندی حذف شد.", contentTags.projects);
}

/* ── Projects ───────────────────────────────────────────────────────────── */

const projectSchema = z.object({
  id: recordId.optional(),
  projectCategoryId: recordId.or(z.literal("").transform(() => null)).pipe(z.bigint({ error: "یک دسته‌بندی انتخاب کنید." })),
  slug: slug(128).refine((value) => value !== MISSING_PROJECT_SLUG, "این شناسه رزرو شده است."),
  period: required(64),
  technologies: lines(),
  liveUrl: optional(1024).refine((value) => !value || /^https?:\/\/\S+$/.test(value), "آدرس باید با http:// یا https:// شروع شود."),
  isFeatured: checkbox,
  caseStudyAvailable: checkbox,
  sortOrder,
  /** Drop the cover so the site shows the default image. */
  removeCover: checkbox,
  ...translated({
    title: required(),
    shortDescription: longText(),
    fullDescription: lines(1),
    role: required(),
    highlights: lines(),
    responsibilities: lines(),
    caseStudyContext: z.string().trim().max(20_000).default(""),
    caseStudyChallenges: notes,
    caseStudyDecisions: notes,
    caseStudyImplementation: lines(),
  }).shape,
});

type ProjectText = z.output<typeof projectSchema>["en"];

/** The uploaded image in `field`, `null` when none was chosen, or an error for the form. */
function readImage(formData: FormData, field: string): { file: File | null; failure?: ActionState } {
  const file = formData.get(field);
  if (!(file instanceof File) || file.size === 0) return { file: null };
  if (!SCREENSHOT_TYPES.has(file.type)) return { file: null, failure: fail("فرمت تصویر پشتیبانی نمی‌شود.", { [field]: "فقط PNG، JPG، WebP، AVIF یا GIF." }) };
  if (file.size > MAX_SCREENSHOT_BYTES) return { file: null, failure: fail("حجم تصویر زیاد است.", { [field]: "حداکثر حجم ۴۰ مگابایت است." }) };
  return { file };
}

/** Optimizes and stores an uploaded screenshot, or returns a form error for `field`. */
async function storeProjectImage(file: File, projectId: bigint, field: string): Promise<{ stored: StoredScreenshot | null; failure?: ActionState }> {
  try {
    return { stored: await storeScreenshot(file, `projects/${projectId}`) };
  } catch (error) {
    if (!(error instanceof ScreenshotError)) console.error("Project image processing failed", error);
    return { stored: null, failure: fail("تصویر قابل خواندن نیست.", { [field]: "فایل تصویر معتبر نیست یا پردازش آن ممکن نشد." }) };
  }
}

const renditionJson = ({ src, width, height, bytes }: ImageRendition): Prisma.InputJsonObject => ({
  src,
  width,
  height,
  ...(bytes ? { bytes } : {}),
});

/** Database fields for a stored screenshot. */
const imageFields = (stored: StoredScreenshot) => ({
  path: stored.url,
  width: stored.width,
  height: stored.height,
  variants: { full: stored.variants.full.map(renditionJson), poster: stored.variants.poster.map(renditionJson) },
});

/**
 * Deletes an image's files: its own folder of optimized copies, or the single
 * file for images stored before optimization existed.
 */
async function removeImageFiles(image: { path: string; variants: unknown }): Promise<void> {
  await removeUpload(image.variants ? image.path.slice(0, image.path.lastIndexOf("/")) : image.path);
}

/**
 * Makes `file` the project's cover, or removes the cover when `file` is null.
 * The previous cover is deleted (row and file); gallery images are untouched.
 */
async function replaceCover(projectId: bigint, file: File | null): Promise<ActionState | null> {
  let stored: StoredScreenshot | null = null;
  if (file) {
    const result = await storeProjectImage(file, projectId, "cover");
    if (result.failure) return result.failure;
    stored = result.stored;
  }

  const previous = await db.projectImage.findMany({ where: { projectId, isCover: true } });
  await db.$transaction([
    db.projectImage.deleteMany({ where: { id: { in: previous.map((image) => image.id) } } }),
    ...(stored
      ? [db.projectImage.create({ data: { projectId, ...imageFields(stored), isCover: true } })]
      : []),
  ]);
  await Promise.all(previous.map(removeImageFiles));
  return null;
}

const translationRow = (text: ProjectText) => ({ ...text, caseStudyContext: text.caseStudyContext || null });

export async function saveProject(_state: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const { data, failure } = parseForm(projectSchema, formData);
  if (failure) return failure;
  const { id, en, fa, removeCover, ...fields } = data;
  const translations = { en: translationRow(en), fa: translationRow(fa) };
  const cover = readImage(formData, "cover");
  if (cover.failure) return cover.failure;

  let projectId: bigint;
  try {
    if (id) {
      await db.project.update({ where: { id }, data: { ...fields, translations: upsertTranslations("projectId", id, translations) } });
      projectId = id;
    } else {
      projectId = (await db.project.create({ data: { ...fields, translations: createTranslations(translations) } })).id;
    }
  } catch (error) {
    if (isUniqueViolation(error)) return fail("این شناسه قبلاً استفاده شده است.", { slug: "این شناسه تکراری است." });
    if (isForeignKeyViolation(error)) return fail("دسته‌بندی انتخاب‌شده وجود ندارد.", { projectCategoryId: "دسته‌بندی نامعتبر است." });
    throw error;
  }

  if (cover.file || removeCover) {
    const failure = await replaceCover(projectId, cover.file);
    if (failure) return { ...failure, message: "اطلاعات پروژه ذخیره شد، ولی تصویر ذخیره نشد." };
  }
  return succeed(id ? "پروژه ویرایش شد." : "پروژه جدید اضافه شد.", contentTags.projects);
}

export async function deleteProject(id: string): Promise<ActionState> {
  await requireAdmin();
  const projectId = parseId(id);
  if (projectId === null) return fail("شناسه نامعتبر است.");
  const { count } = await db.project.deleteMany({ where: { id: projectId } });
  if (!count) return fail("این مورد پیدا نشد.");
  await removeUpload(`${UPLOADS_URL}/projects/${projectId}`);
  return succeed("پروژه حذف شد.", contentTags.projects);
}

/* ── Project images ─────────────────────────────────────────────────────── */

const imageSchema = z.object({
  projectId: recordId,
  alt: optional(),
  isCover: checkbox,
});

export async function uploadProjectImage(_state: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const { data, failure } = parseForm(imageSchema, formData);
  if (failure) return failure;

  const { file, failure: fileFailure } = readImage(formData, "file");
  if (fileFailure) return fileFailure;
  if (!file) return fail("یک تصویر انتخاب کنید.", { file: "یک تصویر انتخاب کنید." });

  const project = await db.project.findUnique({ where: { id: data.projectId }, select: { id: true, _count: { select: { images: true } } } });
  if (!project) return fail("پروژه پیدا نشد.");

  const { stored, failure: storeFailure } = await storeProjectImage(file, project.id, "file");
  if (!stored) return storeFailure ?? fail("تصویر قابل خواندن نیست.");

  // The first image becomes the cover unless one is chosen explicitly later.
  const isCover = data.isCover || project._count.images === 0;
  await db.$transaction([
    ...(isCover ? [db.projectImage.updateMany({ where: { projectId: project.id }, data: { isCover: false } })] : []),
    db.projectImage.create({
      data: {
        projectId: project.id,
        ...imageFields(stored),
        alt: data.alt,
        isCover,
        sortOrder: project._count.images + 1,
      },
    }),
  ]);
  return succeed("تصویر بارگذاری شد.", contentTags.projects);
}

export async function setProjectCover(id: string): Promise<ActionState> {
  await requireAdmin();
  const imageId = parseId(id);
  const image = imageId === null ? null : await db.projectImage.findUnique({ where: { id: imageId } });
  if (!image) return fail("تصویر پیدا نشد.");

  await db.$transaction([
    db.projectImage.updateMany({ where: { projectId: image.projectId }, data: { isCover: false } }),
    db.projectImage.update({ where: { id: image.id }, data: { isCover: true } }),
  ]);
  return succeed("تصویر کاور تنظیم شد.", contentTags.projects);
}

export async function deleteProjectImage(id: string): Promise<ActionState> {
  await requireAdmin();
  const imageId = parseId(id);
  const image = imageId === null ? null : await db.projectImage.findUnique({ where: { id: imageId } });
  if (!image) return fail("تصویر پیدا نشد.");

  await db.projectImage.delete({ where: { id: image.id } });
  await removeImageFiles(image);
  return succeed("تصویر حذف شد.", contentTags.projects);
}
