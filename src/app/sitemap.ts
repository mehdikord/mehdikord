import type { MetadataRoute } from "next";

import { site } from "@/data/site";
import { locales } from "@/i18n/config";
import { getProjectSlugs } from "@/lib/projects";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (path: string) => new URL(path, site.url).toString();
  const paths = [
    { path: "", priority: 1 },
    { path: "/projects", priority: 0.8 },
    ...(await getProjectSlugs()).map((slug) => ({ path: `/projects/${slug}`, priority: 0.6 })),
  ];

  return paths.flatMap(({ path, priority }) =>
    locales.map((locale) => ({
      url: url(`/${locale}${path}`),
      priority,
      alternates: {
        languages: Object.fromEntries(locales.map((other) => [other, url(`/${other}${path}`)])),
      },
    })),
  );
}
