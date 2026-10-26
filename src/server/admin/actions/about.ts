"use server";

import { z } from "zod";

import { strengthIcons } from "@/data/options";
import { contentTags } from "@/lib/content-tags";
import type { ActionState } from "@/server/admin/action-state";
import { createTranslations, fail, parseId, longText, parseForm, recordId, required, sortOrder, succeed, translated, upsertTranslations } from "@/server/admin/forms";
import { requireAdmin } from "@/server/auth";
import { db } from "@/server/db";

/* ── Engineering principles ─────────────────────────────────────────────── */

const principleSchema = z.object({
  id: recordId.optional(),
  sortOrder,
  ...translated({ title: required(), body: longText() }).shape,
});

export async function savePrinciple(_state: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const { data, failure } = parseForm(principleSchema, formData);
  if (failure) return failure;
  const { id, en, fa, ...fields } = data;

  if (id) {
    await db.principle.update({ where: { id }, data: { ...fields, translations: upsertTranslations("principleId", id, { en, fa }) } });
  } else {
    await db.principle.create({ data: { ...fields, translations: createTranslations({ en, fa }) } });
  }
  return succeed(id ? "اصل ویرایش شد." : "اصل جدید اضافه شد.", contentTags.profile);
}

export async function deletePrinciple(id: string): Promise<ActionState> {
  await requireAdmin();
  const recordKey = parseId(id);
  if (recordKey === null) return fail("شناسه نامعتبر است.");
  const { count } = await db.principle.deleteMany({ where: { id: recordKey } });
  return count ? succeed("اصل حذف شد.", contentTags.profile) : fail("این مورد پیدا نشد.");
}

/* ── Key strengths ──────────────────────────────────────────────────────── */

const strengthSchema = z.object({
  id: recordId.optional(),
  icon: z.enum(strengthIcons, { error: "یک آیکون انتخاب کنید." }),
  sortOrder,
  ...translated({ label: required() }).shape,
});

export async function saveStrength(_state: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const { data, failure } = parseForm(strengthSchema, formData);
  if (failure) return failure;
  const { id, en, fa, ...fields } = data;

  if (id) {
    await db.strength.update({ where: { id }, data: { ...fields, translations: upsertTranslations("strengthId", id, { en, fa }) } });
  } else {
    await db.strength.create({ data: { ...fields, translations: createTranslations({ en, fa }) } });
  }
  return succeed(id ? "توانمندی ویرایش شد." : "توانمندی جدید اضافه شد.", contentTags.profile);
}

export async function deleteStrength(id: string): Promise<ActionState> {
  await requireAdmin();
  const recordKey = parseId(id);
  if (recordKey === null) return fail("شناسه نامعتبر است.");
  const { count } = await db.strength.deleteMany({ where: { id: recordKey } });
  return count ? succeed("توانمندی حذف شد.", contentTags.profile) : fail("این مورد پیدا نشد.");
}
