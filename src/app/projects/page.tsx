import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { MaskedHeading } from "@/components/motion/MaskedHeading";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectExplorer, ProjectExplorerWithParams, type ExplorerEntry } from "@/components/projects/ProjectExplorer";
import { ProjectIndexRow } from "@/components/projects/ProjectIndexRow";
import { ProjectMedia } from "@/components/projects/ProjectMedia";
import { content } from "@/data/content";
import { getAllProjects, getCategoryLabel, getUsedCategories } from "@/lib/projects";
import { pad } from "@/lib/utils";

const copy = content.projectsPage;

export const metadata: Metadata = {
  title: "Projects",
  description: copy.intro,
  alternates: { canonical: "/projects" },
  openGraph: { title: "Projects", description: copy.intro, url: "/projects" },
};

export default function ProjectsPage() {
  const projects = getAllProjects();
  const categories = getUsedCategories().map((category) => ({
    id: category.id,
    label: category.label,
    count: projects.filter((project) => project.category === category.id).length,
  }));

  const entries: ExplorerEntry[] = projects.map((project, index) => ({
    slug: project.slug,
    title: project.title,
    category: project.category,
    categoryLabel: getCategoryLabel(project.category),
    row: <ProjectIndexRow project={project} index={index} />,
    media: <ProjectMedia project={project} className="h-full" sizes="40vw" />,
  }));

  return (
    <>
      <header className="container-page pt-[calc(var(--nav-h)+3.5rem)] md:pt-[calc(var(--nav-h)+6rem)]">
        <Reveal still>
          <Link
            href="/"
            className="group label-mono inline-flex items-center gap-2 text-fg-subtle transition-colors hover:text-fg"
          >
            <ArrowLeft aria-hidden className="size-3.5 transition-transform duration-500 ease-out-expo group-hover:-translate-x-1" />
            {copy.backHome}
          </Link>
        </Reveal>

        <div className="mt-14 grid gap-10 md:mt-20 lg:grid-cols-12 lg:items-end lg:gap-x-8">
          <div className="lg:col-span-7">
            <Reveal still className="label-mono flex items-center gap-4 text-fg-subtle">
              <span className="text-accent">{copy.label}</span>
              <span aria-hidden className="h-px w-16 bg-line" />
            </Reveal>
            <MaskedHeading
              as="h1"
              lines={copy.title}
              className="text-display mt-6"
            />
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal delay={0.15}>
              <p className="text-pretty text-fg-muted">{copy.intro}</p>
            </Reveal>
            <Reveal delay={0.25} className="mt-8 flex gap-10">
              <p>
                <span className="block text-4xl font-semibold tracking-[-0.04em]">{pad(projects.length)}</span>
                <span className="label-mono text-fg-subtle">{copy.projectsNoun}</span>
              </p>
              <p>
                <span className="block text-4xl font-semibold tracking-[-0.04em]">{pad(categories.length)}</span>
                <span className="label-mono text-fg-subtle">{copy.domainsNoun}</span>
              </p>
            </Reveal>
          </div>
        </div>
      </header>

      <section aria-label={content.work.label} className="container-page mt-16 pb-(--section-y) md:mt-24">
        <Suspense fallback={<ProjectExplorer entries={entries} categories={categories} activeCategory={null} />}>
          <ProjectExplorerWithParams entries={entries} categories={categories} />
        </Suspense>
      </section>
    </>
  );
}
