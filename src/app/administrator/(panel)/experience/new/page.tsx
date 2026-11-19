import type { Metadata } from "next";

import { ExperienceEditor } from "@/components/admin/managers/ExperienceManager";
import { getNextExperienceOrder } from "@/server/admin/queries";

export const metadata: Metadata = { title: "سابقه کاری جدید" };

export default async function NewExperiencePage() {
  return <ExperienceEditor item={null} nextOrder={await getNextExperienceOrder()} />;
}
