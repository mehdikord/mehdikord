import type { Metadata } from "next";

import { CategoriesManager } from "@/components/admin/managers/CategoriesManager";
import { getCategoryItems } from "@/server/admin/queries";

export const metadata: Metadata = { title: "دسته‌بندی پروژه‌ها" };

export default async function CategoriesPage() {
  return <CategoriesManager items={await getCategoryItems()} />;
}
