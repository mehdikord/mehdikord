"use client";

import { useInView } from "motion/react";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

import { OrbitStage } from "@/components/expertise/OrbitStage";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { useFinePointer, useMediaQuery } from "@/hooks/use-media-query";
import { interpolate, localizeDigits, pad } from "@/i18n/format";
import { useLocale } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/utils";
import type { SkillGroup } from "@/types/portfolio";

/*
 * Skill groups as a tabbed explorer: a list of areas that selects on hover,
 * focus or tap, and an orbital stage showing the chosen area's capabilities.
 * While on screen and untouched it cycles through the areas by itself.
 * Below the `lg` breakpoint every area is listed with its capabilities instead.
 */

const AUTOPLAY_MS = 5200;

export interface ExpertiseCopy {
  index: string;
  moduleLabel: string;
  capabilities: string;
  listLabel: string;
  stageLabel: string;
}

export function ExpertiseExplorer({ groups, copy }: { groups: readonly SkillGroup[]; copy: ExpertiseCopy }) {
  const locale = useLocale();
  const baseId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const finePointer = useFinePointer();
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const inView = useInView(rootRef, { amount: 0.4 });

  const [active, setActive] = useState(0);
  const [engaged, setEngaged] = useState(false);
  const autoplay = inView && !engaged && !reduceMotion && groups.length > 1;

  useEffect(() => {
    if (!autoplay) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % groups.length), AUTOPLAY_MS);
    return () => window.clearInterval(timer);
    // Restart the countdown whenever the selection changes.
  }, [autoplay, groups.length, active]);

  const group = groups[active];
  if (!group) return null;

  const tabId = (index: number) => `${baseId}-tab-${index}`;
  const panelId = `${baseId}-panel`;
  const code = (index: number) => `${copy.index}.${pad(locale, index + 1)}`;
  const count = (items: readonly string[]) => interpolate(copy.capabilities, { count: pad(locale, items.length) });

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const delta = event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const next = (active + delta + groups.length) % groups.length;
    setActive(next);
    document.getElementById(tabId(next))?.focus();
  }

  return (
    <div ref={rootRef} className="mt-16 md:mt-20">
      {/* Desktop: explorer */}
      <div
        className="hidden lg:grid lg:grid-cols-12 lg:items-center lg:gap-8"
        onPointerEnter={() => setEngaged(true)}
        onPointerLeave={() => setEngaged(false)}
        onFocusCapture={() => setEngaged(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setEngaged(false);
        }}
      >
        <Reveal className="lg:col-span-5">
          <div role="tablist" aria-label={copy.listLabel} aria-orientation="vertical" className="border-t border-line" onKeyDown={handleKeyDown}>
            {groups.map((item, index) => {
              const selected = index === active;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  id={tabId(index)}
                  aria-selected={selected}
                  aria-controls={panelId}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  onPointerEnter={finePointer ? () => setActive(index) : undefined}
                  className="group relative flex w-full items-center gap-5 border-b border-line py-5 pe-2 ps-5 text-start outline-none transition-colors duration-500 xl:gap-6 xl:py-6"
                >
                  <span aria-hidden className="absolute inset-0 -z-10 bg-white/[0.025] opacity-0 transition-opacity duration-500 group-aria-selected:opacity-100" />
                  <span aria-hidden className="absolute inset-y-0 start-0 w-px origin-top scale-y-0 bg-accent transition-transform duration-700 ease-out-expo group-aria-selected:scale-y-100" />
                  {selected && autoplay ? (
                    <span key={active} aria-hidden className="expertise-progress absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-accent to-indigo rtl:origin-right rtl:bg-gradient-to-l" />
                  ) : null}

                  <span className="label-mono w-11 shrink-0 text-fg-subtle transition-colors duration-300 group-aria-selected:text-accent">
                    {code(index)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        "block text-lg font-medium tracking-tight transition-[color,translate] duration-500 ease-out-expo xl:text-xl",
                        selected ? "translate-x-1 text-fg rtl:-translate-x-1" : "text-fg-muted group-hover:text-fg",
                      )}
                    >
                      {item.title}
                    </span>
                    <span className="mt-1 block text-sm text-fg-subtle">{item.annotation}</span>
                  </span>
                  <span className="label-mono shrink-0 text-fg-subtle">{pad(locale, item.items.length)}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={0.15} className="lg:col-span-7">
          <OrbitStage
            group={group}
            code={code(active)}
            position={`${pad(locale, active + 1)} / ${pad(locale, groups.length)}`}
            moduleLabel={copy.moduleLabel}
            capabilitiesLabel={count(group.items)}
            panelId={panelId}
            tabId={tabId(active)}
            ariaLabel={interpolate(copy.stageLabel, { title: group.title })}
          />
        </Reveal>
      </div>

      {/* Up to lg: every area with its capabilities */}
      <RevealGroup as="ul" className="grid gap-4 sm:grid-cols-2 lg:hidden">
        {groups.map((item, index) => (
          <RevealItem as="li" key={item.id} className="glass-card rounded-lg p-5 sm:p-6">
            <div className="label-mono flex items-center justify-between text-fg-subtle">
              <span className="text-accent">{code(index)}</span>
              <span>{localizeDigits(locale, count(item.items))}</span>
            </div>
            <h3 className="mt-5 text-lg font-medium tracking-tight">{item.title}</h3>
            <p className="mt-1 text-sm text-fg-subtle">{item.annotation}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {item.items.map((skill) => (
                <li key={skill} className="rounded-full border border-line-strong bg-white/[0.03] px-3 py-1.5 text-[0.8125rem] text-fg">
                  {skill}
                </li>
              ))}
            </ul>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}
