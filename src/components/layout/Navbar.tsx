"use client";

import { m } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";

import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { sectionHref } from "@/components/layout/nav-links";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { ProgressRing, SectionReadout } from "@/components/layout/SectionReadout";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { ease } from "@/components/motion/motion-variants";
import { StatusDot } from "@/components/ui/StatusDot";
import { Wordmark } from "@/components/ui/Wordmark";
import type { Dictionary } from "@/data/dictionaries";
import { navigationSections, type NavigationSection, type SectionId } from "@/data/sections";
import { localePath, pad } from "@/i18n/format";
import { useLocale } from "@/i18n/LocaleProvider";
import { useFinePointer, useMediaQuery } from "@/hooks/use-media-query";
import { useActiveSection, useScrollDirection, useScrolledPast, useSectionProgress } from "@/hooks/use-scroll-state";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types/portfolio";

const MENU_ID = "mobile-navigation";

/** Every homepage section the readout can name, in page order. */
const readoutSections = ["top", "about", "work", "expertise", "experience", "contact"] as const satisfies readonly SectionId[];

/** Scroll depth after which the island may condense while scrolling down. */
const CONDENSE_AFTER = 560;

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
 * Site header. A transparent bar over the hero that becomes a floating glass
 * island once the page scrolls. On the homepage, scrolling down condenses
 * the island into a small "now reading" pill — section number, name and a
 * ring filling with progress through that section — so the scenes get the
 * room; scrolling up, hovering, focusing or clicking it brings the full
 * navigation back. A pill slides behind the hovered / active link and
 * underlines the active one with the same section progress; a light follows
 * the pointer along the island's edge. Small screens show the readout
 * beside the monogram and open a glass sheet for the links.
 */
export function Navbar({ copy, brand, availability, projectCount }: NavbarProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const home = localePath(locale);
  const projectsPath = localePath(locale, "/projects");
  const isHome = pathname === home;
  const scrolled = useScrolledPast(24);
  const deep = useScrolledPast(CONDENSE_AFTER);
  const [direction, resetDirection] = useScrollDirection();
  const isDesktop = useMediaQuery("(min-width: 48rem)");
  const finePointer = useFinePointer();
  const activeSection = useActiveSection(isHome ? navigationSections : []);
  const readingSection = useActiveSection(isHome ? readoutSections : []);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const leaveTimer = useRef(0);

  const [menuOpen, setMenuOpen] = useState(false);
  const [engaged, setEngaged] = useState(false);
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
  const reading: SectionId | null = isHome ? (readingSection ?? "top") : null;
  useSectionProgress(reading, headerRef);

  const readoutIndex = reading ? readoutSections.indexOf(reading) : 0;
  const readout = reading
    ? { id: reading, index: pad(locale, readoutIndex), label: copy.nav.sections[reading] }
    : null;

  const island = scrolled || menuOpen;
  const condensed = isDesktop && isHome && island && deep && direction === "down" && !engaged && !menuOpen;
  const mobileReadout = !isDesktop && isHome && scrolled && reading !== null && reading !== "top";
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
  }, [measure, scrolled, condensed]);

  useEffect(() => () => window.clearTimeout(leaveTimer.current), []);

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

  function handleIslandMove(event: PointerEvent<HTMLDivElement>) {
    if (!finePointer || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const { style } = event.currentTarget;
    style.setProperty("--nx", `${event.clientX - rect.left}px`);
    style.setProperty("--ny", `${event.clientY - rect.top}px`);
    style.setProperty("--na", "1");
  }

  function handleIslandEnter(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    window.clearTimeout(leaveTimer.current);
    setEngaged(true);
  }

  function handleIslandLeave(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.style.setProperty("--na", "0");
    if (event.pointerType !== "mouse") return;
    window.clearTimeout(leaveTimer.current);
    // A short grace period, so brushing past the edge doesn't snap it shut.
    leaveTimer.current = window.setTimeout(() => setEngaged(false), 450);
  }

  return (
    <m.header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-50"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: ease.outExpo, delay: isHome ? 0.65 : 0.1 }}
      data-reveal=""
    >
      <div
        onPointerEnter={handleIslandEnter}
        onPointerLeave={handleIslandLeave}
        onPointerMove={handleIslandMove}
        onFocusCapture={() => setEngaged(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setEngaged(false);
        }}
        className={cn(
          "nav-island relative z-10 mx-auto overflow-hidden transition-[width,max-width,margin,border-radius,background-color,border-color,box-shadow,height] duration-[650ms] ease-out-expo",
          island
            ? "glass-nav mt-3 h-14 w-[calc(100%-1.5rem)] rounded-full md:w-[calc(100%-3rem)]"
            : "mt-0 h-(--nav-h) w-full max-w-[100rem] rounded-none border border-transparent",
          island && (condensed ? "max-w-[22rem]" : "max-w-[78rem]"),
        )}
      >
        <nav
          aria-label={copy.nav.primaryLabel}
          className={cn(
            "flex h-full items-center justify-between gap-3 transition-[padding,opacity] ease-out-expo",
            island ? "ps-3 pe-2.5 md:ps-5 md:pe-3" : "px-(--gutter)",
            condensed ? "pointer-events-none opacity-0 duration-150" : "opacity-100 delay-150 duration-500",
          )}
        >
          <div className="flex min-w-0 items-center gap-3">
            <Wordmark
              name={brand.name}
              initials={brand.initials}
              homeLabel={copy.nav.home}
              compactName={mobileReadout}
              onNavigate={() => setMenuOpen(false)}
              className="min-w-0"
            />
            {mobileReadout && readout ? (
              <m.span
                className="flex min-w-0 items-center gap-3 md:hidden"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: ease.outExpo }}
              >
                <span aria-hidden className="h-5 w-px shrink-0 bg-line-strong" />
                <SectionReadout {...readout} ring />
              </m.span>
            ) : null}
          </div>

          <ul
            ref={listRef}
            className="relative hidden items-center md:flex"
            onPointerLeave={() => setHovered(null)}
          >
            {/* Sliding pill behind the hovered / active link. */}
            <span
              aria-hidden
              className={cn(
                "absolute top-1/2 left-0 h-9 overflow-hidden rounded-full border border-line bg-tint/[0.06] transition-[transform,width,opacity] duration-500 ease-out-expo",
                highlight ? "opacity-100" : "opacity-0",
              )}
              style={{ transform: `translate3d(${highlight?.x ?? 0}px, -50%, 0)`, width: highlight?.width ?? 0 }}
            >
              {/* Reading progress through the active section. */}
              <span
                className={cn(
                  "absolute inset-x-3 bottom-0 h-px origin-left bg-gradient-to-r from-accent to-indigo transition-opacity duration-300 rtl:origin-right rtl:bg-gradient-to-l",
                  target === current && reading === current && current !== "top" ? "opacity-100" : "opacity-0",
                )}
                style={{ transform: "scaleX(var(--section-p, 0))" }}
              />
            </span>
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

          <div className="flex shrink-0 items-center gap-2">
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

            <Link
              href={sectionHref(locale, "contact")}
              onClick={(event) => handleSectionClick("contact", event)}
              title={availability.label}
              className="nav-cta group/cta relative hidden h-9 items-center gap-2.5 overflow-hidden rounded-full bg-fg ps-3.5 pe-4 text-[0.8125rem] font-medium whitespace-nowrap text-ink-950 transition-[box-shadow,background-color] duration-300 hover:shadow-glow lg:inline-flex"
            >
              <StatusDot active={availability.available} />
              {copy.nav.cta}
            </Link>

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

        {/* Condensed "now reading" pill (desktop, homepage, scrolling down). */}
        <button
          type="button"
          tabIndex={-1}
          aria-hidden
          onClick={resetDirection}
          className={cn(
            "absolute inset-0 hidden items-center gap-3 ps-2.5 pe-3.5 text-start transition-opacity ease-out-expo md:flex",
            condensed ? "opacity-100 delay-200 duration-500" : "pointer-events-none opacity-0 duration-150",
          )}
        >
          <span
            dir="ltr"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-line-strong font-mono text-[0.75rem] font-medium tracking-tight"
          >
            {brand.initials.charAt(0)}
            <span className="text-accent">/</span>
            {brand.initials.charAt(1)}
          </span>
          <span className="h-5 w-px shrink-0 bg-line-strong" />
          {readout ? <SectionReadout {...readout} className="flex-1" /> : <span className="flex-1" />}
          <ProgressRing />
        </button>

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
