"use client";

import { m } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, type MouseEvent } from "react";

import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { sectionHref } from "@/components/layout/nav-links";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { ease } from "@/components/motion/motion-variants";
import { Wordmark } from "@/components/ui/Wordmark";
import type { Dictionary } from "@/data/dictionaries";
import { navigationSections, type NavigationSection } from "@/data/sections";
import { localePath, pad } from "@/i18n/format";
import { useLocale } from "@/i18n/LocaleProvider";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useActiveSection, useScrolledPast } from "@/hooks/use-scroll-state";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types/portfolio";

const MENU_ID = "mobile-navigation";

export interface NavbarProps {
  copy: Pick<Dictionary, "nav" | "language" | "theme">;
  brand: { name: string; initials: string };
  availability: Profile["availability"];
  projectCount: number;
}

export function Navbar({ copy, brand, availability, projectCount }: NavbarProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const home = localePath(locale);
  const projectsPath = localePath(locale, "/projects");
  const isHome = pathname === home;
  const scrolled = useScrolledPast(24);
  const isDesktop = useMediaQuery("(min-width: 48rem)");
  const activeSection = useActiveSection(isHome ? navigationSections : []);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  // Close transient UI when the route changes or the layout becomes desktop.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
  }
  if (isDesktop && menuOpen) setMenuOpen(false);

  const current: NavigationSection | null = isHome
    ? (activeSection ?? "top")
    : pathname.startsWith(projectsPath)
      ? "work"
      : null;

  function closeMenu(options?: { restoreFocus?: boolean }) {
    setMenuOpen(false);
    if (options?.restoreFocus) toggleRef.current?.focus();
  }

  function handleSectionClick(id: NavigationSection, event: MouseEvent<HTMLAnchorElement>) {
    setMenuOpen(false);
    // "Home" on the homepage scrolls back to the top instead of re-navigating.
    if (id === "top" && isHome) {
      event.preventDefault();
      window.scrollTo({ top: 0 });
      window.history.replaceState(window.history.state, "", home);
    }
  }

  const solid = scrolled || menuOpen;

  return (
    <m.header
      className="fixed inset-x-0 top-0 z-50"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: ease.outExpo, delay: isHome ? 0.65 : 0.1 }}
      data-reveal=""
    >
      <div
        className={cn(
          "relative border-b transition-[background-color,border-color,backdrop-filter] duration-500",
          solid ? "border-line bg-ink-950/75 backdrop-blur-xl" : "border-transparent bg-transparent",
        )}
      >
        <nav
          aria-label={copy.nav.primaryLabel}
          className="container-page flex h-(--nav-h) items-center justify-between gap-4"
        >
          <Wordmark
            name={brand.name}
            initials={brand.initials}
            homeLabel={copy.nav.home}
            onNavigate={() => setMenuOpen(false)}
          />

          <ul className="hidden items-center gap-1 md:flex">
            {navigationSections.map((id) => {
              const isActive = current === id;
              return (
                <li key={id}>
                  <Link
                    href={sectionHref(locale, id)}
                    onClick={(event) => handleSectionClick(id, event)}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "group relative inline-flex h-9 items-center rounded-full px-3 text-[0.8125rem] font-medium whitespace-nowrap transition-colors duration-300 lg:px-4",
                      isActive ? "text-fg" : "text-fg-muted hover:text-fg",
                    )}
                  >
                    {copy.nav.items[id]}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute bottom-0.5 left-1/2 h-px -translate-x-1/2 bg-accent transition-[width,opacity] duration-500 ease-out-expo",
                        isActive ? "w-4 opacity-100" : "w-0 opacity-0 group-hover:w-2 group-hover:opacity-60",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <Link
              href={projectsPath}
              className={cn(
                "hidden h-9 items-center gap-2 rounded-full border px-4 text-[0.8125rem] font-medium whitespace-nowrap transition-colors duration-300 xl:inline-flex",
                pathname === projectsPath
                  ? "border-accent/50 bg-accent-soft text-fg"
                  : "border-line-strong text-fg hover:border-accent/50",
              )}
            >
              {copy.nav.allProjects}
              <span className="font-mono text-[0.6875rem] text-fg-subtle">{pad(locale, projectCount)}</span>
            </Link>

            <ThemeToggle copy={copy.theme} />
            <LanguageSwitcher copy={copy.language} />

            <button
              ref={toggleRef}
              type="button"
              className="relative inline-flex size-10 items-center justify-center rounded-full border border-line-strong md:hidden"
              aria-expanded={menuOpen}
              aria-controls={MENU_ID}
              aria-label={menuOpen ? copy.nav.closeMenu : copy.nav.openMenu}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span aria-hidden className="relative block h-2.5 w-4">
                <span
                  className={cn(
                    "absolute start-0 h-px w-4 bg-fg transition-transform duration-500 ease-out-expo",
                    menuOpen ? "top-1/2 rotate-45" : "top-0",
                  )}
                />
                <span
                  className={cn(
                    "absolute start-0 h-px w-4 bg-fg transition-transform duration-500 ease-out-expo",
                    menuOpen ? "top-1/2 -rotate-45" : "top-full",
                  )}
                />
              </span>
            </button>
          </div>
        </nav>
        <ScrollProgress />
      </div>

      <MobileMenu
        id={MENU_ID}
        open={menuOpen}
        current={current}
        copy={copy.nav}
        availability={availability}
        toggleRef={toggleRef}
        onClose={closeMenu}
        onSectionClick={handleSectionClick}
      />
    </m.header>
  );
}
