import { ArrowUpLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/admin/resource";
import { localizeDigits } from "@/i18n/format";
import { getDashboardCounts } from "@/server/admin/queries";

export const metadata: Metadata = { title: "داشبورد" };

export default async function DashboardPage() {
  const counts = await getDashboardCounts();
  const cards = [
    { href: "/administrator/projects", label: "پروژه‌ها", value: counts.projects, note: `${localizeDigits("fa", counts.featured)} پروژه ویژه · ${localizeDigits("fa", counts.images)} تصویر` },
    { href: "/administrator/categories", label: "دسته‌بندی‌ها", value: counts.categories },
    { href: "/administrator/experience", label: "سوابق کاری", value: counts.experience },
    { href: "/administrator/skills", label: "گروه‌های مهارت", value: counts.skillGroups },
    { href: "/administrator/principles", label: "اصول مهندسی", value: counts.principles },
    { href: "/administrator/strengths", label: "توانمندی‌های کلیدی", value: counts.strengths },
  ];

  return (
    <>
      <PageHeader title="داشبورد" description="خلاصه محتوای سایت. هر تغییری که در پنل ذخیره شود، بلافاصله روی سایت منتشر می‌شود." />
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <li key={card.href}>
            <Link
              href={card.href}
              className="group flex h-full flex-col rounded-lg border border-line bg-ink-900/60 p-5 transition-colors hover:border-accent/40"
            >
              <span className="flex items-center justify-between text-sm text-fg-muted">
                {card.label}
                <ArrowUpLeft aria-hidden className="size-4 text-fg-subtle transition-colors group-hover:text-accent" />
              </span>
              <span className="mt-4 text-3xl font-semibold">{localizeDigits("fa", card.value)}</span>
              {card.note ? <span className="mt-1 text-xs text-fg-subtle">{card.note}</span> : null}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
