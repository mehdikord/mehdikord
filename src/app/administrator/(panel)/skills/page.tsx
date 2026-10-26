import type { Metadata } from "next";

import { SkillGroupsManager } from "@/components/admin/managers/SkillGroupsManager";
import { getSkillGroupItems } from "@/server/admin/queries";

export const metadata: Metadata = { title: "مهارت‌ها" };

export default async function SkillsPage() {
  return <SkillGroupsManager items={await getSkillGroupItems()} />;
}
