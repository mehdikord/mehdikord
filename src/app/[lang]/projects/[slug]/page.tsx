import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectCaseStudy } from "@/components/projects/ProjectCaseStudy";
import { getDictionary } from "@/data/dictionaries";
import { localePath } from "@/i18n/format";
import { languageAlternates } from "@/i18n/metadata";
import { getLocale } from "@/i18n/server";
import { getProjectBySlug, getProjectIndex, getProjectSlugs, MISSING_PROJECT_SLUG } from "@/lib/projects";

export async function generateStaticParams() {
  // The extra sample prerenders the project 404 that the proxy serves for unknown slugs.
  return [...(await getProjectSlugs()), MISSING_PROJECT_SLUG].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/projects/[slug]">): Promise<Metadata> {
  const [{ slug }, locale] = await Promise.all([params, getLocale()]);
  const project = await getProjectBySlug(locale, slug);
  if (!project) return { title: getDictionary(locale).notFound.projectTitle };

  const path = `/projects/${project.slug}`;
  return {
    title: project.title,
    description: project.shortDescription,
    alternates: { canonical: localePath(locale, path), languages: languageAlternates(path) },
    openGraph: {
      type: "article",
      title: project.title,
      description: project.shortDescription,
      url: localePath(locale, path),
    },
  };
}

export default async function ProjectPage({ params }: PageProps<"/[lang]/projects/[slug]">) {
  const [{ slug }, locale] = await Promise.all([params, getLocale()]);
  const project = await getProjectBySlug(locale, slug);
  if (!project) notFound();

  return <ProjectCaseStudy project={project} index={await getProjectIndex(project.slug)} />;
}
