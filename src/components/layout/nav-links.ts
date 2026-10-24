import type { SectionId } from "@/data/content";

/** Homepage section links work from any route. */
export function sectionHref(id: SectionId): string {
  return id === "top" ? "/" : `/#${id}`;
}
