"use server";

import { z } from "zod";

import { contentTags } from "@/lib/content-tags";
import type { ActionState } from "@/server/admin/action-state";
import { createTranslations, fail, parseId, lines, longText, optional, parseForm, recordId, required, sortOrder, succeed, translated, upsertTranslations } from "@/server/admin/forms";
import { requireAdmin } from "@/server/auth";
import { db } from "@/server/db";
import { LOGO_TYPES, MAX_IMAGE_BYTES, removeUpload, storeImage, UPLOADS_URL } from "@/server/uploads";

/* ── Experience ─────────────────────────────────────────────────────────── */

const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "ماه را به شکل YYYY-MM انتخاب کنید.");

const experienceSchema = z
  .object({
    id: recordId.optional(),
    startMonth: month,
    endMonth: z.union([z.literal("").transform(() => null), month]).default(""),
    technologies: lines(),
    sortOrder,
    ...translated({
      company: required(),
      companyContext: optional(),
      position: required(),
      location: optional(),
      description: longText(),
      responsibilities: lines(),
    }).shape,
  })
  .refine((value) => !value.endMonth || value.endMonth >= value.startMonth, {
    path: ["endMonth"],
    message: "تاریخ پایان نباید قبل از تاریخ شروع باشد.",
  });

/** The uploaded logo in the form, `null` when none was chosen, or an error for the form. */
function readLogo(formData: FormData): { file: File | null; failure?: ActionState } {
  const file = formData.get("logo");
  if (!(file instanceof File) || file.size === 0) return { file: null };
  if (!LOGO_TYPES[file.type]) return { file: null, failure: fail("فرمت لوگو پشتیبانی نمی‌شود.", { logo: "فقط SVG، PNG، WebP، JPG، AVIF یا GIF." }) };
  if (file.size > MAX_IMAGE_BYTES) return { file: null, failure: fail("حجم لوگو زیاد است.", { logo: "حداکثر حجم ۸ مگابایت است." }) };
  return { file };
}

export async function saveExperience(_state: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const { data, failure } = parseForm(experienceSchema, formData);
  if (failure) return failure;
  const logo = readLogo(formData);
  if (logo.failure) return logo.failure;
  const removeLogo = formData.get("removeLogo") === "on";
  const { id, en, fa, ...fields } = data;

  let experienceId = id;
  let previousLogo = "";
  if (experienceId) {
    const current = await db.experience.findUnique({ where: { id: experienceId }, select: { logoUrl: true } });
    if (!current) return fail("این مورد پیدا نشد.");
    previousLogo = current.logoUrl;
    await db.experience.update({
      where: { id: experienceId },
      data: { ...fields, translations: upsertTranslations("experienceId", experienceId, { en, fa }) },
    });
  } else {
    const created = await db.experience.create({ data: { ...fields, translations: createTranslations({ en, fa }) }, select: { id: true } });
    experienceId = created.id;
  }

  // Replace or remove the logo after the row exists, so the file lives under its id.
  if (logo.file || (removeLogo && previousLogo)) {
    let logoUrl = "";
    if (logo.file) {
      try {
        logoUrl = (await storeImage(logo.file, `experience/${experienceId}`, LOGO_TYPES)).url;
      } catch {
        return fail("لوگو قابل خواندن نیست.", { logo: "فایل تصویر معتبر نیست." });
      }
    }
    await db.experience.update({ where: { id: experienceId }, data: { logoUrl } });
    if (previousLogo) await removeUpload(previousLogo);
  }

  return succeed(id ? "سابقه کاری ویرایش شد." : "سابقه کاری جدید اضافه شد.", contentTags.career);
}

export async function deleteExperience(id: string): Promise<ActionState> {
  await requireAdmin();
  const recordKey = parseId(id);
  if (recordKey === null) return fail("شناسه نامعتبر است.");
  const { count } = await db.experience.deleteMany({ where: { id: recordKey } });
  if (!count) return fail("این مورد پیدا نشد.");
  await removeUpload(`${UPLOADS_URL}/experience/${recordKey}`);
  return succeed("سابقه کاری حذف شد.", contentTags.career);
}

/* ── Skill groups ───────────────────────────────────────────────────────── */

const skillGroupSchema = z.object({
  id: recordId.optional(),
  sortOrder,
  ...translated({ title: required(), annotation: optional(), items: lines(1) }).shape,
});

export async function saveSkillGroup(_state: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const { data, failure } = parseForm(skillGroupSchema, formData);
  if (failure) return failure;
  const { id, en, fa, ...fields } = data;

  if (id) {
    await db.skillGroup.update({ where: { id }, data: { ...fields, translations: upsertTranslations("skillGroupId", id, { en, fa }) } });
  } else {
    await db.skillGroup.create({ data: { ...fields, translations: createTranslations({ en, fa }) } });
  }
  return succeed(id ? "گروه مهارت ویرایش شد." : "گروه مهارت جدید اضافه شد.", contentTags.career);
}

export async function deleteSkillGroup(id: string): Promise<ActionState> {
  await requireAdmin();
  const recordKey = parseId(id);
  if (recordKey === null) return fail("شناسه نامعتبر است.");
  const { count } = await db.skillGroup.deleteMany({ where: { id: recordKey } });
  return count ? succeed("گروه مهارت حذف شد.", contentTags.career) : fail("این مورد پیدا نشد.");
}
