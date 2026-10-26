"use client";

import { AnimatePresence, m } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, type RefObject } from "react";

import { sectionHref } from "@/components/layout/nav-links";
import { ease } from "@/components/motion/motion-variants";
import { StatusDot } from "@/components/ui/StatusDot";
import type { Dictionary } from "@/data/dictionaries";
import { navigationSections, type NavigationSection } from "@/data/sections";
import { localePath, pad } from "@/i18n/format";
import { useLocale } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types/portfolio";

interface MobileMenuProps {
  id: string;
  open: boolean;
  current: NavigationSection | null;
  copy: Dictionary["nav"];
  availability: Profile["availability"];
  toggleRef: RefObject<HTMLButtonElement | null>;
  onClose: (options?: { restoreFocus?: boolean }) => void;
  onSectionClick: (id: NavigationSection, event: React.MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * Full-width dropdown menu for small screens. Closes on Escape, outside
 * clicks and navigation; locks page scroll while open.
 */
export function MobileMenu({ id, open, current, copy, availability, toggleRef, onClose, onSectionClick }: MobileMenuProps) {
  const locale = useLocale();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    const firstLink = panelRef.current?.querySelector<HTMLAnchorElement>("a");
    firstLink?.focus({ preventScroll: true });

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose({ restoreFocus: true });
      }
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (panelRef.current?.contains(target) || toggleRef.current?.contains(target)) return;
      onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      root.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open, onClose, toggleRef]);

  return (
    <AnimatePresence>
      {open ? (
        <m.div
          key="mobile-menu"
          className="fixed inset-x-0 bottom-0 top-(--nav-h) z-40 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
          transition={{ duration: 0.3 }}
        >
          <div aria-hidden className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm" />
          <m.div
            ref={panelRef}
            id={id}
            className="relative max-h-full overflow-y-auto border-b border-line bg-ink-950/95 backdrop-blur-xl"
            initial={{ y: -16 }}
            animate={{ y: 0 }}
            exit={{ y: -10 }}
            transition={{ duration: 0.5, ease: ease.outExpo }}
          >
            <nav aria-label={copy.primaryLabel} className="container-page pt-4 pb-8">
              <m.ul
                className="divide-y divide-line border-y border-line"
                initial="hidden"
                animate="visible"
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } } }}
              >
                {navigationSections.map((item, index) => (
                  <m.li
                    key={item}
                    variants={{
                      hidden: { opacity: 0, y: 12 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: ease.outExpo } },
                    }}
                  >
                    <Link
                      href={sectionHref(locale, item)}
                      onClick={(event) => onSectionClick(item, event)}
                      aria-current={current === item ? "true" : undefined}
                      className={cn(
                        "flex items-baseline justify-between py-4 text-[1.75rem] font-medium tracking-tight transition-colors",
                        current === item ? "text-fg" : "text-fg-muted hover:text-fg",
                      )}
                    >
                      {copy.items[item]}
                      <span className={cn("label-mono", current === item ? "text-accent" : "text-fg-subtle")}>
                        {pad(locale, index + 1)}
                      </span>
                    </Link>
                  </m.li>
                ))}
              </m.ul>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <Link
                  href={localePath(locale, "/projects")}
                  onClick={() => onClose()}
                  className="label-mono rounded-full border border-line-strong px-4 py-2.5 text-fg transition-colors hover:border-accent/60"
                >
                  {copy.allProjects}
                </Link>
                <span className="label-mono inline-flex items-center gap-2 text-fg-subtle">
                  <StatusDot active={availability.available} />
                  {availability.label}
                </span>
              </div>
            </nav>
          </m.div>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
