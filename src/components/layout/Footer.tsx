import { ArrowUp, ArrowUpRight } from "lucide-react";
import { cacheLife } from "next/cache";
import Link from "next/link";

import { FooterAntigravity } from "@/components/layout/FooterAntigravity";
import { sectionHref } from "@/components/layout/nav-links";
import { getDictionary } from "@/data/dictionaries";
import { navigationSections } from "@/data/sections";
import { localePath, localizeDigits } from "@/i18n/format";
import { getLocale } from "@/i18n/server";
import { getProfile } from "@/lib/profile";

async function getCurrentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export async function Footer() {
  const [year, locale] = await Promise.all([getCurrentYear(), getLocale()]);
  const copy = getDictionary(locale);
  const profile = await getProfile(locale);

  return (
    <footer className="relative isolate overflow-hidden bg-ink-950">
      {/* Interactive particle field; the top fade softens the join with the section above. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <FooterAntigravity />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-ink-950 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-28 bg-gradient-to-t from-ink-950/85 via-ink-950/40 to-transparent"
      />
      <div className="container-page pt-16 pb-10 md:pt-24">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="label-mono text-fg-subtle">{profile.title}</p>
            <p className="mt-4 max-w-md text-pretty text-fg-muted">{profile.summary}</p>
            <Link
              href={sectionHref(locale, "contact")}
              className="group mt-8 inline-flex items-center gap-2 text-lg font-medium tracking-tight text-fg"
            >
              {profile.hero.secondaryCta.label}
              <ArrowUpRight
                aria-hidden
                className="size-5 text-accent transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
                strokeWidth={1.75}
              />
            </Link>
          </div>

          <nav aria-label={copy.footer.navigationLabel} className="md:col-span-3 md:col-start-8">
            <ul className="space-y-3">
              {navigationSections.map((id) => (
                <li key={id}>
                  <Link href={sectionHref(locale, id)} className="text-sm text-fg-muted transition-colors hover:text-fg">
                    {copy.nav.items[id]}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={localePath(locale, "/projects")} className="text-sm text-fg-muted transition-colors hover:text-fg">
                  {copy.nav.allProjects}
                </Link>
              </li>
            </ul>
          </nav>

          <div className="md:col-span-2 md:justify-self-end">
            <a
              href="#page-top"
              className="group inline-flex items-center gap-2 text-sm text-fg-muted transition-colors hover:text-fg"
            >
              {copy.footer.backToTop}
              <span className="inline-flex size-8 items-center justify-center rounded-full border border-line-strong transition-colors group-hover:border-accent/60">
                <ArrowUp aria-hidden className="size-3.5" strokeWidth={1.75} />
              </span>
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-line pt-6 text-xs md:mt-24 text-fg-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {localizeDigits(locale, year)} {profile.name}. {copy.footer.rights}
          </p>
          <p className="label-mono">{copy.footer.builtWith}</p>
        </div>
      </div>
    </footer>
  );
}
