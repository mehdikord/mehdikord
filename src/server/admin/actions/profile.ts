"use server";

import { z } from "zod";

import { contentTags } from "@/lib/content-tags";
import type { ActionState } from "@/server/admin/action-state";
import { checkbox, lines, longText, optional, parseForm, required, succeed, translated, upsertTranslations, createTranslations } from "@/server/admin/forms";
import { parseHeadline } from "@/server/admin/headline";
import { requireAdmin } from "@/server/auth";
import { db } from "@/server/db";

const url = (max = 1024) =>
  optional(max).refine((value) => !value || /^https?:\/\/\S+$/.test(value), "آدرس باید با http:// یا https:// شروع شود.");

const href = required(255).refine(
  (value) => /^(#[\w-]+|\/\S*|https?:\/\/\S+|mailto:\S+|tel:\S+)$/.test(value),
  "یک لینک معتبر وارد کنید (مثل ‎#contact، ‎/fa/projects یا https://…).",
);

const profileSchema = z.object({
  initials: required(8),
  yearsOfExperience: z.coerce.number({ error: "عدد معتبر وارد کنید." }).int().min(0).max(80),
  isAvailable: checkbox,
  email: optional().refine((value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), "ایمیل معتبر نیست."),
  phone: optional(32),
  telegram: optional(),
  linkedin: url(255),
  instagram: optional(),
  heroVideoUrl: url(),
  heroPosterUrl: url(),
  primaryCtaHref: href,
  secondaryCtaHref: href,
  ...translated({
    name: required(),
    title: required(),
    location: required(),
    summary: longText(),
    bio: lines(1),
    availabilityLabel: required(),
    heroHeadline: longText().transform(parseHeadline),
    heroDescription: longText(),
    primaryCtaLabel: required(),
    secondaryCtaLabel: required(),
    signature: lines(),
  }).shape,
});

export async function saveProfile(_state: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const { data, failure } = parseForm(profileSchema, formData);
  if (failure) return failure;

  const { en, fa, ...shared } = data;
  const existing = await db.profile.findFirst({ select: { id: true }, orderBy: { id: "asc" } });

  if (existing) {
    await db.profile.update({
      where: { id: existing.id },
      data: { ...shared, translations: upsertTranslations("profileId", existing.id, { en, fa }) },
    });
  } else {
    await db.profile.create({ data: { ...shared, translations: createTranslations({ en, fa }) } });
  }

  return succeed("پروفایل ذخیره شد.", contentTags.profile);
}
