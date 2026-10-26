import type { Metadata } from "next";

import { PrinciplesManager } from "@/components/admin/managers/PrinciplesManager";
import { getPrincipleItems } from "@/server/admin/queries";

export const metadata: Metadata = { title: "اصول مهندسی" };

export default async function PrinciplesPage() {
  return <PrinciplesManager items={await getPrincipleItems()} />;
}
