import { cacheLife, cacheTag } from "next/cache";

import { defaultLocale, type Locale } from "@/i18n/config";
import { contentTags } from "@/lib/content-tags";
import { jsonNotes, jsonStrings, pickTranslation } from "@/lib/translations";
import { toSafeExternalUrl } from "@/lib/utils";
import { db } from "@/server/db";
import type { CaseStudy, Project, ProjectCategory, ProjectImage } from "@/types/portfolio";

export { MISSING_PROJECT_SLUG } from "@/lib/project-slugs";

interface Catalogue {
  /** Display order. */
  projects: Project[];
  /** Every category in configured order, used or not. */
  categories: ProjectCategory[];
}

/** The whole catalogue in one language, cached until the admin panel changes it. */
async function getCatalogue(locale: Locale): Promise<Catalogue> {
  "use cache";
  cacheTag(contentTags.projects);
  cacheLife("max");

  const [rows, categoryRows] = await Promise.all([
    db.project.findMany({
      include: {
        translations: true,
        category: true,
        images: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }] },
      },
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    }),
    db.projectCategory.findMany({ include: { translations: true }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }),
  ]);

  const categories = categoryRows.map((category) => ({
    id: category.slug,
    label: pickTranslation(category.translations, locale)?.label ?? category.slug,
  }));
  const labels = new Map(categories.map((category) => [category.id, category.label]));

  const projects = rows.flatMap((row): Project[] => {
    const text = pickTranslation(row.translations, locale);
    if (!text) return [];

    const images: ProjectImage[] = row.images.map((image) => ({
      src: image.path,
      alt: image.alt || text.title,
      width: image.width,
      height: image.height,
    }));
    const coverIndex = row.images.findIndex((image) => image.isCover);

    return [
      {
        id: String(row.id),
        slug: row.slug,
        title: text.title,
        shortDescription: text.shortDescription,
        fullDescription: jsonStrings(text.fullDescription),
        category: row.category.slug,
        categoryLabel: labels.get(row.category.slug) ?? row.category.slug,
        role: text.role,
        period: row.period,
        technologies: jsonStrings(row.technologies),
        liveUrl: row.liveUrl,
        featured: row.isFeatured,
        coverImage: images[coverIndex] ?? null,
        gallery: images.filter((_, index) => index !== coverIndex),
        highlights: jsonStrings(text.highlights),
        responsibilities: jsonStrings(text.responsibilities),
        caseStudyAvailable: row.caseStudyAvailable,
        caseStudy: text.caseStudyContext
          ? {
              context: text.caseStudyContext,
              challenges: jsonNotes(text.caseStudyChallenges),
              decisions: jsonNotes(text.caseStudyDecisions),
              implementation: jsonStrings(text.caseStudyImplementation),
            }
          : undefined,
      },
    ];
  });

  return { projects, categories };
}

export async function getAllProjects(locale: Locale): Promise<readonly Project[]> {
  return (await getCatalogue(locale)).projects;
}

export async function getFeaturedProjects(locale: Locale): Promise<readonly Project[]> {
  return (await getAllProjects(locale)).filter((project) => project.featured);
}

export async function getProjectBySlug(locale: Locale, slug: string): Promise<Project | undefined> {
  return (await getAllProjects(locale)).find((project) => project.slug === slug);
}

/** Every slug, for static generation. Slugs are shared by all languages. */
export async function getProjectSlugs(): Promise<string[]> {
  return (await getAllProjects(defaultLocale)).map((project) => project.slug);
}

/** Position of a project in display order. */
export async function getProjectIndex(slug: string): Promise<number> {
  return (await getAllProjects(defaultLocale)).findIndex((project) => project.slug === slug);
}

/** Previous and next projects in display order, wrapping around. */
export async function getAdjacentProjects(locale: Locale, slug: string): Promise<{ previous: Project; next: Project } | null> {
  const list = await getAllProjects(locale);
  const index = list.findIndex((project) => project.slug === slug);
  if (index === -1 || list.length < 2) return null;
  const previous = list[(index - 1 + list.length) % list.length];
  const next = list[(index + 1) % list.length];
  return previous && next ? { previous, next } : null;
}

/** Categories that contain at least one project, in configured order. */
export async function getUsedCategories(locale: Locale): Promise<readonly ProjectCategory[]> {
  const { projects, categories } = await getCatalogue(locale);
  const used = new Set(projects.map((project) => project.category));
  return categories.filter((category) => used.has(category.id));
}

/**
 * The case study when the project opts in and supplies enough material to
 * fill the template; otherwise `null`, and the page renders an overview.
 */
export function getCaseStudy(project: Project): CaseStudy | null {
  const study = project.caseStudy;
  if (!project.caseStudyAvailable || !study) return null;
  if (!study.context || (study.challenges.length === 0 && study.decisions.length === 0)) return null;
  return study;
}

export function getLiveUrl(project: Project): string | null {
  return toSafeExternalUrl(project.liveUrl);
}
