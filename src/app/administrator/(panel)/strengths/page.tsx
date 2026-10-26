import type { Metadata } from "next";

import { StrengthsManager } from "@/components/admin/managers/StrengthsManager";
import { getStrengthItems } from "@/server/admin/queries";

export const metadata: Metadata = { title: "توانمندی‌های کلیدی" };

export default async function StrengthsPage() {
  return <StrengthsManager items={await getStrengthItems()} />;
}
