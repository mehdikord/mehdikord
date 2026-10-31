"use client";

import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, type RefObject } from "react";

import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
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
  copy: Pick<Dictionary, "nav" | "language">;
  availability: Profile["availability"];
  toggleRef: RefObject<HTMLButtonElement | null>;
  onClose: (options?: { restoreFocus?: boolean }) => void;
  onSectionClick: (id: NavigationSection, event: React.MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * Glass sheet that drops from the header island on small screens. Closes on
 * Escape, outside taps and navigation; locks page scroll while open.
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
          className="fixed inset-0 z-0 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
          transition={{ duration: 0.3 }}
        >
          <div aria-hidden className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm" />
          <m.div
            ref={panelRef}
            id={id}
            className="glass-nav absolute inset-x-3 top-[5.25rem] max-h-[calc(100svh-6.25rem)] overflow-y-auto rounded-[1.5rem]"
            initial={{ y: -14, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: -10, scale: 0.98 }}
            transition={{ duration: 0.5, ease: ease.outExpo }}
          >
            <nav aria-label={copy.nav.primaryLabel} className="px-5 pt-3 pb-5">
              <m.ul
                initial="hidden"
                animate="visible"
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05, delayChildren: 0.06 } } }}
              >
                {navigationSections.map((item, index) => {
                  const active = current === item;
                  return (
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
                        aria-current={active ? "true" : undefined}
                        className={cn(
                          "group flex items-center gap-4 border-b border-line py-3.5 text-[1.5rem] font-medium tracking-tight transition-colors",
                          active ? "text-fg" : "text-fg-muted",
                        )}
                      >
                        <span className={cn("label-mono w-7 shrink-0", active ? "text-accent" : "text-fg-subtle")}>
                          {pad(locale, index + 1)}
                        </span>
                        <span className="flex-1">{copy.nav.items[item]}</span>
                        <span
                          aria-hidden
                          className={cn(
                            "size-1.5 rounded-full transition-colors",
                            active ? "bg-accent" : "bg-transparent",
                          )}
                        />
                      </Link>
                    </m.li>
                  );
                })}
              </m.ul>

              <m.div
                className="mt-5 flex flex-col gap-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: ease.outExpo, delay: 0.3 }}
              >
                <div className="flex items-center justify-between gap-3">
                  <Link
                    href={localePath(locale, "/projects")}
                    onClick={() => onClose()}
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-fg ps-5 pe-4 text-sm font-medium text-ink-950"
                  >
                    {copy.nav.allProjects}
                    <ArrowUpRight className="size-4 rtl:-scale-x-100" strokeWidth={1.75} />
                  </Link>
                  <LanguageSwitcher copy={copy.language} onSwitch={() => onClose()} />
                </div>
                <span className="label-mono inline-flex items-center gap-2 text-fg-subtle">
                  <StatusDot active={availability.available} />
                  {availability.label}
                </span>
              </m.div>
            </nav>
          </m.div>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
