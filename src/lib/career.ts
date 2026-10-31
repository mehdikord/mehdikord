import { cacheLife, cacheTag } from "next/cache";

import type { Locale } from "@/i18n/config";
import { contentTags } from "@/lib/content-tags";
import { jsonStrings, pickTranslation } from "@/lib/translations";
import { db } from "@/server/db";
import type { ExperienceEntry, SkillGroup } from "@/types/portfolio";

/** Career timeline in display order (most recent first by convention). */
export async function getExperience(locale: Locale): Promise<readonly ExperienceEntry[]> {
  "use cache";
  cacheTag(contentTags.career);
  cacheLife("max");

  const rows = await db.experience.findMany({
    include: { translations: true },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  });

  return rows.flatMap((row) => {
    const text = pickTranslation(row.translations, locale);
    if (!text) return [];
    return [
      {
        id: String(row.id),
        company: text.company,
        companyContext: text.companyContext || undefined,
        position: text.position,
        start: row.startMonth,
        end: row.endMonth,
        location: text.location || undefined,
        logo: row.logoUrl || undefined,
        description: text.description,
        responsibilities: jsonStrings(text.responsibilities),
        technologies: jsonStrings(row.technologies),
      },
    ];
  });
}

export async function getSkillGroups(locale: Locale): Promise<readonly SkillGroup[]> {
  "use cache";
  cacheTag(contentTags.career);
  cacheLife("max");

  const rows = await db.skillGroup.findMany({
    include: { translations: true },
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
  });

  return rows.flatMap((row) => {
    const text = pickTranslation(row.translations, locale);
    if (!text) return [];
    return [{ id: String(row.id), title: text.title, annotation: text.annotation, items: jsonStrings(text.items) }];
  });
}
