import type { Metadata } from "next";

import { ExperienceManager } from "@/components/admin/managers/ExperienceManager";
import { getExperienceItems } from "@/server/admin/queries";

export const metadata: Metadata = { title: "سوابق کاری" };

export default async function ExperiencePage() {
  return <ExperienceManager items={await getExperienceItems()} />;
}
