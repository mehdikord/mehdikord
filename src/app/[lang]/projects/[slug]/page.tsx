import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

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

/**
 * `params` is URL data: the route's shared App Shell can't know the slug, so
 * reading it sits inside `<Suspense>`. Known slugs are still fully prerendered,
 * and links to this page use `prefetch` so the content is ready before a click.
 */
export default function ProjectPage({ params }: PageProps<"/[lang]/projects/[slug]">) {
  return (
    <Suspense fallback={<ProjectSkeleton />}>
      <ProjectContent params={params} />
    </Suspense>
  );
}

async function ProjectContent({ params }: Pick<PageProps<"/[lang]/projects/[slug]">, "params">) {
  const [{ slug }, locale] = await Promise.all([params, getLocale()]);
  const project = await getProjectBySlug(locale, slug);
  if (!project) notFound();

  return <ProjectCaseStudy project={project} index={await getProjectIndex(project.slug)} />;
}

/** Mirrors the case-study header and cover so the page doesn't shift as it streams in. */
function ProjectSkeleton() {
  const bar = "rounded-sm bg-tint/[0.07] motion-safe:animate-pulse";
  return (
    <div aria-hidden>
      <div className="container-page pt-[calc(var(--nav-h)+1.5rem)] md:pt-[calc(var(--nav-h)+2.25rem)]">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div className={`${bar} h-3.5 w-28`} />
          <div className={`${bar} h-3.5 w-16`} />
        </div>
        <div className="mt-12 grid gap-8 md:mt-16 lg:grid-cols-12 lg:items-end lg:gap-x-8">
          <div className={`${bar} h-[clamp(2.75rem,1.3rem+5.4vw,6rem)] w-full lg:col-span-6`} />
          <div className="space-y-3 lg:col-span-4 lg:col-start-9">
            <div className={`${bar} h-4 w-full`} />
            <div className={`${bar} h-4 w-4/5`} />
          </div>
        </div>
        <div className={`${bar} mt-12 h-20 w-full md:mt-16`} />
      </div>
      <div className="container-page mt-16 md:mt-24">
        <div className={`${bar} aspect-[16/10] w-full rounded-md`} />
      </div>
    </div>
  );
}
