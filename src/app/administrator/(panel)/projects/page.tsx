import type { Metadata } from "next";

import { ProjectsManager } from "@/components/admin/managers/ProjectsManager";
import { getCategoryOptions, getProjectItems } from "@/server/admin/queries";

export const metadata: Metadata = { title: "پروژه‌ها" };

export default async function ProjectsPage() {
  const [items, categories] = await Promise.all([getProjectItems(), getCategoryOptions()]);
  return <ProjectsManager items={items} categories={categories} />;
}
