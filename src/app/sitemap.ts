import type { MetadataRoute } from "next";

import { site } from "@/data/profile";
import { getAllProjects } from "@/lib/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, site.url).toString();
  return [
    { url: url("/"), priority: 1 },
    { url: url("/projects"), priority: 0.8 },
    ...getAllProjects().map((project) => ({ url: url(`/projects/${project.slug}`), priority: 0.6 })),
  ];
}
