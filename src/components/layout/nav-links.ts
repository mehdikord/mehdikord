import type { SectionId } from "@/data/sections";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/i18n/format";

/** Homepage section links that work from any route. */
export function sectionHref(locale: Locale, id: SectionId): string {
  return id === "top" ? localePath(locale) : localePath(locale, `#${id}`);
}
