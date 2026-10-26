import { defaultLocale, type Locale } from "@/i18n/config";
import type { CaseStudyNote, HeadlineLine } from "@/types/portfolio";

/** The row for `locale`, falling back to the default language, then any row. */
export function pickTranslation<T extends { locale: string }>(rows: readonly T[], locale: Locale): T | undefined {
  return rows.find((row) => row.locale === locale) ?? rows.find((row) => row.locale === defaultLocale) ?? rows[0];
}

/* JSON columns are typed loosely by Prisma; these narrow them defensively. */

export function jsonStrings(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export function jsonNotes(value: unknown): CaseStudyNote[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) =>
    item && typeof item === "object" && typeof item.title === "string" && typeof item.detail === "string"
      ? [{ title: item.title, detail: item.detail }]
      : [],
  );
}

export function jsonHeadline(value: unknown): HeadlineLine[] {
  if (!Array.isArray(value)) return [];
  return value.map((line) =>
    Array.isArray(line)
      ? line.flatMap((segment) =>
          segment && typeof segment === "object" && typeof segment.text === "string"
            ? [{ text: segment.text, ...(segment.emphasis ? { emphasis: true } : {}) }]
            : [],
        )
      : [],
  );
}
