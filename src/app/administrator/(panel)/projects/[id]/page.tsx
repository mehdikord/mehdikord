import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectEditor } from "@/components/admin/managers/ProjectsManager";
import { getCategoryOptions, getProjectItem } from "@/server/admin/queries";

export const metadata: Metadata = { title: "ویرایش پروژه" };

export default async function EditProjectPage({ params }: PageProps<"/administrator/projects/[id]">) {
  const { id } = await params;
  const [item, categories] = await Promise.all([getProjectItem(id), getCategoryOptions()]);
  if (!item) notFound();
  return <ProjectEditor item={item} categories={categories} nextOrder={item.sortOrder} />;
}
