import { ArrowUp, ArrowUpRight } from "lucide-react";
import { cacheLife } from "next/cache";
import Link from "next/link";

import { sectionHref } from "@/components/layout/nav-links";
import { content, navigation } from "@/data/content";
import { profile } from "@/data/profile";

async function getCurrentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export async function Footer() {
  const year = await getCurrentYear();

  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink-950">
      <div className="container-page pt-16 pb-10 md:pt-24">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="label-mono text-fg-subtle">{profile.title}</p>
            <p className="mt-4 max-w-md text-pretty text-fg-muted">{profile.summary}</p>
            <Link
              href={sectionHref("contact")}
              className="group mt-8 inline-flex items-center gap-2 text-lg font-medium tracking-tight text-fg"
            >
              {profile.hero.secondaryCta.label}
              <ArrowUpRight
                aria-hidden
                className="size-5 text-accent transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                strokeWidth={1.75}
              />
            </Link>
          </div>

          <nav aria-label={content.footer.navigationLabel} className="md:col-span-3 md:col-start-8">
            <ul className="space-y-3">
              {navigation.map((item) => (
                <li key={item.id}>
                  <Link href={sectionHref(item.id)} className="text-sm text-fg-muted transition-colors hover:text-fg">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/projects" className="text-sm text-fg-muted transition-colors hover:text-fg">
                  {content.nav.allProjects}
                </Link>
              </li>
            </ul>
          </nav>

          <div className="md:col-span-2 md:justify-self-end">
            <a
              href="#page-top"
              className="group inline-flex items-center gap-2 text-sm text-fg-muted transition-colors hover:text-fg"
            >
              {content.footer.backToTop}
              <span className="inline-flex size-8 items-center justify-center rounded-full border border-line-strong transition-colors group-hover:border-accent/60">
                <ArrowUp aria-hidden className="size-3.5" strokeWidth={1.75} />
              </span>
            </a>
          </div>
        </div>

        <p
          aria-hidden
          className="mt-20 select-none bg-gradient-to-b from-fg/[0.14] to-fg/0 bg-clip-text text-[clamp(3.5rem,15.5vw,15rem)] leading-[0.82] font-semibold tracking-[-0.06em] whitespace-nowrap text-transparent md:mt-28"
        >
          {profile.name}
        </p>

        <div className="mt-6 flex flex-col gap-3 border-t border-line pt-6 text-xs text-fg-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {profile.name}. {content.footer.rights}
          </p>
          <p className="label-mono">{content.footer.builtWith}</p>
        </div>
      </div>
    </footer>
  );
}
