import type { Metadata } from "next";

import { ProjectEditor } from "@/components/admin/managers/ProjectsManager";
import { getCategoryOptions, getNextProjectOrder } from "@/server/admin/queries";

export const metadata: Metadata = { title: "پروژه جدید" };

export default async function NewProjectPage() {
  const [categories, nextOrder] = await Promise.all([getCategoryOptions(), getNextProjectOrder()]);
  return <ProjectEditor item={null} categories={categories} nextOrder={nextOrder} />;
}
