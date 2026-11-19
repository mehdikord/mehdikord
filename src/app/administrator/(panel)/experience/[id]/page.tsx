import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ExperienceEditor } from "@/components/admin/managers/ExperienceManager";
import { getExperienceItem } from "@/server/admin/queries";

export const metadata: Metadata = { title: "ویرایش سابقه کاری" };

export default async function EditExperiencePage({ params }: PageProps<"/administrator/experience/[id]">) {
  const item = await getExperienceItem((await params).id);
  if (!item) notFound();
  return <ExperienceEditor item={item} nextOrder={item.sortOrder} />;
}
