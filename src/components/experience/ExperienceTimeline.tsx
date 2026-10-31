"use client";

import { AnimatePresence, m, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

import { SpotlightCard } from "@/components/contact/SpotlightCard";
import { CompanyLogo } from "@/components/experience/CompanyLogo";
import { ease, viewportOnce } from "@/components/motion/motion-variants";
import { Reveal } from "@/components/motion/Reveal";
import { StatusDot } from "@/components/ui/StatusDot";
import { formatYearMonth, interpolate, localizeDigits, pad } from "@/i18n/format";
import { useLocale } from "@/i18n/LocaleProvider";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import type { ExperienceEntry } from "@/types/portfolio";

/*
 * Career timeline as a two-part reader. A sticky rail lists every role with
 * a large year readout that follows the role being read; the roles
 * themselves are glass cards along a track that fills as the visitor scrolls,
 * with a glowing marker travelling the track and lighting each node. Below
 * `lg` the rail becomes a sticky strip of role chips.
 */

export interface ExperienceCopy {
  present: string;
  responsibilitiesLabel: string;
  technologiesLabel: string;
  railLabel: string;
  currentBadge: string;
  rolesLabel: string;
  yearsLabel: string;
}

interface ExperienceTimelineProps {
  entries: readonly ExperienceEntry[];
  copy: ExperienceCopy;
}

const year = (value: string) => value.slice(0, 4);

/** Index of the role sitting in the reading band of the viewport. */
function useActiveRole(count: number) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-role-card]"));
    if (cards.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number(entry.target.getAttribute("data-role-card")));
        }
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [count]);

  return active;
}

const noSubscription = () => () => {};

/**
 * The current year, read on the client only: the server and the prerender
 * fall back to the latest year in the data, so output stays deterministic.
 */
function useCurrentYear(fallback: number) {
  return useSyncExternalStore(
    noSubscription,
    () => new Date().getFullYear(),
    () => fallback,
  );
}

function scrollToRole(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function ExperienceTimeline({ entries, copy }: ExperienceTimelineProps) {
  const locale = useLocale();
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const trackRef = useRef<HTMLOListElement>(null);
  const active = useActiveRole(entries.length);
  const activeEntry = entries[active] ?? entries[0];

  // Track fill, travelling marker and the rail's year bar follow the reading position.
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start 60%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const progressPercent = useTransform(progress, (value) => `${value * 100}%`);

  const firstYear = entries.length ? Number(year(entries[entries.length - 1]?.start ?? "")) : 0;
  const latestInData = entries.reduce((max, entry) => Math.max(max, Number(year(entry.end ?? entry.start))), firstYear);
  const currentYear = useCurrentYear(latestInData);
  const lastYear = entries.some((entry) => entry.end === null) ? currentYear : latestInData;
  const span = Math.max(1, lastYear - firstYear);

  const cardId = (entry: ExperienceEntry) => `role-${entry.id}`;

  if (!activeEntry) return null;

  return (
    <div className="mt-14 md:mt-20 lg:grid lg:grid-cols-12 lg:gap-x-8">
      {/* Sticky rail (lg and up) */}
      <aside className="hidden lg:col-span-4 lg:block">
        <div className="sticky top-[calc(var(--nav-h)+2rem)]">
          <Reveal still>
            <p className="label-mono flex items-center gap-3 text-fg-subtle">
              {copy.railLabel}
              <span aria-hidden className="h-px flex-1 bg-line" />
              <span>{interpolate(copy.rolesLabel, { count: pad(locale, entries.length) })}</span>
            </p>

            {/* Year readout follows the role being read. */}
            <div className="mt-6 flex items-end gap-3" aria-live="polite">
              <div className="relative h-[4.5rem] min-w-[11.5rem] overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  <m.span
                    key={activeEntry.id}
                    className="absolute inset-0 block font-mono text-[4.5rem] leading-none font-medium tracking-[-0.05em] tabular-nums"
                    initial={{ y: "60%", opacity: 0, filter: "blur(6px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    exit={{ y: "-60%", opacity: 0, filter: "blur(6px)" }}
                    transition={{ duration: 0.55, ease: ease.outExpo }}
                  >
                    {localizeDigits(locale, year(activeEntry.start))}
                  </m.span>
                </AnimatePresence>
              </div>
              <p className="label-mono pb-2 text-fg-muted">
                <span aria-hidden className="me-2 inline-block text-accent rtl:-scale-x-100">
                  →
                </span>
                {activeEntry.end ? localizeDigits(locale, year(activeEntry.end)) : <span className="text-fg">{copy.present}</span>}
              </p>
            </div>

            <ol className="mt-8 border-t border-line">
              {entries.map((entry, index) => {
                const selected = index === active;
                return (
                  <li key={entry.id}>
                    <button
                      type="button"
                      onClick={() => scrollToRole(cardId(entry))}
                      aria-current={selected ? "true" : undefined}
                      className="group relative flex w-full items-start gap-4 border-b border-line py-4 ps-4 text-start transition-colors duration-500"
                    >
                      <span aria-hidden className="absolute inset-0 -z-10 bg-tint/[0.025] opacity-0 transition-opacity duration-500 group-aria-[current=true]:opacity-100" />
                      <span aria-hidden className="absolute inset-y-0 start-0 w-px origin-top scale-y-0 bg-accent transition-transform duration-700 ease-out-expo group-aria-[current=true]:scale-y-100" />
                      <CompanyLogo
                        src={entry.logo}
                        name={entry.company}
                        className={cn("mt-0.5 transition-[scale,opacity] duration-500", selected ? "scale-105 opacity-100" : "opacity-70 group-hover:opacity-100")}
                      />
                      <span className="min-w-0 flex-1">
                        <span className={cn("block text-[0.9375rem] font-medium tracking-tight transition-colors duration-300", selected ? "text-fg" : "text-fg-muted group-hover:text-fg")}>
                          {entry.position}
                        </span>
                        <span className="mt-0.5 block text-xs text-fg-subtle">{entry.company}</span>
                      </span>
                      <span className={cn("label-mono mt-1 shrink-0 transition-colors duration-300", selected ? "text-accent" : "text-fg-subtle")}>
                        {localizeDigits(locale, year(entry.start))}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>

            <p className="label-mono mt-6 flex items-center gap-3 text-fg-subtle">
              <span className="text-fg">{localizeDigits(locale, firstYear)}</span>
              <span aria-hidden className="relative h-px flex-1 bg-line">
                <m.span
                  className="absolute inset-y-0 start-0 bg-gradient-to-r from-accent to-indigo rtl:bg-gradient-to-l"
                  style={{ width: reduceMotion ? "100%" : progressPercent }}
                />
              </span>
              <span className="text-fg">{localizeDigits(locale, lastYear)}</span>
              <span>· {interpolate(copy.yearsLabel, { count: localizeDigits(locale, `${span}+`) })}</span>
            </p>
          </Reveal>
        </div>
      </aside>

      {/* Sticky role strip (below lg) */}
      <div className="sticky top-[calc(var(--nav-h)+0.25rem)] z-20 -mx-(--gutter) mb-8 px-(--gutter) lg:hidden">
        <div className="glass-nav no-scrollbar flex gap-1.5 overflow-x-auto rounded-full p-1.5">
          {entries.map((entry, index) => {
            const selected = index === active;
            return (
              <button
                key={entry.id}
                type="button"
                onClick={() => scrollToRole(cardId(entry))}
                aria-current={selected ? "true" : undefined}
                className={cn(
                  "inline-flex h-9 shrink-0 items-center gap-2 rounded-full px-3.5 text-[0.8125rem] font-medium whitespace-nowrap transition-colors duration-300",
                  selected ? "bg-fg text-ink-950" : "text-fg-muted",
                )}
              >
                <CompanyLogo src={entry.logo} name={entry.company} size="sm" />
                <span className={cn("font-mono text-[0.6875rem]", selected ? "text-ink-950/70" : "text-accent")}>
                  {localizeDigits(locale, year(entry.start))}
                </span>
                {entry.position}
              </button>
            );
          })}
        </div>
      </div>

      {/* Track and cards */}
      <ol ref={trackRef} className="relative ps-7 lg:col-span-8 lg:ps-10">
        <div aria-hidden className="absolute top-3 bottom-3 start-[7px] w-px bg-line lg:start-[11px]">
          <m.div
            className="absolute inset-x-0 top-0 bg-gradient-to-b from-accent via-accent to-indigo"
            style={{ height: reduceMotion ? "100%" : progressPercent }}
          />
          {reduceMotion ? null : (
            <m.span
              className="absolute start-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_0_6px_var(--color-accent-soft),0_0_24px_var(--color-accent)]"
              style={{ top: progressPercent }}
            />
          )}
        </div>

        {entries.map((entry, index) => {
          const isCurrent = entry.end === null;
          const selected = index === active;
          return (
            <li key={entry.id} id={cardId(entry)} data-role-card={index} className="relative pb-10 last:pb-0 md:pb-14">
              {/* Node on the track */}
              <span
                aria-hidden
                className={cn(
                  "absolute top-7 -start-7 flex size-[15px] items-center justify-center rounded-full border bg-ink-950 transition-[border-color,box-shadow] duration-500 lg:-start-10 lg:size-[23px]",
                  selected ? "border-accent shadow-[0_0_0_4px_var(--color-accent-soft)]" : "border-line-strong",
                )}
              >
                <span className={cn("size-1.5 rounded-full transition-colors duration-500 lg:size-2", selected ? "bg-accent" : "bg-line-strong")} />
              </span>

              <Reveal>
                <SpotlightCard
                  className={cn(
                    "group glass-card rounded-lg p-5 transition-[border-color] duration-500 sm:p-7 md:p-8",
                    selected && "border-accent/40",
                  )}
                >
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <p className="label-mono text-fg-muted">
                      <time dateTime={entry.start}>{formatYearMonth(locale, entry.start)}</time>
                      <span aria-hidden> — </span>
                      {entry.end ? <time dateTime={entry.end}>{formatYearMonth(locale, entry.end)}</time> : <span className="text-fg">{copy.present}</span>}
                    </p>
                    {entry.location ? <p className="label-mono text-fg-subtle">· {entry.location}</p> : null}
                    {isCurrent ? (
                      <p className="label-mono ms-auto inline-flex items-center gap-2 rounded-full border border-signal/40 bg-signal/10 px-3 py-1 text-signal">
                        <StatusDot />
                        {copy.currentBadge}
                      </p>
                    ) : null}
                  </div>

                  <div className="mt-5 flex items-start gap-4">
                    <CompanyLogo src={entry.logo} name={entry.company} size="lg" className="mt-0.5 group-hover:-rotate-3 group-hover:scale-105" />
                    <div className="min-w-0">
                      <h3 className="text-[clamp(1.375rem,1.1rem+1vw,1.875rem)] leading-tight font-semibold tracking-[-0.03em] text-balance">
                        {entry.position}
                      </h3>
                      <p className="mt-1.5 text-fg-muted">
                        <span className="text-fg">{entry.company}</span>
                        {entry.companyContext ? <span className="text-fg-subtle"> · {entry.companyContext}</span> : null}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 max-w-2xl text-pretty text-fg-muted">{entry.description}</p>

                  <div className="mt-7 grid gap-7 border-t border-line pt-6 lg:grid-cols-[1.4fr_1fr] lg:gap-10">
                    <div>
                      <h4 className="label-mono text-fg-subtle">{copy.responsibilitiesLabel}</h4>
                      <m.ul
                        className="mt-4 space-y-2.5 text-[0.9375rem]"
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportOnce}
                        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } }}
                      >
                        {entry.responsibilities.map((item) => (
                          <m.li
                            key={item}
                            className="flex gap-3 text-pretty"
                            variants={{
                              hidden: { opacity: 0, x: locale === "fa" ? 10 : -10 },
                              visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: ease.outExpo } },
                            }}
                          >
                            <svg aria-hidden viewBox="0 0 16 16" className="mt-[0.3em] size-3.5 shrink-0 text-accent">
                              <m.path
                                d="M3 8.5l3.2 3L13 4.5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={1.75}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                variants={{
                                  hidden: { pathLength: 0 },
                                  visible: { pathLength: 1, transition: { duration: 0.5, ease: ease.outQuart, delay: 0.15 } },
                                }}
                              />
                            </svg>
                            {item}
                          </m.li>
                        ))}
                      </m.ul>
                    </div>
                    <div>
                      <h4 className="label-mono text-fg-subtle">{copy.technologiesLabel}</h4>
                      <ul dir="ltr" className="mt-4 flex flex-wrap gap-1.5 rtl:justify-end">
                        {entry.technologies.map((technology) => (
                          <li
                            key={technology}
                            className="rounded-full border border-line-strong bg-tint/[0.03] px-2.5 py-1 font-mono text-[0.75rem] text-fg-muted transition-colors duration-300 hover:border-accent/50 hover:text-fg"
                          >
                            {technology}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </SpotlightCard>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
