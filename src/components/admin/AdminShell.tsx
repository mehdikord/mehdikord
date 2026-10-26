"use client";

import {
  BriefcaseBusiness,
  ExternalLink,
  FolderKanban,
  Gauge,
  Lightbulb,
  LogOut,
  Sparkles,
  Tags,
  UserRound,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { ToastProvider } from "@/components/admin/Toast";
import { cn } from "@/lib/utils";
import { logout } from "@/server/admin/actions/auth";

const navigation: readonly { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/administrator", label: "داشبورد", icon: Gauge },
  { href: "/administrator/profile", label: "پروفایل و صفحه اصلی", icon: UserRound },
  { href: "/administrator/principles", label: "اصول مهندسی", icon: Lightbulb },
  { href: "/administrator/strengths", label: "توانمندی‌های کلیدی", icon: Sparkles },
  { href: "/administrator/categories", label: "دسته‌بندی پروژه‌ها", icon: Tags },
  { href: "/administrator/projects", label: "پروژه‌ها", icon: FolderKanban },
  { href: "/administrator/experience", label: "سوابق کاری", icon: BriefcaseBusiness },
  { href: "/administrator/skills", label: "مهارت‌ها", icon: Wrench },
];

export function AdminShell({ admin, children }: { admin: { name: string; phone: string }; children: ReactNode }) {
  const pathname = usePathname();

  return (
    <ToastProvider>
      <div className="min-h-svh lg:grid lg:grid-cols-[16.5rem_1fr]">
        <aside className="border-b border-line bg-ink-900/70 lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col lg:border-e lg:border-b-0">
          <div className="flex items-center justify-between gap-3 px-4 py-4 lg:px-5 lg:py-6">
            <Link href="/administrator" className="flex items-center gap-3">
              <span className="inline-flex size-9 items-center justify-center rounded-sm border border-accent/50 font-mono text-xs text-accent">
                MK
              </span>
              <span className="leading-tight">
                <span className="block text-sm font-semibold">پنل مدیریت</span>
                <span className="block text-xs text-fg-subtle">{admin.name}</span>
              </span>
            </Link>
            <form action={logout} className="lg:hidden">
              <button type="submit" aria-label="خروج" className="inline-flex size-9 items-center justify-center rounded-sm text-fg-subtle hover:bg-white/5 hover:text-fg">
                <LogOut aria-hidden className="size-4 rtl:-scale-x-100" />
              </button>
            </form>
          </div>

          <nav aria-label="بخش‌های پنل" className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:overflow-y-auto lg:px-3 lg:pb-0">
            {navigation.map(({ href, label, icon: Icon }) => {
              const active = href === "/administrator" ? pathname === href : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex shrink-0 items-center gap-3 rounded-sm px-3 py-2 text-sm whitespace-nowrap transition-colors",
                    active ? "bg-accent-soft text-fg" : "text-fg-muted hover:bg-white/5 hover:text-fg",
                  )}
                >
                  <Icon aria-hidden className={cn("size-4", active ? "text-accent" : "text-fg-subtle")} strokeWidth={1.75} />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden space-y-1 border-t border-line p-3 lg:block">
            <a href="/" target="_blank" rel="noopener" className="flex items-center gap-3 rounded-sm px-3 py-2 text-sm text-fg-muted hover:bg-white/5 hover:text-fg">
              <ExternalLink aria-hidden className="size-4 text-fg-subtle" strokeWidth={1.75} />
              مشاهده سایت
            </a>
            <form action={logout}>
              <button type="submit" className="flex w-full items-center gap-3 rounded-sm px-3 py-2 text-sm text-fg-muted hover:bg-white/5 hover:text-fg">
                <LogOut aria-hidden className="size-4 text-fg-subtle rtl:-scale-x-100" strokeWidth={1.75} />
                خروج
              </button>
            </form>
          </div>
        </aside>

        <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</main>
      </div>
    </ToastProvider>
  );
}
