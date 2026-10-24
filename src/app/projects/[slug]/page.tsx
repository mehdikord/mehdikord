import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectCaseStudy } from "@/components/projects/ProjectCaseStudy";
import { content } from "@/data/content";
import { getAllProjects, getProjectBySlug } from "@/lib/projects";

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: content.notFound.projectTitle };

  return {
    title: project.title,
    description: project.shortDescription,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      title: project.title,
      description: project.shortDescription,
      url: `/projects/${project.slug}`,
    },
  };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const index = getAllProjects().indexOf(project);
  return <ProjectCaseStudy project={project} index={index} />;
}
