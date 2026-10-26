"use server";

import { z } from "zod";

import { contentTags } from "@/lib/content-tags";
import type { ActionState } from "@/server/admin/action-state";
import { createTranslations, fail, parseId, lines, longText, optional, parseForm, recordId, required, sortOrder, succeed, translated, upsertTranslations } from "@/server/admin/forms";
import { requireAdmin } from "@/server/auth";
import { db } from "@/server/db";

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

export async function saveExperience(_state: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const { data, failure } = parseForm(experienceSchema, formData);
  if (failure) return failure;
  const { id, en, fa, ...fields } = data;

  if (id) {
    await db.experience.update({ where: { id }, data: { ...fields, translations: upsertTranslations("experienceId", id, { en, fa }) } });
  } else {
    await db.experience.create({ data: { ...fields, translations: createTranslations({ en, fa }) } });
  }
  return succeed(id ? "سابقه کاری ویرایش شد." : "سابقه کاری جدید اضافه شد.", contentTags.career);
}

export async function deleteExperience(id: string): Promise<ActionState> {
  await requireAdmin();
  const recordKey = parseId(id);
  if (recordKey === null) return fail("شناسه نامعتبر است.");
  const { count } = await db.experience.deleteMany({ where: { id: recordKey } });
  return count ? succeed("سابقه کاری حذف شد.", contentTags.career) : fail("این مورد پیدا نشد.");
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
