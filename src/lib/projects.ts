import { projectCategories, projects } from "@/data/projects";
import { toSafeExternalUrl } from "@/lib/utils";
import type { CaseStudy, Project, ProjectCategory, ProjectCategoryId } from "@/types/portfolio";

/** Fails loudly during development and builds when the catalogue is malformed. */
function assertCatalogueIntegrity(list: readonly Project[]): void {
  const slugs = new Set<string>();
  const ids = new Set<string>();
  const categoryIds = new Set(projectCategories.map((category) => category.id));

  for (const project of list) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug)) {
      throw new Error(`Project "${project.id}" has an invalid slug: "${project.slug}"`);
    }
    if (slugs.has(project.slug)) throw new Error(`Duplicate project slug: "${project.slug}"`);
    if (ids.has(project.id)) throw new Error(`Duplicate project id: "${project.id}"`);
    if (!categoryIds.has(project.category)) {
      throw new Error(`Project "${project.slug}" uses unknown category "${project.category}"`);
    }
    if (project.liveUrl && !toSafeExternalUrl(project.liveUrl)) {
      throw new Error(`Project "${project.slug}" has an invalid liveUrl: "${project.liveUrl}"`);
    }
    slugs.add(project.slug);
    ids.add(project.id);
  }
}

assertCatalogueIntegrity(projects);

export function getAllProjects(): readonly Project[] {
  return projects;
}

export function getFeaturedProjects(): readonly Project[] {
  return projects.filter((project) => project.featured);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

/** Previous and next projects in display order, wrapping around. */
export function getAdjacentProjects(slug: string): { previous: Project; next: Project } | null {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1 || projects.length < 2) return null;
  const previous = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  return previous && next ? { previous, next } : null;
}

const categoryById = new Map(projectCategories.map((category) => [category.id, category]));

export function getCategoryLabel(id: ProjectCategoryId): string {
  return categoryById.get(id)?.label ?? id;
}

/** Categories that contain at least one project, in configured order. */
export function getUsedCategories(): readonly ProjectCategory[] {
  const used = new Set(projects.map((project) => project.category));
  return projectCategories.filter((category) => used.has(category.id));
}

export function isProjectCategory(value: string): value is ProjectCategoryId {
  return categoryById.has(value as ProjectCategoryId);
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
