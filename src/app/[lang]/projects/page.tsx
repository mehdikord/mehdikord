import type { Metadata } from "next";
import { Suspense } from "react";

import { MaskedHeading } from "@/components/motion/MaskedHeading";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectExplorer, ProjectExplorerWithParams, type ExplorerEntry } from "@/components/projects/ProjectExplorer";
import { ProjectIndexRow } from "@/components/projects/ProjectIndexRow";
import { ProjectMedia } from "@/components/projects/ProjectMedia";
import { getDictionary } from "@/data/dictionaries";
import { localePath, pad } from "@/i18n/format";
import { languageAlternates } from "@/i18n/metadata";
import { getLocale } from "@/i18n/server";
import { getAllProjects, getUsedCategories } from "@/lib/projects";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const copy = getDictionary(locale).projectsPage;
  return {
    title: copy.metaTitle,
    description: copy.intro,
    alternates: { canonical: localePath(locale, "/projects"), languages: languageAlternates("/projects") },
    openGraph: { title: copy.metaTitle, description: copy.intro, url: localePath(locale, "/projects") },
  };
}

export default async function ProjectsPage() {
  const locale = await getLocale();
  const copy = getDictionary(locale).projectsPage;
  const [projects, usedCategories] = await Promise.all([getAllProjects(locale), getUsedCategories(locale)]);
  const categories = usedCategories.map((category) => ({
    id: category.id,
    label: category.label,
    count: projects.filter((project) => project.category === category.id).length,
  }));

  const entries: ExplorerEntry[] = projects.map((project, index) => ({
    slug: project.slug,
    title: project.title,
    category: project.category,
    categoryLabel: project.categoryLabel,
    row: <ProjectIndexRow project={project} index={index} />,
    media: <ProjectMedia project={project} className="h-full" sizes="40vw" />,
  }));

  const explorerCopy = {
    all: copy.all,
    filterLabel: copy.filterLabel,
    projectsNoun: copy.projectsNoun,
    emptyTitle: copy.emptyTitle,
    emptyBody: copy.emptyBody,
    reset: copy.reset,
  };

  return (
    <>
      <header className="container-page pt-[calc(var(--nav-h)+2.5rem)] md:pt-[calc(var(--nav-h)+3.5rem)]">
        <Reveal still className="label-mono flex flex-wrap items-center gap-x-4 gap-y-2 text-fg-subtle">
          <span className="text-accent">{copy.label}</span>
          <span aria-hidden className="h-px w-10 bg-line" />
          <span className="flex items-center gap-2">
            <span className="text-fg">{pad(locale, projects.length)}</span>
            {copy.projectsNoun}
            <span aria-hidden className="mx-1 text-line-strong">/</span>
            <span className="text-fg">{pad(locale, categories.length)}</span>
            {copy.domainsNoun}
          </span>
        </Reveal>

        <div className="mt-6 grid gap-6 md:mt-8 lg:grid-cols-12 lg:items-end lg:gap-x-8">
          <MaskedHeading
            as="h1"
            inline
            lines={copy.title}
            className="text-[clamp(2.25rem,1.3rem+3vw,4rem)] leading-[1.05] font-semibold tracking-[-0.04em] text-balance lg:col-span-7"
          />
          <Reveal delay={0.15} className="lg:col-span-4 lg:col-start-9">
            <p className="max-w-md text-pretty text-[0.9375rem] text-fg-muted">{copy.intro}</p>
          </Reveal>
        </div>
      </header>

      <section aria-label={copy.metaTitle} className="container-page mt-10 pb-(--section-y) md:mt-14">
        <Suspense
          fallback={<ProjectExplorer copy={explorerCopy} entries={entries} categories={categories} activeCategory={null} />}
        >
          <ProjectExplorerWithParams copy={explorerCopy} entries={entries} categories={categories} />
        </Suspense>
      </section>
    </>
  );
}
