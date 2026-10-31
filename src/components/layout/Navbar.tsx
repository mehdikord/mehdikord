"use client";

import { m } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";

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
import { useFinePointer, useMediaQuery } from "@/hooks/use-media-query";
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

interface Highlight {
  x: number;
  width: number;
}

/**
 * Site header. Starts as a transparent full-width bar over the hero and, once
 * the page scrolls, condenses into a floating glass island. A pill slides
 * behind the hovered or active section link; the reading-progress hairline
 * runs along the island's bottom edge.
 */
export function Navbar({ copy, brand, availability, projectCount }: NavbarProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const home = localePath(locale);
  const projectsPath = localePath(locale, "/projects");
  const isHome = pathname === home;
  const scrolled = useScrolledPast(24);
  const isDesktop = useMediaQuery("(min-width: 48rem)");
  const finePointer = useFinePointer();
  const activeSection = useActiveSection(isHome ? navigationSections : []);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);
  const [hovered, setHovered] = useState<NavigationSection | null>(null);
  const [highlight, setHighlight] = useState<Highlight | null>(null);

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

  const target = hovered ?? current;

  // Measure the link the pill should sit behind; re-measure on resize/fonts.
  const measure = useCallback(() => {
    const list = listRef.current;
    if (!list || !target) {
      setHighlight(null);
      return;
    }
    const link = list.querySelector<HTMLElement>(`[data-section="${target}"]`);
    if (!link) {
      setHighlight(null);
      return;
    }
    const listRect = list.getBoundingClientRect();
    const rect = link.getBoundingClientRect();
    setHighlight({ x: rect.left - listRect.left, width: rect.width });
  }, [target]);

  useEffect(() => {
    measure();
    const list = listRef.current;
    if (!list) return;
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => observer.disconnect();
  }, [measure, scrolled]);

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

  const island = scrolled || menuOpen;

  return (
    <m.header
      className="fixed inset-x-0 top-0 z-50"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: ease.outExpo, delay: isHome ? 0.65 : 0.1 }}
      data-reveal=""
    >
      <div
        className={cn(
          "relative z-10 mx-auto overflow-hidden transition-[width,max-width,margin,border-radius,background-color,border-color,box-shadow,height] duration-500 ease-out-expo",
          island
            ? "glass-nav mt-3 h-14 w-[calc(100%-1.5rem)] max-w-[78rem] rounded-full md:w-[calc(100%-3rem)]"
            : "mt-0 h-(--nav-h) w-full max-w-[100rem] rounded-none border border-transparent",
        )}
      >
        <nav
          aria-label={copy.nav.primaryLabel}
          className={cn(
            "flex h-full items-center justify-between gap-3 transition-[padding] duration-500 ease-out-expo",
            island ? "ps-4 pe-2.5 md:ps-5 md:pe-3" : "px-(--gutter)",
          )}
        >
          <Wordmark
            name={brand.name}
            initials={brand.initials}
            homeLabel={copy.nav.home}
            onNavigate={() => setMenuOpen(false)}
          />

          <ul
            ref={listRef}
            className="relative hidden items-center md:flex"
            onPointerLeave={() => setHovered(null)}
          >
            {/* Sliding pill behind the hovered / active link. */}
            <span
              aria-hidden
              className={cn(
                "absolute top-1/2 left-0 h-9 rounded-full border border-line bg-tint/[0.06] transition-[transform,width,opacity] duration-500 ease-out-expo",
                highlight ? "opacity-100" : "opacity-0",
              )}
              style={{ transform: `translate3d(${highlight?.x ?? 0}px, -50%, 0)`, width: highlight?.width ?? 0 }}
            />
            {navigationSections.map((id) => {
              const isActive = current === id;
              return (
                <li key={id} className="relative">
                  <Link
                    href={sectionHref(locale, id)}
                    data-section={id}
                    onClick={(event) => handleSectionClick(id, event)}
                    onPointerEnter={finePointer ? () => setHovered(id) : undefined}
                    onFocus={() => setHovered(id)}
                    onBlur={() => setHovered(null)}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "relative inline-flex h-9 items-center gap-2 rounded-full px-3.5 text-[0.8125rem] font-medium whitespace-nowrap transition-colors duration-300 lg:px-4",
                      isActive ? "text-fg" : "text-fg-muted hover:text-fg",
                    )}
                  >
                    {isActive ? <span aria-hidden className="size-1 rounded-full bg-accent" /> : null}
                    {copy.nav.items[id]}
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
                  : "border-line-strong text-fg hover:border-accent/50 hover:bg-accent-soft",
              )}
            >
              {copy.nav.allProjects}
              <span className="font-mono text-[0.6875rem] text-fg-subtle">{pad(locale, projectCount)}</span>
            </Link>

            <ThemeToggle copy={copy.theme} />
            <div className="hidden md:block">
              <LanguageSwitcher copy={copy.language} />
            </div>

            <button
              ref={toggleRef}
              type="button"
              className={cn(
                "relative inline-flex size-9 items-center justify-center rounded-full border transition-colors duration-300 md:hidden",
                menuOpen ? "border-accent/60 bg-accent-soft" : "border-line-strong",
              )}
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
        copy={copy}
        availability={availability}
        toggleRef={toggleRef}
        onClose={closeMenu}
        onSectionClick={handleSectionClick}
      />
    </m.header>
  );
}
